import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useContext, Fragment, useCallback, useState, useEffect, useMemo } from "react";

import useSWR from "swr";
import { cloneDeep, get } from "lodash";
import { Grid, Stack, Typography, Button } from "@mui/material";

import ViewAddress from "./ViewAddress";
import ViewLineTable from "../table/ViewLineTable";
import { FormControlBase, InputNumber } from "compositions";
import { Card, LoadingDynamic as Loading, FormControlForPhoneNumber } from "components";

import {
  formatDate,
  transformUrl,
  setFilterValue,
  getDisplayValueFromChoiceItem,
} from "libs";

import { PRODUCTS } from "routes";
import { useChoice, useFetch } from "hooks";
import { InvoiceContext } from "../../context";

import {
  ADMIN_ORDERS_END_POINT,
  ADMIN_ORDERS_LINES_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

export type ViewOrderFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  order: string | undefined;
  nested_depth: number;
};

const defaultFilterValue: ViewOrderFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  order: undefined,
  nested_depth: 3,
};

const ViewOrder = () => {
  const router = useRouter();
  const { messages } = useIntl();
  const invoiceContext = useContext(InvoiceContext);

  const { order_statuses } = useChoice();
  const [openPrintNote, togglePrintNote] = useToggle(false);

  const [filter, setFilter] = useState<ViewOrderFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_ORDER_LINE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_LINES_END_POINT, {
        ...filter,
        order: router.query.id,
      })
    );

  useEffect(() => {
    invoiceContext.set({
      mutateOrderLineList: refreshData,
    });
  }, []);

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_ORDERS_LINES_END_POINT, {
          ...defaultFilterValue,
          order: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_ORDERS_LINES_END_POINT, {
            ...cloneFilter,
            order: router.query.id,
          })
        );
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const { data: orderData } = useSWR<ADMIN_ORDER_LINE_VIEW_TYPE_V1>(() => {
    let id = router.query.id;

    if (!id) return;

    return transformUrl(`${ADMIN_ORDERS_END_POINT}${id}`, {
      use_cache: false,
    });
  });

  const onGotoHandler = useCallback((data: Row<ADMIN_ORDER_LINE_VIEW_TYPE_V1>) => {
    const productId = get(data, "original.variant.product.id");

    window.open(`/${PRODUCTS}/${productId}`, "_blank");
  }, []);

  if (orderData == undefined) return <Loading />;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card
          title={messages["orderInfo"]}
          body={
            <Grid container>
              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{ children: messages["noteSid"] as string }}
                  InputProps={{
                    readOnly: true,
                    value: get(orderData, "sid") || "-",
                    placeholder: messages["noteSid"] as string,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{ children: messages["datePlaced"] as string }}
                  InputProps={{
                    readOnly: true,
                    value: formatDate(get(orderData, "date_placed")),
                    placeholder: messages["datePlaced"] as string,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <InputNumber
                  FormLabelProps={{ children: messages["orderValue"] as string }}
                  InputProps={{
                    inputProps: { placeholder: messages["orderValue"] as string },
                  }}
                  NumberFormatProps={{
                    value: parseFloat(get(orderData, "total_price.incl_tax") || 0),
                    suffix: " ₫",
                  }}
                  readOnly={true}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{ children: messages["orderStatus"] as string }}
                  InputProps={{
                    placeholder: messages["orderStatus"] as string,
                    value:
                      getDisplayValueFromChoiceItem(
                        order_statuses,
                        get(orderData, "status")
                      ) || "-",

                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{ children: messages["receiverName"] as string }}
                  InputProps={{
                    readOnly: true,
                    placeholder: messages["receiverName"] as string,
                    value: get(orderData, "receiver_name") || "-",
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{ children: messages["receiverEmail"] as string }}
                  InputProps={{
                    readOnly: true,
                    placeholder: messages["receiverEmail"] as string,
                    value: get(orderData, "receiver_email") || "-",
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlForPhoneNumber
                  {...{
                    label: messages["phoneNumber"] as string,
                    placeholder: messages["phoneNumber"] as string,

                    value: get(orderData, "receiver_phone_number"),
                    InputProps: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{
                    children: messages["shippingMethodName"] as string,
                  }}
                  InputProps={{
                    readOnly: true,
                    placeholder: messages["shippingMethodName"] as string,
                    value: get(orderData, "shipping_method_name") || "-",
                  }}
                />
              </Grid>

              {/* <FormControl
                  {...{
                    label: messages["address"] as string,
                    placeholder: messages["address"] as string,

                    InputProps: {
                      readOnly: true,
                      value: get(orderData, "shipping_address.line1") || "-",
                    },
                  }}
                /> */}

              <Grid item xs={12}>
                <FormControlBase
                  FormLabelProps={{
                    children: messages["note"] as string,
                  }}
                  InputProps={{
                    value: get(orderData, "customer_notes") || "-",
                    rows: 5,
                    multiline: true,
                    readOnly: true,
                    sx: {
                      padding: 1,
                    },
                  }}
                />
              </Grid>
            </Grid>
          }
        />
      </Grid>

      <Grid item xs={6}>
        <Card
          title={messages["shippingAddress"]}
          body={<ViewAddress data={get(orderData, "shipping_address")} />}
        />
      </Grid>

      <Grid item xs={6}>
        <Card
          title={messages["billingAddress"]}
          body={<ViewAddress data={get(orderData, "billing_address")} />}
        />
      </Grid>

      <Grid item xs={12}>
        <Card
          cardTitleComponent={() => {
            return (
              <Stack flexDirection="row" justifyContent="space-between">
                <Typography fontWeight={"700"}>{messages["listingProduct"]}</Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    togglePrintNote(true);
                  }}
                >
                  {messages["printNote"]}
                </Button>
              </Stack>
            );
          }}
          body={
            <Fragment>
              <ViewLineTable
                data={data ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={300}
                onGotoHandler={onGotoHandler}
              />
            </Fragment>
          }
        />
        <PrintNote
          {...{
            open: openPrintNote,
            toggle: togglePrintNote,
            type: "ORDER",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ViewOrder;
