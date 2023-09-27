import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useEffect, useState, useCallback, useMemo, useContext } from "react";

import useSWR, { KeyedMutator } from "swr";
import AddIcon from "@mui/icons-material/Add";
import { parseISO, formatISO } from "date-fns";
import { get, set, pick, omit, isEmpty } from "lodash";
import { Box, Grid, Typography, Stack, Container } from "@mui/material";

import {
  Card,
  BackButton,
  LoadingButton,
  AddressDetail,
  LoadingDynamic as Loading,
} from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { convertValueToTupleForAddress } from "libs";
import { Context as CustomerContext } from "./context";
import { CUSTOMERS, DETAIL, CREATE, EDIT } from "routes";
import { transformUrl, transformJSONToFormData } from "libs";
import { usePermission, useConfirmation, useNotification } from "hooks";

import {
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import {
  ADMIN_CUSTOMERS_DRAFTS_END_POINT,
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT,
} from "__generated__/END_POINT";

import { ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";
import { ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_CUSTOMERS_DRAFTS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const UserForm = dynamic(() => import("../components/UserForm"), {
  loading: () => {
    return <Loading />;
  },
});

const CreateAddress = dynamic(() => import("./CreateAddress"), {
  loading: () => {
    return <Loading />;
  },
});

const UpdateAddress = dynamic(() => import("./UpdateAddress"), {
  loading: () => {
    return <Loading />;
  },
});

interface CUSTOMER_EXTENDS_TYPE
  extends ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE {}

const EditCustomerDetail = () => {
  const router = useRouter();
  const isMounted = useMountedState();
  const context = useContext(CustomerContext);

  const [defaultCustomerValues, setDefaultCustomerValues] = useState<any>();

  const [transformedAddressListData, setTransformedAddressListData] = useState<any[]>();

  const { data: customerData, mutate: customerMutate } =
    useSWR<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1>(() => {
      const id = router.query.id;

      if (id) {
        const params = {
          nested_depth: 3,
          use_cache: false,
        };

        return transformUrl(`${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${id}`, params);
      }
    });

  const { data: addressListData, mutate: addressListMutate } = useSWR<
    ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE[]
  >(() => {
    const draftId = get(customerData, "id");

    if (draftId) {
      const params = {
        user: draftId,
        type: "draft",
        use_cache: false,
        get_all: true,
      };

      return transformUrl(`${ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT}`, params);
    }
  });

  useEffect(() => {
    if (customerData == undefined) {
      return;
    }

    let body = {} as CUSTOMER_EXTENDS_TYPE;

    const keyList = [...Object.keys(ADMIN_CUSTOMERS_DRAFTS_POST_DEFAULT_VALUE)];

    keyList.forEach((key) => {
      if (key === "avatar") {
        if (!isEmpty(customerData[key])) {
          const imageLink = get(customerData, "avatar.default");

          set(body, "avatar", [
            {
              file: imageLink,
            },
          ]);
        } else {
          set(body, "avatar", []);
        }

        return;
      }

      if (key === "tax_identification_number" || key === "email") {
        if (customerData[key] == null) {
          set(customerData, key, "");
          return;
        }
      }

      if (key === "birthday") {
        const value = get(customerData, key);

        if (value == null) {
          set(body, key, null);
          return;
        }

        set(body, key, parseISO(value));

        return;
      }

      set(body, key, customerData[key]);
    });

    context.set({
      id: get(customerData, "official_customer.id"),
    });

    set(body, "id", customerData.id);

    setDefaultCustomerValues(body);
  }, [customerData]);

  useEffect(() => {
    if (addressListData == undefined) return;

    Promise.all(
      addressListData.map(async (el) => {
        return convertValueToTupleForAddress(el).then((resData) => {
          return {
            ...omit(el, ["ward", "district", "province"]),
            ...resData,
          };
        });
      })
    ).then((responseArr) => {
      if (!isMounted()) return;

      setTransformedAddressListData(responseArr as any[] as any[]);
    });
  }, [addressListData]);

  const onSuccessHandler = useCallback(async () => {
    await customerMutate();
    router.replace(`/${CUSTOMERS}/${DETAIL}/${router.query.id}`);
  }, []);

  let children = useMemo(() => {
    if (defaultCustomerValues == undefined || transformedAddressListData == undefined) {
      return <Loading />;
    }
    return (
      <RootComponent
        {...{
          defaultCustomerValues,
          transformedAddressListData,
          addressListMutate,
          onSuccessHandler,
        }}
      />
    );
  }, [
    defaultCustomerValues,
    transformedAddressListData,
    addressListMutate,
    onSuccessHandler,
  ]);

  return <Container>{children}</Container>;
};

interface RootComponentProps {
  defaultCustomerValues: CUSTOMER_EXTENDS_TYPE;
  transformedAddressListData: ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE[];
  addressListMutate: KeyedMutator<ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE[]>;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = ({
  defaultCustomerValues,
  transformedAddressListData,
  addressListMutate,
  onSuccessHandler,
}: RootComponentProps) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: defaultCustomerValues,
    resolver: ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const router = useRouter();
  const isMounted = useMountedState();
  const [loading, setLoading] = useState({});
  const { messages, formatMessage } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const [deleteLoading, setDeleteLoading] = useState({});
  const { hasPermission: writePermission } = usePermission("write_customer");
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const createAddressHandler = useCallback(() => {
    const id = router.query.id;
    router.push(`/${CUSTOMERS}/${DETAIL}/${id}/${EDIT}/${id}/${CREATE}`);
  }, [router.query]);

  const updateAddressHandler = useCallback(
    async (data) => {
      const id = router.query.id;

      router.push(`/${CUSTOMERS}/${DETAIL}/${id}/${EDIT}/${id}/${EDIT}/${data.id}`);
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
        await axios.delete(`${ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT}${id}/`);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.deleteSuccessfully, {
            content: "địa chỉ",
          })
        );

        onClose();

        addressListMutate();
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
      data: CUSTOMER_EXTENDS_TYPE;
      dirtyFields: object;
    }) => {
      try {
        setLoading((prev) => {
          return {
            ...prev,
            ["complete"]: true,
          };
        });

        if (!isEmpty(dirtyFields)) {
          const { id, tax_identification_number } = data;

          const email = get(data, "email");
          const birthday = get(data, "birthday");

          const avatar = get(data, "avatar");

          if (email === "") {
            set(data, "email", null);
          }

          if (birthday) {
            set(data, "birthday", formatISO(new Date(birthday)));
          }

          if (!isEmpty(avatar)) {
            const transformedAvatar = avatar.map((el) => {
              return el.file;
            });
            set(data, "avatar", transformedAvatar);
          } else {
            set(data, "avatar", null);
          }

          const isChangeType = get(dirtyFields, "type");

          if (isChangeType) {
            set(data, "type", get(data, "type"));
          }

          if (isEmpty(tax_identification_number)) {
            set(data, "tax_identification_number", null);
          }

          if (data.avatar == null) {
            const body = pick(data, Object.keys(dirtyFields));

            await axios.patch(`${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${id}/`, body);
          } else {
            const formData = transformJSONToFormData(data, dirtyFields);

            await axios.patch(`${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${id}/`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          }

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "khách hàng",
            })
          );

          onSuccessHandler();
        } else {
          router.back();
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

  let draftQuery = router.query.draft;

  if (draftQuery?.[1] === "create") {
    return (
      <Grid item xs={12}>
        <CreateAddress onSuccessHandler={addressListMutate} />
      </Grid>
    );
  } else if (draftQuery?.[1] === "edit") {
    return (
      <Grid item xs={12}>
        <UpdateAddress onSuccessHandler={addressListMutate} />
      </Grid>
    );
  } else {
    return (
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={6}>
            <Card
              title={messages["customerInfo"] as string}
              body={
                <UserForm
                  {...{
                    control,
                    watch,
                    setError,
                    clearErrors,
                  }}
                />
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Card
              title={messages["addressInfo"]}
              body={
                <Stack spacing={2}>
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
            <Stack
              flexDirection={"row"}
              justifyContent="space-between"
              alignItems={"center"}
            >
              <BackButton
                pathname={`/${CUSTOMERS}/${DETAIL}/${router.query.id}`}
                disabled={loading["complete"]}
              />

              <LoadingButton
                loading={!!loading["complete"]}
                onClick={handleSubmit((data) => {
                  onSubmit({ data, dirtyFields });
                })}
              >
                {loading["complete"]
                  ? messages["updatingStatus"]
                  : messages["updateStatus"]}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

export default EditCustomerDetail;
