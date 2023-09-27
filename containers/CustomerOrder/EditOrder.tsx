import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState, useUpdateEffect } from "react-use";
import { useMemo, useEffect, useState, useCallback, Fragment, useContext } from "react";

import useSWR from "swr";
import { AxiosResponse } from "axios";
import { get, set, pick, unset, isEmpty, isEqual, cloneDeep } from "lodash";
import { Grid, Stack, Typography, FormControlLabel, Checkbox } from "@mui/material";

import OrderForm from "./OrderForm";
import AddressFrom from "./components/AddressForm";
import { LoadingDynamic as Loading, Card, BackButton, LoadingButton } from "components";

import { ORDERS } from "routes";
import axios from "axios.config";
import DynamicMessage from "messages";
import InvoiceProvider, { InvoiceContext } from "./context";
import { transformUrl, convertValueToTupleForAddress } from "libs";
import { usePermission, useConfirmation, useNotification } from "hooks";

import {
  ADMIN_ORDERS_POST_YUP_RESOLVER,
  ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE,
  ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER,
  ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import {
  ADMIN_ORDERS_END_POINT,
  ADMIN_ORDERS_INVOICES_END_POINT,
  ADMIN_ORDERS_BILLING_ADDRESSES_END_POINT,
  ADMIN_ORDERS_SHIPPING_ADDRESSES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_ORDERS_POST_DEFAULT_VALUE,
  ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE,
} from "__generated__/POST_DEFAULT_VALUE";

import { ADMIN_ORDER_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const ViewOrder = dynamic(() => import("./OrderLine/view/ViewOrder"), {
  loading: () => {
    return <Loading />;
  },
});

const OrderLine = dynamic(() => import("./OrderLine/Line"), {
  loading: () => {
    return <Loading />;
  },
});

const ContainerInvoice = dynamic(() => import("./Invoice/ContainerInvoice"), {
  loading: () => {
    return <Loading />;
  },
});

const EditOrder = () => {
  const router = useRouter();
  const isMounted = useMountedState();
  const [defaultValues, setDefaultValues] = useState<ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE>();

  const [defaultShippingAddressValues, setDefaultShippingAddressValues] = useState<any>();
  const [defaultBillingAddressValues, setDefaultBillingAddressValues] = useState<any>();

  const [orderId, setOrderId] = useState<string | undefined>(() => {
    return router.query.id as string | undefined;
  });

  const {
    data: orderData,
    mutate: orderMutate,
    isValidating: isValidatingOrder,
  } = useSWR<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>(() => {
    if (orderId == undefined) return;

    const params = {
      use_cache: false,
      nested_depth: 3,
    };

    return transformUrl(`${ADMIN_ORDERS_END_POINT}${orderId}`, params);
  });

  const setDefaultValueHandler = useCallback(async (inputData: any) => {
    const data = {} as ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE;

    const keyList = [
      ...Object.keys(ADMIN_ORDERS_POST_DEFAULT_VALUE),
      "id",
      "billing_address",
      "shipping_address",
    ];

    keyList.forEach((key) => {
      set(data, key, inputData[key]);
    });

    const billingAddress = get(inputData, "billing_address");
    const shippingAddress = get(inputData, "shipping_address");

    const addressKeyList = ["id", "line1", "country", "line2", "notes", "phone_number"];

    //* Billing Address

    if (billingAddress == null) {
      const defaultBillingAddress = get(inputData, "receiver.default_billing_address");

      if (defaultBillingAddress) {
        const transformedData =
          await convertValueToTupleForAddress(defaultBillingAddress);

        const transformedBillingAddress =
          {} as ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;

        addressKeyList.forEach((key) => {
          set(transformedBillingAddress, key, defaultBillingAddress[key]);
        });

        if (isMounted() && transformedData) {
          const { province, district, ward } = transformedData;

          setDefaultBillingAddressValues({
            ...transformedBillingAddress,
            province: province[0] === "" ? null : province,
            district: district[0] === "" ? null : district,
            ward: ward[0] === "" ? null : ward,
          });
        }
      } else {
        setDefaultBillingAddressValues(ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE);
      }
    } else {
      const transformedData = await convertValueToTupleForAddress(billingAddress);

      const transformedBillingAddress = {} as ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;

      addressKeyList.forEach((key) => {
        set(transformedBillingAddress, key, billingAddress[key]);
      });

      if (isMounted() && transformedData) {
        const { province, district, ward } = transformedData;

        setDefaultBillingAddressValues({
          ...transformedBillingAddress,
          province: province[0] === "" ? null : province,
          district: district[0] === "" ? null : district,
          ward: ward[0] === "" ? null : ward,
        });
      }
    }

    //* Shipping Address

    if (shippingAddress == null) {
      const defaultShippingAddress = get(inputData, "receiver.default_shipping_address");

      if (defaultShippingAddress) {
        const transformedData =
          await convertValueToTupleForAddress(defaultShippingAddress);

        const transformedShippingAddress =
          {} as ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;

        addressKeyList.forEach((key) => {
          set(transformedShippingAddress, key, defaultShippingAddress[key]);
        });

        if (isMounted() && transformedData) {
          const { province, district, ward } = transformedData;

          setDefaultShippingAddressValues({
            ...transformedShippingAddress,
            province: province[0] === "" ? null : province,
            district: district[0] === "" ? null : district,
            ward: ward[0] === "" ? null : ward,
          });
        }
      } else {
        setDefaultShippingAddressValues(ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE);
      }
    } else {
      const transformedData = await convertValueToTupleForAddress(shippingAddress);

      const transformedShippingAddress = {} as ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;

      addressKeyList.forEach((key) => {
        set(transformedShippingAddress, key, shippingAddress[key]);
      });

      if (isMounted() && transformedData) {
        const { province, district, ward } = transformedData;

        setDefaultShippingAddressValues({
          ...transformedShippingAddress,
          province: province[0] === "" ? null : province,
          district: district[0] === "" ? null : district,
          ward: ward[0] === "" ? null : ward,
        });
      }
    }

    const receiverEmail = get(data, "receiver_email");

    if (receiverEmail == null) {
      set(data, "receiver_email", "");
    }

    setDefaultValues(data);
  }, []);

  useEffect(() => {
    if (orderData == undefined) return;

    (async () => {
      await setDefaultValueHandler(orderData);
    })();
  }, [orderData]);

  const onSelectNewCustomer = useCallback((id: string) => {
    // setOrderId(id);
    // setDefaultValues(undefined);
    // setDefaultShippingAddressValues(undefined);
    // setDefaultBillingAddressValues(undefined);
  }, []);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);
    setDefaultShippingAddressValues(undefined);
    setDefaultBillingAddressValues(undefined);

    const data = await orderMutate();

    if (isMounted() && data) {
      await setDefaultValueHandler(data);
    }
  }, []);

  if (defaultValues == undefined && isValidatingOrder) return <Loading />;

  if (
    defaultValues == undefined ||
    defaultShippingAddressValues == undefined ||
    defaultBillingAddressValues == undefined
  ) {
    return <Loading />;
  }

  return (
    <InvoiceProvider>
      <RootComponent
        {...{
          defaultValues,
          defaultShippingAddressValues,
          defaultBillingAddressValues,
          onSuccessHandler,
        }}
      />
    </InvoiceProvider>
  );
};

