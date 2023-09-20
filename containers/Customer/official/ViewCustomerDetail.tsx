import useSWR from "swr";
import dynamic from "next/dynamic";
import { parseISO } from "date-fns";
import { useRouter } from "next/router";
import { useToggle, useMountedState } from "react-use";

import { useIntl } from "react-intl";
import { useMemo, useState, useEffect, Fragment, useCallback, useContext } from "react";

import {
  Grid,
  Stack,
  Avatar,
  Typography,
  Alert,
  FormControl as MuiFormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { get, set, omit, isEmpty, cloneDeep } from "lodash";

import {
  Card,
  Link,
  NoData,
  Skeleton,
  FormLabel,
  IconButton,
  BackButton,
  AddressDetail,
  LoadingButton,
  LoadingDynamic as Loading,
} from "components";
import { FormControlBase, InputNumber } from "compositions";

import {
  formatDate,
  transformUrl,
  formatPhoneNumber,
  convertValueToTupleForAddress,
  getDisplayValueFromChoiceItem,
} from "libs";

import axios from "axios.config";
import DynamicMessage from "messages";
import { CUSTOMERS, DETAIL, EDIT } from "routes";
import { Context as CustomerContext } from "./context";
import { useChoice, useNotification, usePermission } from "hooks";

import {
  ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE,
  ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import {
  ADMIN_CUSTOMERS_DRAFTS_END_POINT,
  ADMIN_CUSTOMERS_ADDRESSES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_CUSTOMER_DRAFT_CUSTOMER_ADDRESS_VIEW_TYPE_V1,
  ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

const SaleInChargeDialog = dynamic(() => import("./SaleInChargeDialog"), {
  loading: () => {
    return <Loading />;
  },
});

interface CUSTOMER_INFO_TYPE extends ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE {
  id: number | undefined;
  gender: string;
  main_phone_number: string | undefined;
}

interface CUSTOMER_ADDRESS_TYPE extends ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE {
  id: number | undefined;
}

type APPROVE_HANDLER_TYPE = {
  data?: any;
  type: string;
};

const ViewCustomerDetail = () => {
  const context = useContext(CustomerContext);
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_customer");
  const { hasPermission: approvePermission } = usePermission("approve_customer");

  const router = useRouter();
  const { genders } = useChoice();
  const isMounted = useMountedState();
  const [open, toggle] = useToggle(false);

  const { loading, setLoading, enqueueSnackbarWithError, enqueueSnackbarWithSuccess } =
    useNotification();

  const [customerInfo, setCustomerInfo] = useState<CUSTOMER_INFO_TYPE>();
  const [transformedAddressListData, setTransformedAddressListData] =
    useState<CUSTOMER_ADDRESS_TYPE[]>();

  const { data: customerData, mutate: customerMutate } =
    useSWR<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1>(() => {
      const id = router.query.id;

      if (id) {
        const params = {
          nested_depth: 3,
        };

        return transformUrl(`${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${id}`, params);
      }
      return null;
    });

  const { data: addressListData, mutate: mutateAddressList } = useSWR<
    Required<ADMIN_CUSTOMER_DRAFT_CUSTOMER_ADDRESS_VIEW_TYPE_V1>[]
  >(() => {
    const officialCustomerId = get(customerData, "official_customer.id");
    if (officialCustomerId) {
      const params = {
        user: officialCustomerId,
        get_all: true,
        use_cache: false,
      };

      return transformUrl(`${ADMIN_CUSTOMERS_ADDRESSES_END_POINT}`, params);
    } else {
      return null;
    }
  });

  const onSuccessHandler = useCallback(async () => {
    await customerMutate();
    await mutateAddressList();
  }, []);

  useEffect(() => {
    if (customerData == undefined) return;

    const keyList = [
      "id",
      "email",
      "main_phone_number",
      "first_name",
      "last_name",
      "note",
      "gender",
      "facebook",
      "tax_identification_number",
      "company_name",
      "in_business",
      "type",
      "sales_in_charge",
      "max_debt",
    ];

    const cloneOfficialCustomer = cloneDeep(get(customerData, "official_customer"));

    if (cloneOfficialCustomer == undefined) {
      router.replace(`/${CUSTOMERS}`);
    } else {
      const officialCustomer = {} as CUSTOMER_INFO_TYPE;

      keyList.forEach((key) => {
        set(officialCustomer, key, cloneOfficialCustomer[key]);
      });

      const birthday = get(customerData, "birthday");
      const avatar = get(customerData, "avatar");

      if (birthday) {
        set(officialCustomer, "birthday", parseISO(birthday));
      }

      if (!isEmpty(avatar)) {
        const imageLink = get(avatar, "default");

        set(officialCustomer, "avatar", [
          {
            file: imageLink,
          },
        ]);
      } else {
        set(officialCustomer, "avatar", []);
      }

      context.set({
        id: officialCustomer.id,
      });

      setCustomerInfo(officialCustomer);
    }
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
      setTransformedAddressListData(responseArr as any[] as CUSTOMER_ADDRESS_TYPE[]);
    });
  }, [addressListData]);

  const approveHandler = useCallback(async ({ data, type }: APPROVE_HANDLER_TYPE) => {
    try {
      const { id, token } = data;

      setLoading(true);

      await axios.post(`${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${id}/${type}/`, {
        id,
        token,
      });

      if (type === "apply") {
        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.approveSuccessfully, {
            content: "thông tin khách hàng",
          })
        );
      } else if (type === "refuse") {
        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.refuseSuccessfully, {
            content: "cập nhật thông tin khách hàng",
          })
        );
      }

      await onSuccessHandler();
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  const renderLeftSide = useMemo(() => {
    if (customerInfo == undefined) return <Skeleton />;

    const birthday = get(customerInfo, "birthday");

    const avatar: string = get(customerInfo, "avatar.[0].file");

    return (
      <Grid container>
        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["lastName"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["lastName"] as string,
              },
              value: get(customerInfo, "last_name") || "-",
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["firstName"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["firstName"] as string,
              },
              value: get(customerInfo, "first_name") || "-",
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["birthday"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["birthday"] as string,
              },
              readOnly: true,
              value: birthday ? formatDate(birthday, "dd/MM/yyyy") : "-",
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["gender"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["gender"] as string,
              },
              readOnly: true,
              value:
                getDisplayValueFromChoiceItem(genders, get(customerInfo, "gender")) ||
                "-",
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["email"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["email"] as string,
              },
              value: get(customerInfo, "email") || "-",
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <Link
            href={`tel:${get(customerInfo, "main_phone_number")}`}
            sx={{
              ["& .MuiInput-input"]: {
                cursor: "pointer",
              },
            }}
          >
            <FormControlBase
              FormLabelProps={{ children: messages["phoneNumber"] as string }}
              InputProps={{
                inputProps: {
                  placeholder: messages["phoneNumber"] as string,
                },
                sx: {
                  WebkitTextFillColor: (theme) => {
                    return `${theme.palette.primary2.main} !important`;
                  },
                },
                readOnly: true,
                value: formatPhoneNumber(get(customerInfo, "main_phone_number")) || "-",
              }}
            />
          </Link>
        </Grid>

        <Grid item xs={12}>
          <MuiFormControl>
            <FormLabel children={messages["avatar"] as string} />
            <Avatar
              src={avatar || ""}
              sx={{
                width: 80,
                height: 80,
                borderRadius: "8px",
                ["& img"]: {
                  objectFit: "contain",
                },
              }}
            />
          </MuiFormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["companyName"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["companyName"] as string,
              },
              value: get(customerInfo, "company_name") || "-",
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["taxIdentificationNumber"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["taxIdentificationNumber"] as string,
              },
              value: get(customerInfo, "tax_identification_number") || "-",
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["facebook"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["facebook"] as string,
              },
              value: get(customerInfo, "facebook") || "-",
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["customerType"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["customerType"] as string,
              },
              value: get(customerInfo, "type.name") || "-",
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlBase
            FormLabelProps={{ children: messages["note"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["note"] as string,
              },
              value: get(customerInfo, "note") || "-",
              readOnly: true,
              multiline: true,
              rows: 5,
              sx: {
                padding: 1,
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlBase
            FormLabelProps={{ children: messages["businessStatus"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["businessStatus"] as string,
              },
              value: get(customerInfo, "in_business")
                ? messages["onBusiness"]
                : messages["offBusiness"],
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    );
  }, [customerInfo]);

  const renderRightSide = useMemo(() => {
    if (transformedAddressListData == undefined) return <Loading />;

    return (
      <AddressDetail
        {...{
          data: transformedAddressListData,
        }}
      />
    );
  }, [transformedAddressListData]);

  const renderSaleInCharge = useMemo(() => {
    if (customerInfo == undefined) return <Loading />;

    const saleInCharge = get(customerInfo, "sales_in_charge");

    if (!saleInCharge) {
      return (
        <Grid item xs={12}>
          <NoData />
        </Grid>
      );
    }

    const firstName = get(customerInfo, "sales_in_charge.first_name");
    const lastName = get(customerInfo, "sales_in_charge.last_name");
    const maxDebt = get(customerInfo, "max_debt.incl_tax");

    return (
      <Fragment>
        <Grid item xs={6}>
          <FormControlBase
            FormLabelProps={{ children: messages["saleInCharge"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["saleInCharge"] as string,
              },
              value: `${lastName} ${firstName}`,
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <InputNumber
            readOnly={true}
            FormLabelProps={{ children: messages["maxDebt"] as string }}
            placeholder={messages["maxDebt"] as string}
            NumberFormatProps={{
              value: parseFloat(maxDebt) || 0,
              suffix: " ₫",
            }}
          />
        </Grid>
      </Fragment>
    );
  }, [customerInfo]);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Stack spacing={3}>
          {get(customerData, "is_mutated") && (
            <Alert
              severity="info"
              sx={{
                marginBottom: "16px",
              }}
            >
              {messages["noteDraftDifferenceWithOfficial"]}
            </Alert>
          )}
          <Card
            cardTitleComponent={() => {
              return (
                <Stack
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>{messages["customerInfo"]}</Typography>

                  {writePermission && (
                    <IconButton
                      children={<EditIcon />}
                      onClick={() => {
                        const pathname = `/${CUSTOMERS}/${DETAIL}/${router.query.id}/${EDIT}/${router.query.id}`;

                        router.push(pathname, pathname, {
                          shallow: true,
                        });
                      }}
                    />
                  )}
                </Stack>
              );
            }}
            body={renderLeftSide}
          />

          <Card
            cardTitleComponent={() => {
              return (
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{messages["saleInChargeInfo"]}</Typography>

                  {writePermission && (
                    <IconButton
                      children={
                        get(customerInfo, "sales_in_charge") ? <EditIcon /> : <AddIcon />
                      }
                      onClick={() => {
                        toggle(true);
                      }}
                    />
                  )}
                </Stack>
              );
            }}
            cardBodyComponent={() => {
              return (
                <Grid container>
                  {renderSaleInCharge}

                  <SaleInChargeDialog
                    {...{
                      open,
                      toggle,
                      customerInfo,
                      mutate: customerMutate,
                    }}
                  />
                </Grid>
              );
            }}
          />
          <Stack justifyContent="space-between" alignItems="center" direction="row">
            <BackButton pathname={`/${CUSTOMERS}`} />

            {approvePermission && get(customerData, "is_mutated") && (
              <Stack flexDirection="row" columnGap={2}>
                <LoadingButton
                  {...{
                    loading,
                    sx: {
                      backgroundColor: "error.main",
                      "&:hover": {
                        backgroundColor: "error.dark",
                      },
                    },
                    onClick: () => {
                      approveHandler({
                        data: customerData,
                        type: "refuse",
                      });
                    },
                    children: messages["refuse"],
                  }}
                />
                <LoadingButton
                  {...{
                    loading,
                    onClick: () => {
                      approveHandler({
                        data: customerData,
                        type: "apply",
                      });
                    },
                    children: messages["approve"],
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Card
          cardTitleComponent={() => {
            return (
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>{messages["listingAddress"]}</Typography>

                <IconButton
                  children={<EditIcon />}
                  onClick={() => {
                    toggle(true);
                  }}
                  disabled={true}
                  sx={{
                    visibility: "hidden",
                  }}
                />
              </Stack>
            );
          }}
          body={<Stack spacing={1}>{renderRightSide}</Stack>}
        />
      </Grid>
    </Grid>
  );
};

export default ViewCustomerDetail;
