import useSWR from "swr";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { parseISO, formatISO } from "date-fns";
import { useEffect, useState, useCallback, Fragment, useMemo } from "react";

import { Box, Grid, Typography, Stack, Button } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import get from "lodash/get";
import set from "lodash/set";
import pick from "lodash/pick";
import omit from "lodash/omit";
import isEmpty from "lodash/isEmpty";

import { USER, USER_ADDRESS } from "apis";

import { DETAIL, CREATE, EDIT, USERS, ASSIGN_PERMISSION } from "routes";

import {
  LoadingDynamic as Loading,
  Card,
  BackButton,
  LoadingButton,
  AddressDetail,
  Container,
  DeleteButton,
} from "components";

import { usePermission, useChoice, useConfirmation, useNotification } from "hooks";
import {
  defaultUserFormState,
  UserAddressSchemaProps,
  userSchema,
  UserSchemaProps,
} from "yups";
import DynamicMessage from "messages";
import UserForm from "./components/UserForm";
import axios from "axios.config";

import { USER_ITEM, USER_ADDRESS_ITEM } from "interfaces";
import {
  transformUrl,
  convertValueToTupleForAddress,
  transformJSONToFormData,
} from "libs";
import { ADMIN_USERS_ADDRESSES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_USERS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

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

  const [defaultUserValues, setDefaultUserValues] = useState<UserSchemaProps>();
  const [transformedAddressListData, setTransformedAddressListData] =
    useState<UserAddressSchemaProps[]>();

  const { data: userData, mutate: userMutate } = useSWR<USER_ITEM>(() => {
    const id = get(router, "query.ids[0]");

    if (id) {
      const params = {
        use_cache: false,
      };

      return transformUrl(`${USER}${id}`, params);
    }
  });

  const { data: userAddressData, mutate: userAddressMutate } = useSWR<
    USER_ADDRESS_ITEM[]
  >(() => {
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

    const data = {} as UserSchemaProps;

    const keyList = [...Object.keys(defaultUserFormState()), "id", "is_superuser"];

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

      setTransformedAddressListData(responseArr as any[] as UserAddressSchemaProps[]);
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
  defaultUserValues: UserSchemaProps;
  transformedAddressListData: UserAddressSchemaProps[];
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
    async ({ data, dirtyFields }: { data: UserSchemaProps; dirtyFields: object }) => {
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

            await axios.patch(`${USER}${userId}/`, body);
          } else {
            const formData = transformJSONToFormData(data, dirtyFields);

            await axios.patch(`${USER}${userId}/`, formData, {
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

        const { data: resData } = await axios.get(`${USER}${userId}/reset-password/`);

        const token = get(resData, "token");

        await axios.post(`${USER}${userId}/reset-password/`, {
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

        await axios.delete(`${USER}${userId}/`);

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