interface RootComponentProps {
  defaultValues: ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE;
  defaultShippingAddressValues: ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;
  defaultBillingAddressValues: ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = ({
  defaultValues,
  defaultShippingAddressValues,
  defaultBillingAddressValues,
  onSuccessHandler,
}: RootComponentProps) => {
  const { hasPermission: writePermission } = usePermission("write_order");
  const { hasPermission: approvePermission } = usePermission("approve_order");

  const router = useRouter();

  const invoiceContext = useContext(InvoiceContext);

  const [approve, setApprove] = useState(false);
  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const [sameShippingAddress, setSameShippingAddress] = useState(
    isEqual(defaultBillingAddressValues, ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE)
  );

  const { data: orderInvoiceData, mutate: orderInvoiceMutate } = useSWR(
    transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
      order: router.query.id,
      limit: 1,
    })
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_ORDERS_POST_YUP_RESOLVER,
  });

  const {
    control: shippingAddressControl,
    handleSubmit: shippingAddressHandleSubmit,
    setValue: shippingAddressSetValue,
    watch: shippingAddressWatch,
    reset: shippingAddressReset,
    formState: { dirtyFields: shippingAddressDirtyFields },
  } = useForm({
    defaultValues: defaultShippingAddressValues,
    resolver: ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER,
  });

  const {
    control: billingAddressControl,
    handleSubmit: billingAddressHandleSubmit,
    setValue: billingAddressSetValue,
    watch: billingAddressWatch,
    reset: billingAddressReset,
    formState: { dirtyFields: billingAddressDirtyFields },
  } = useForm({
    defaultValues: {
      ...defaultBillingAddressValues,
    },
    resolver: ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER,
  });

  const [idShippingAddress, setIdShippingAddress] = useState(
    get(defaultShippingAddressValues, "id")
  );

  const [idBillingAddress, setIdBillingAddress] = useState(
    get(defaultBillingAddressValues, "id")
  );

  const { onConfirm, onClose } = useConfirmation();

  useEffect(() => {
    invoiceContext.set({
      mutateOrderInvoiceForCancelOrder: orderInvoiceMutate,
    });
  }, [orderInvoiceMutate]);

  useUpdateEffect(() => {
    if ((watch("receiver")?.id as unknown as any) === defaultValues?.receiver?.id) return;

    billingAddressReset(ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE);
    shippingAddressReset(ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE);
  }, [watch("receiver")]);

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
      shippingAddressData,
      shippingAddressDirtyFields,
      billingAddressData,
      billingAddressDirtyFields,
    }: {
      data: ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE;
      dirtyFields: object;
      shippingAddressData: ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;
      shippingAddressDirtyFields: object;
      billingAddressData: ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;
      billingAddressDirtyFields: object;
    }) => {
      try {
        setLoading(true);

        const orderId = get(data, "id");

        const hasBillingAddress = !!get(data, "billing_address");
        const hasShippingAddress = !!get(data, "shipping_address");

        const billingAddressId = idBillingAddress;
        const shippingAddressId = idShippingAddress;

        let shouldUpdateList = ["ward", "district", "province"];

        const resList: Promise<AxiosResponse>[] = [];

        // shouldUpdateList.forEach((key) => {
        //   if (!isEmpty(shippingAddressData[key])) {
        //     set(shippingAddressData, key, get(shippingAddressData[key], "[0]"));
        //   } else {
        //     set(shippingAddressData, key, "");
        //   }

        //   if (!isEmpty(billingAddressData[key])) {
        //     set(billingAddressData, key, get(billingAddressData[key], "[0]"));
        //   } else {
        //     set(billingAddressData, key, "");
        //   }
        // });

        if (!isEmpty(dirtyFields)) {
          set(data, "channel", get(data, "channel"));

          let receiverId = get(data, "receiver");

          if (receiverId) {
            set(data, "receiver", receiverId);
            unset(dirtyFields, "receiver_name");
            unset(dirtyFields, "receiver_email");
            unset(dirtyFields, "receiver_phone_number");
          }

          const shippingMethodId = get(data, "shipping_method");

          if (shippingMethodId) {
            set(data, "shipping_method", shippingMethodId);
          }

          const body = pick(data, Object.keys(dirtyFields));

          resList.push(axios.patch(`${ADMIN_ORDERS_END_POINT}${orderId}/`, body));
        }

        if (shippingAddressId && hasShippingAddress) {
          if (!isEmpty(shippingAddressDirtyFields)) {
            const body = pick(
              shippingAddressData,
              Object.keys(shippingAddressDirtyFields)
            );

            resList.push(
              axios.patch(
                `${ADMIN_ORDERS_SHIPPING_ADDRESSES_END_POINT}${shippingAddressId}/`,
                body
              )
            );
          }
        } else {
          set(shippingAddressData, "order", orderId);
          resList.push(
            axios.post(ADMIN_ORDERS_SHIPPING_ADDRESSES_END_POINT, shippingAddressData)
          );
        }

        if (billingAddressId && hasBillingAddress) {
          if (!isEmpty(billingAddressDirtyFields)) {
            const body = pick(billingAddressData, Object.keys(billingAddressDirtyFields));
            resList.push(
              axios.patch(
                `${ADMIN_ORDERS_BILLING_ADDRESSES_END_POINT}${billingAddressId}/`,
                body
              )
            );
          }
        } else {
          set(billingAddressData, "order", orderId);

          resList.push(
            axios.post(ADMIN_ORDERS_BILLING_ADDRESSES_END_POINT, billingAddressData)
          );
        }

        await Promise.all(resList);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "đơn hàng",
          })
        );

        onSuccessHandler();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [sameShippingAddress, idShippingAddress, idBillingAddress]
  );

  const approveHandler = useCallback(({ status }) => {
    const handler = async () => {
      const orderId = router.query.id;

      try {
        setLoading(true);

        await axios.patch(`${ADMIN_ORDERS_END_POINT}${orderId}/`, {
          status,
        });

        if (status === "Cancelled") {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.cancelSuccessfully, {
              content: "đơn hàng",
            })
          );
        } else {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.approveSuccessfully, {
              content: "đơn hàng",
            })
          );
        }

        onClose();
        onSuccessHandler();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    };

    if (status !== "Cancelled") {
      onConfirm(handler, {
        message: messages["confirmOrder"] as string,
        variant: "info",
      });

      return;
    }

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const renderContentForDraftState = useMemo(() => {
    const status = get(defaultValues, "status");

    if (status === "Draft") {
      return (
        <Fragment>
          <Grid item xs={12}>
            <Card
              title={messages["orderInfo"]}
              cardBodyComponent={() => {
                return (
                  <OrderForm
                    {...{
                      control,
                      watch,
                      setValue,
                      clearErrors,
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Card
              title={messages["shippingAddress"]}
              cardBodyComponent={() => {
                return (
                  <AddressFrom
                    {...{
                      control: shippingAddressControl,
                      setValue: shippingAddressSetValue,
                      watch: shippingAddressWatch,
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Card
              cardTitleComponent={() => {
                return (
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h6">{messages["billingAddress"]}</Typography>

                    {isEqual(
                      defaultBillingAddressValues,
                      ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE
                    ) && (
                      <FormControlLabel
                        sx={{
                          marginBottom: 0,
                          marginRight: 0,
                        }}
                        control={
                          <Checkbox
                            sx={{
                              marginRight: 1,
                              width: 20,
                              height: 20,
                            }}
                            value={sameShippingAddress}
                            defaultChecked
                            onChange={(e) => {
                              setSameShippingAddress((prev) => {
                                return !prev;
                              });
                            }}
                          />
                        }
                        label={messages["sameAsShippingAddress"]}
                      />
                    )}
                  </Stack>
                );
              }}
              cardBodyComponent={() => {
                return (
                  <AddressFrom
                    {...{
                      control: billingAddressControl,
                      setValue: billingAddressSetValue,
                      watch: billingAddressWatch,
                      isDisabled: sameShippingAddress,
                    }}
                  />
                );
              }}
            />
          </Grid>
        </Fragment>
      );
    }

    return null;
  }, [
    defaultValues,
    defaultBillingAddressValues,
    sameShippingAddress,
    shippingAddressWatch("district"),
    shippingAddressWatch("province"),
    shippingAddressWatch("ward"),
    billingAddressWatch("district"),
    billingAddressWatch("province"),
    billingAddressWatch("ward"),
  ]);

  const renderControlPanel = useMemo(() => {
    return (
      <Stack spacing={2}>
        <LoadingButton
          loading={loading}
          disabled={loading}
          onClick={() => {
            approveHandler({ status: "Cancelled" });
          }}
          color="error"
        >
          {loading ? messages["updatingStatus"] : messages["cancelOrder"]}
        </LoadingButton>

        <LoadingButton
          loading={loading}
          disabled={loading}
          onClick={() => {
            approveHandler({ status: "Processed" });
          }}
        >
          {loading ? messages["updatingStatus"] : messages["processOrder"]}
        </LoadingButton>
      </Stack>
    );
  }, [loading]);

  const renderOrderLine = useMemo(() => {
    const status = get(defaultValues, "status");

    if (status === "Draft") {
      return <OrderLine />;
    } else {
      return <ViewOrder />;
    }
  }, [defaultValues]);

  const status = get(defaultValues, "status")!;

  return (
    <Grid container>
      {renderContentForDraftState}

      <Grid item xs={status === "Confirmed" ? 9 : 12}>
        {renderOrderLine}
      </Grid>

      {status === "Confirmed" && (
        <Grid item xs={3}>
          {writePermission && approvePermission && (
            <Card title={messages["manipulation"]} body={renderControlPanel} />
          )}
        </Grid>
      )}

      {["Partial_fulfilled", "Fulfilled", "Processed"].includes(status) && (
        <Grid item xs={12}>
          <ContainerInvoice />
        </Grid>
      )}

      <Grid item xs={12}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton pathname={`/${ORDERS}`} />

          {status === "Draft" && (
            <Stack flexDirection="row" alignItems="center">
              {approvePermission && (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={approve}
                      onChange={(e) => {
                        setApprove((prev) => {
                          return !prev;
                        });
                      }}
                    />
                  }
                  label={messages["confirmOrder"]}
                />
              )}
              {approve && approvePermission ? (
                <LoadingButton
                  loading={loading}
                  disabled={loading}
                  onClick={() => {
                    approveHandler({
                      status: "Confirmed",
                    });
                  }}
                >
                  {loading ? messages["approvingStatus"] : messages["approveStatus"]}
                </LoadingButton>
              ) : null}

              {writePermission && !approve && (
                <LoadingButton
                  loading={loading}
                  disabled={loading}
                  onClick={handleSubmit((data) => {
                    shippingAddressHandleSubmit((shippingAddressData) => {
                      if (sameShippingAddress) {
                        onSubmit({
                          data,
                          dirtyFields,
                          shippingAddressData,
                          shippingAddressDirtyFields,
                          billingAddressData: cloneDeep(shippingAddressData),
                          billingAddressDirtyFields: cloneDeep(
                            shippingAddressDirtyFields
                          ),
                        });
                      } else {
                        billingAddressHandleSubmit((billingAddressData) => {
                          onSubmit({
                            data,
                            dirtyFields,
                            shippingAddressData,
                            shippingAddressDirtyFields,
                            billingAddressData,
                            billingAddressDirtyFields,
                          });
                        })();
                      }
                    })();
                  })}
                >
                  {loading ? messages["updatingStatus"] : messages["updateStatus"]}
                </LoadingButton>
              )}
            </Stack>
          )}

          {status === "Processed" &&
            writePermission &&
            approvePermission &&
            get(orderInvoiceData, "count") === 0 && (
              <LoadingButton
                loading={loading}
                disabled={loading}
                onClick={() => {
                  approveHandler({ status: "Cancelled" });
                }}
                color="error"
              >
                {loading ? messages["updatingStatus"] : messages["cancelOrder"]}
              </LoadingButton>
            )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditOrder;
