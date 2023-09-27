import useSWR from "swr";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { parseISO, formatISO } from "date-fns";
import { Box, Grid, Typography, Stack, Button } from "@mui/material";
import { useEffect, useState, useCallback, Fragment, useMemo } from "react";

import get from "lodash/get";
import set from "lodash/set";
import pick from "lodash/pick";
import omit from "lodash/omit";
import isEmpty from "lodash/isEmpty";
import AddIcon from "@mui/icons-material/Add";

import {
  Card,
  Container,
  BackButton,
  DeleteButton,
  LoadingButton,
  AddressDetail,
  LoadingDynamic as Loading,
} from "components";

import {
  transformUrl,
  transformJSONToFormData,
  convertValueToTupleForAddress,
} from "libs";
import { DETAIL, CREATE, EDIT, USERS, ASSIGN_PERMISSION } from "routes";
import { usePermission, useChoice, useConfirmation, useNotification } from "hooks";

import axios from "axios.config";
import DynamicMessage from "messages";
import UserForm from "./components/UserForm";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_USERS_ADDRESSES_END_POINT,
} from "__generated__/END_POINT";
import {
  ADMIN_USERS_POST_YUP_RESOLVER,
  ADMIN_USERS_POST_YUP_SCHEMA_TYPE,
  ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_USERS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreateAddress = dynamic(() => import("./components/CreateAddress"), {
  loading: () => {
    return <Loading />;
  },
});

const UpdateAddress = dynamic(() => import("./components/UpdateAddress"), {
  loading: () => {
    return <Loading />;
  },
});
const AssignPermission = dynamic(() => import("./components/AssignPermission"), {
  loading: () => {
    return <Loading />;
  },
});

const UserDetail = () => {
  const router = useRouter();

  const isMounted = useMountedState();

  const [defaultUserValues, setDefaultUserValues] =
    useState<ADMIN_USERS_POST_YUP_SCHEMA_TYPE>();
  const [transformedAddressListData, setTransformedAddressListData] =
    useState<ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE[]>();

  const { data: userData, mutate: userMutate } = useSWR<any>(() => {
    const id = get(router, "query.ids[0]");

    if (id) {
      const params = {
        use_cache: false,
      };

      return transformUrl(`${ADMIN_USERS_END_POINT}${id}`, params);
    }
  });

  const { data: userAddressData, mutate: userAddressMutate } = useSWR<any>(() => {
    const id = get(router, "query.ids[0]");

    if (id) {
      const params = {
        user: id,
        use_cache: false,
        get_all: true,
      };

      return transformUrl(`${ADMIN_USERS_ADDRESSES_END_POINT}`, params);
    }
  });

  useEffect(() => {
    if (userData == undefined) {
      return;
    }

    const data = {} as ADMIN_USERS_POST_YUP_SCHEMA_TYPE;

    const keyList = [
      ...Object.keys(ADMIN_USERS_POST_DEFAULT_VALUE),
      "id",
      "is_superuser",
    ];

    keyList.forEach((key) => {
      set(data, key, userData[key]);
    });

    const avatar = get(userData, "avatar");

    if (!isEmpty(avatar)) {
      set(data, "avatar", [{ file: get(userData, `avatar.default`) }]);
    } else {
      set(data, "avatar", []);
    }

    const birthday = get(data, "birthday");

    if (birthday && typeof birthday === "string") {
      set(data, "birthday", parseISO(birthday));
    }

    set(data, "username", get(data, "username") || "");
    set(data, "email", get(data, "email") || "");

    setDefaultUserValues(data);
  }, [userData]);

  useEffect(() => {
    if (userAddressData == undefined) {
      return;
    }

    Promise.all(
      userAddressData.map(async (el) => {
        return convertValueToTupleForAddress(el).then((resData) => {
          const userId = get(el, "user.id").toString();

          return {
            ...omit(el, ["ward", "district", "province"]),
            ...resData,
            user: userId,
          };
        });
      })
    ).then((responseArr) => {
      if (!isMounted()) return;

      setTransformedAddressListData(
        responseArr as any[] as ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE[]
      );
    });
  }, [userAddressData]);

  const onSuccessHandler = useCallback(async () => {
    await Promise.all([userMutate(), userAddressMutate()]);

    setDefaultUserValues(undefined);
    router.replace(`/${USERS}`);
  }, []);

  const onUpdateAddressHandler = useCallback(async () => {
    await userAddressMutate();
  }, []);

  if (defaultUserValues == undefined || transformedAddressListData == undefined) {
    return <Loading />;
  }

  return (
    <RootComponent
      {...{
        defaultUserValues,
        transformedAddressListData,
        onSuccessHandler,
        onUpdateAddressHandler,
      }}
    />
  );
};

interface RootComponentProps {
  defaultUserValues: ADMIN_USERS_POST_YUP_SCHEMA_TYPE;
  transformedAddressListData: ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE[];
  onSuccessHandler: () => Promise<void>;
  onUpdateAddressHandler: () => Promise<void>;
}

const RootComponent = ({
  defaultUserValues,
  transformedAddressListData,
  onSuccessHandler,
  onUpdateAddressHandler,
}: RootComponentProps) => {
  const router = useRouter();
  const choice = useChoice();
  const { onConfirm, onClose } = useConfirmation();
  const { hasPermission: writePermission } = usePermission("write_user");

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: defaultUserValues,
    // resolver: userSchema(choice),
    resolver: ADMIN_USERS_POST_YUP_RESOLVER,
  });

  const [loading, setLoading] = useState({});
  const { formatMessage, messages } = useIntl();
  const [deleteLoading, setDeleteLoading] = useState({});
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);

  const isMounted = useMountedState();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const createAddressHandler = useCallback(() => {
    const id = get(router, "query.ids[0]");

    router.push(`/${USERS}/${DETAIL}/${id}/${CREATE}`);
  }, [router.query]);

  const updateAddressHandler = useCallback(
    async (data) => {
      const id = get(router, "query.ids[0]");
      const addressId = get(data, "id");

      router.push(`/${USERS}/${DETAIL}/${id}/${EDIT}/${addressId}`);
    },
    [router.query]
  );

  const deleteAddressHandler = useCallback((id) => {
    const handler = async () => {
      setDeleteLoading((prevState) => {
        return {
          ...prevState,
          [id]: true,
        };
      });

      try {
        await axios.delete(`${ADMIN_USERS_ADDRESSES_END_POINT}${id}/`);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.deleteSuccessfully, {
            content: "địa chỉ",
          })
        );

        await onUpdateAddressHandler();

        onClose();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setDeleteLoading((prevState) => {
            return {
              ...prevState,
              [id]: false,
            };
          });
        }
      }
    };

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_USERS_POST_YUP_SCHEMA_TYPE;
      dirtyFields: object;
    }) => {
      try {
        if (!isEmpty(dirtyFields)) {
          const userId = get(data, "id");

          setLoading((prev) => {
            return {
              ...prev,
              ["complete"]: true,
            };
          });

          // * AVATAR

          const transformedAvatar = get(data, "avatar").map((el) => {
            return el.file;
          });

          set(data, "avatar", transformedAvatar);

          // * EMAIL

          const email = get(data, "email");

          if (email === "") {
            set(data, "email", null);
          }

          // * BIRTHDAY

          // const birthday = get(data, "birthday");

          // if (birthday && birthday instanceof Date) {
          //   set(data, "birthday", formatISO(birthday));
          // }

          const birthday = get(data, "birthday");

          if (birthday && birthday instanceof Date) {
            set(data, "birthday", formatISO(birthday));
          }

          if (get(dirtyFields, "avatar") && isEmpty(data.avatar)) {
            set(data, "avatar", null);
            const body = pick(data, Object.keys(dirtyFields));

            await axios.patch(`${ADMIN_USERS_END_POINT}${userId}/`, body);
          } else {
            const formData = transformJSONToFormData(data, dirtyFields);

            await axios.patch(`${ADMIN_USERS_END_POINT}${userId}/`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          }

          await onSuccessHandler();

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "người dùng",
            })
          );
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading((prev) => {
            return {
              ...prev,
              ["complete"]: false,
            };
          });
        }
      }
    },
    []
  );

  const resetPasswordHandler = useCallback(async () => {
    const handler = async () => {
      try {
        const userId = router.query.ids?.[0];

        const { data: resData } = await axios.get(
          `${ADMIN_USERS_END_POINT}${userId}/reset-password/`
        );

        const token = get(resData, "token");

        await axios.post(`${ADMIN_USERS_END_POINT}${userId}/reset-password/`, {
          token,
        });

        enqueueSnackbarWithSuccess(messages["resetPasswordSuccessfully"] as string);
      } catch (err) {
        enqueueSnackbarWithError(err);
      }
    };

    onConfirm(handler, {
      message: messages["confirmResetPassword"] as string,
      variant: "info",
    });
  }, [router]);

  const deleteUserHandler = useCallback(async () => {
    const handler = async () => {
      try {
        setDeleteUserLoading(true);

        const userId = get(router, "query.ids.[0]");

        await axios.delete(`${ADMIN_USERS_END_POINT}${userId}/`);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.deleteSuccessfully, {
            content: "user",
          })
        );

        onClose();

        router.replace(`/${USERS}`);
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setDeleteUserLoading(false);
        }
      }
    };

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const renderContent = useMemo(() => {
    const action = get(router, "query.ids[1]");

    if (action === "create") {
      return (
        <Grid item xs={12}>
          <CreateAddress onSuccessHandler={onUpdateAddressHandler} />
        </Grid>
      );
    } else if (action === "edit") {
      return (
        <Grid item xs={12}>
          <UpdateAddress onSuccessHandler={onUpdateAddressHandler} />
        </Grid>
      );
    } else if (action === "assign-permission") {
      return <AssignPermission />;
    } else {
      return (
        <Fragment>
          <Grid item xs={6}>
            <Card
              cardTitleComponent={() => {
                return (
                  <Stack
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography>{messages["userInfo"]}</Typography>
                    {writePermission && (
                      <Stack flexDirection="row" columnGap={1.5}>
                        <Button
                          variant="text"
                          color="error"
                          onClick={resetPasswordHandler}
                        >
                          {messages["resetPassword"]}
                        </Button>

                        <Button
                          variant="outlined"
                          disabled={
                            !defaultUserValues?.["is_active"] ||
                            !defaultUserValues?.["is_staff"]
                          }
                          onClick={() => {
                            const id = get(router, "query.ids[0]");
                            router.push(`/${USERS}/${DETAIL}/${id}/${ASSIGN_PERMISSION}`);
                          }}
                        >
                          {messages["assignPermission"]}
                        </Button>
                        <DeleteButton
                          disabled={deleteUserLoading}
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUserHandler();
                          }}
                        />
                      </Stack>
                    )}
                  </Stack>
                );
              }}
              body={
                <Fragment>
                  <UserForm
                    {...{
                      control,
                      setError,
                      clearErrors,
                    }}
                  />
                </Fragment>
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Card
              title={messages["listingAddress"]}
              body={
                <Stack direction="column" spacing={3}>
                  {writePermission && (
                    <Box
                      sx={{
                        padding: 3,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #000",
                        borderStyle: "dashed",
                        cursor: "pointer",
                      }}
                      onClick={createAddressHandler}
                    >
                      <AddIcon />
                      <Typography sx={{ marginLeft: 1 }}>
                        {messages["addNewAddress"]}
                      </Typography>
                    </Box>
                  )}

                  <AddressDetail
                    {...{
                      data: transformedAddressListData,
                      deleteAddressHandler,
                      updateAddressHandler,
                      deleteLoading,
                      writePermission,
                    }}
                  />
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BackButton
                onClick={() => {
                  const id = get(router, "query.ids[0]");

                  if (id) {
                    const pathname = `/${USERS}`;

                    router.push(pathname, pathname, {
                      shallow: true,
                    });
                  }
                }}
                disabled={!!loading["complete"]}
              />

              {writePermission && (
                <LoadingButton
                  loading={!!loading["complete"]}
                  disabled={!!loading["complete"]}
                  onClick={handleSubmit((data) => {
                    onSubmit({ data, dirtyFields });
                  })}
                >
                  {loading["complete"]
                    ? messages["updatingStatus"]
                    : messages["updateStatus"]}
                </LoadingButton>
              )}
            </Box>
          </Grid>
        </Fragment>
      );
    }
  }, [
    dirtyFields,
    loading,
    createAddressHandler,
    updateAddressHandler,
    transformedAddressListData,
  ]);

  return (
    <Container>
      <Grid container>{renderContent}</Grid>
    </Container>
  );
};

export default UserDetail;
