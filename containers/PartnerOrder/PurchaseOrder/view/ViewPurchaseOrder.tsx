import useSWR from "swr";
import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useContext, useEffect, Fragment, useCallback, useState, useMemo } from "react";

import { cloneDeep, get } from "lodash";
import { Grid, Stack, Typography, Button } from "@mui/material";

import { FormControlBase, InputNumber } from "compositions";
import { Card, Link, LoadingDynamic as Loading } from "components";
import ViewPurchaseOrderTable from "../table/ViewPurchaseOrderTable";

import { useFetch } from "hooks";
import { PARTNERS, PRODUCTS } from "routes";
import { PartnerOrderContext } from "../../context";
import { transformUrl, formatDate, setFilterValue } from "libs";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

export type ViewPurchaseOrderFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  nested_depth: number;
  order: string | undefined;
};

const defaultFilterValue: ViewPurchaseOrderFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  nested_depth: 3,
  order: undefined,
};

const ViewPurchaseOrder = () => {
  const router = useRouter();
  const { messages } = useIntl();
  const [openPrintNote, togglePrintNote] = useToggle(false);
  const partnerOrderContext = useContext(PartnerOrderContext);
  const [filter, setFilter] = useState<ViewPurchaseOrderFilterType>(defaultFilterValue);

  const { data: purchaseOrderData } = useSWR(() => {
    let id = router.query.id;

    if (id) {
      const params = {
        use_cache: false,
      };

      return transformUrl(`${ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT}${id}`, params);
    }
  });

  const { data: purchaseOrderLineData, mutate: purchaseOrderLineMutate } = useSWR(() => {
    let id = router.query.id;

    if (id) {
      const params = {
        get_all: true,
        use_cache: false,
        nested_depth: 3,
        order: router.query.id,
      };

      return transformUrl(`${ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT}`, params);
    }
  });

  const {
    data: dataTable,
    changeKey,
    itemCount,
    isLoading,
  } = useFetch(
    transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, {
      ...filter,
      order: router.query.id,
    })
  );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, {
          ...defaultFilterValue,
          order: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  useEffect(() => {
    partnerOrderContext.set({
      mutateOrderedList: purchaseOrderLineMutate,
    });
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, {
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

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.variant.product.id");

      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    },
    []
  );

  if (purchaseOrderData == undefined || purchaseOrderLineData == undefined) {
    return <Loading />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card
          title={messages["purchaseOrder"]}
          body={
            <Grid container spacing={3} justifyContent="flex-start">
              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{ children: messages["purchaseOrderNote"] as string }}
                  InputProps={{
                    inputProps: {
                      placeholder: messages["purchaseOrderNote"] as string,
                    },
                    readOnly: true,
                    value: get(purchaseOrderData, "sid") || "-",
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{ children: messages["datePlaced"] as string }}
                  InputProps={{
                    inputProps: {
                      placeholder: messages["datePlaced"] as string,
                    },
                    readOnly: true,
                    value: formatDate(get(purchaseOrderData, "date_placed")) || "-",
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <InputNumber
                  readOnly={true}
                  placeholder={messages["totalPrice"] as string}
                  FormLabelProps={{ children: messages["totalPrice"] as string }}
                  NumberFormatProps={{
                    value: parseFloat(
                      get(purchaseOrderData, "total_price.incl_tax") || 0
                    ),
                    suffix: " ₫",
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{ children: messages["status"] as string }}
                  InputProps={{
                    inputProps: {
                      placeholder: messages["status"] as string,
                    },
                    readOnly: true,
                    value:
                      messages[
                        `purchase_order_statuses.${get(purchaseOrderData, "status")}`
                      ],
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <FormControlBase
                  FormLabelProps={{ children: messages["noteCreator"] as string }}
                  InputProps={{
                    inputProps: {
                      placeholder: messages["noteCreator"] as string,
                    },
                    readOnly: true,
                    value: get(purchaseOrderData, "owner_name") || "-",
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <Link
                  href="#"
                  onClick={(e: React.SyntheticEvent) => {
                    e.preventDefault();
                    const partnerId = get(purchaseOrderData, "partner.id");

                    if (partnerId) {
                      window.open(`/${PARTNERS}/${partnerId}`, "_blank");
                    }
                  }}
                >
                  <FormControlBase
                    FormLabelProps={{ children: messages["partnerName"] as string }}
                    InputProps={{
                      inputProps: {
                        placeholder: messages["partnerName"] as string,
                      },
                      readOnly: true,
                      value: get(purchaseOrderData, "partner_name") || "-",
                      sx: {
                        WebkitTextFillColor: ({ palette }) => {
                          return `${palette.primary2.main} !important`;
                        },
                      },
                    }}
                  />
                </Link>
              </Grid>

              {/* <Grid item xs={6}>
                <FormControlForNumber
                  {...{
                    label: messages["surcharge"] as string,
                    placeholder: messages["surcharge"] as string,

                    InputProps: {
                      readOnly: true,
                    },
                    NumberFormatProps: {
                      value: parseFloat(
                        get(purchaseOrderData, "surcharge.incl_tax") || 0
                      ),
                      suffix: " ₫",
                    },
                  }}
                />
              </Grid> */}

              <Grid item xs={4}>
                <FormControlBase
                  FormLabelProps={{ children: messages["warehouseName"] as string }}
                  InputProps={{
                    inputProps: {
                      placeholder: messages["warehouseName"] as string,
                    },
                    readOnly: true,
                    value: get(purchaseOrderData, "warehouse_name") || "-",
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
                    readOnly: true,
                    value: get(purchaseOrderData, "notes") || "-",
                    rows: 5,
                    multiline: true,
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

      <Grid item xs={12}>
        <Card
          cardTitleComponent={() => {
            return (
              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>{messages["listingProduct"]}</Typography>
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
              <ViewPurchaseOrderTable
                data={dataTable ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                onGotoHandler={onGotoHandler}
              />
            </Fragment>
          }
        />

        <PrintNote
          {...{
            open: openPrintNote,
            toggle: togglePrintNote,
            type: "PURCHASE_ORDER",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ViewPurchaseOrder;
