import dynamic from "next/dynamic";
import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import useSWR from "swr";
import { get, cloneDeep } from "lodash";
import { Button, Grid, Stack } from "@mui/material";

import ViewLineTable from "./table/ViewLineTable";
import { FormControlBase, InputNumber } from "compositions";
import { Card, BackButton, LoadingDynamic as Loading } from "components";

import { useChoice, useFetch } from "hooks";
import { OUTNOTES, PRODUCTS } from "routes";

import {
  formatDate,
  transformUrl,
  setFilterValue,
  getDisplayValueFromChoiceItem,
} from "libs";

import {
  ADMIN_WAREHOUSES_OUT_NOTES_END_POINT,
  ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

export type ViewOutnoteFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  stock_out_note: string | undefined;
};

const defaultFilterValue: ViewOutnoteFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  stock_out_note: undefined,
};

const ViewOutnote = () => {
  const choice = useChoice();
  const router = useRouter();
  const { messages } = useIntl();
  const [openPrintNote, togglePrintNote] = useToggle(false);

  const { data: outnoteData } = useSWR(() => {
    return transformUrl(`${ADMIN_WAREHOUSES_OUT_NOTES_END_POINT}${router.query.id}`);
  });

  const { data: outnoteLineData } = useSWR(() => {
    let id = router.query.id;

    if (id) {
      const params = {
        stock_out_note: id,
        get_all: true,
      };

      return transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, params);
    }
  });

  const [filter, setFilter] = useState<ViewOutnoteFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, {
        ...filter,
        stock_out_note: router.query.id,
      })
    );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, {
          ...defaultFilterValue,
          stock_out_note: router.query.id,
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
          transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, {
            ...cloneFilter,
            stock_out_note: router.query.id,
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
    (data: Row<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.variant.product");

      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    },
    []
  );

  if (outnoteData == undefined || outnoteLineData == undefined) {
    return <Loading />;
  }

  const { stock_out_note_statuses } = choice;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card
          title={messages["outnote"]}
          body={
            <Fragment>
              <Grid container>
                <Grid item xs={6}>
                  <FormControlBase
                    FormLabelProps={{ children: messages["outnoteSid"] as string }}
                    InputProps={{
                      readOnly: true,
                      value: get(outnoteData, "sid") || "-",
                      placeholder: messages["outnoteSid"] as string,
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlBase
                    FormLabelProps={{
                      children: messages["dateCreated"] as string,
                    }}
                    InputProps={{
                      readOnly: true,
                      placeholder: messages["dateCreated"] as string,
                      value: formatDate(get(outnoteData, "date_created")) || "-",
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <InputNumber
                    FormLabelProps={{ children: messages["totalPriceInclTax"] as string }}
                    InputProps={{
                      inputProps: {
                        placeholder: messages["totalPriceInclTax"] as string,
                      },
                    }}
                    NumberFormatProps={{
                      value: parseFloat(get(outnoteData, "total_price.incl_tax") || 0),
                      suffix: " ₫",
                    }}
                    readOnly={true}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlBase
                    FormLabelProps={{
                      children: messages["status"] as string,
                    }}
                    InputProps={{
                      readOnly: true,
                      placeholder: messages["status"] as string,
                      value: getDisplayValueFromChoiceItem(
                        stock_out_note_statuses,
                        get(outnoteData, "status")
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <InputNumber
                    readOnly={true}
                    FormLabelProps={{ children: messages["shippingInclTax"] as string }}
                    InputProps={{
                      inputProps: {
                        placeholder: messages["shippingInclTax"] as string,
                      },
                    }}
                    NumberFormatProps={{
                      value: parseFloat(
                        get(outnoteData, "shipping_charge.incl_tax") || 0
                      ),
                      suffix: " ₫",
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <InputNumber
                    readOnly={true}
                    FormLabelProps={{
                      children: messages["amountInclTax"] as string,
                    }}
                    NumberFormatProps={{
                      value: parseFloat(get(outnoteData, "amount.incl_tax") || 0),
                      suffix: " ₫",
                    }}
                    InputProps={{
                      inputProps: {
                        placeholder: messages["amountInclTax"] as string,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlBase
                    FormLabelProps={{ children: messages["noteCreator"] as string }}
                    InputProps={{
                      readOnly: true,
                      placeholder: messages["noteCreator"] as string,
                      value: get(outnoteData, "owner_name") || "-",
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlBase
                    FormLabelProps={{
                      children: messages["warehouseName"] as string,
                    }}
                    InputProps={{
                      readOnly: true,
                      placeholder: messages["warehouseName"] as string,
                      value: get(outnoteData, "warehouse_name") || "-",
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <FormControlBase
                  FormLabelProps={{
                    children: messages["note"] as string,
                  }}
                  InputProps={{
                    placeholder: messages["note"] as string,
                    value: get(outnoteData, "notes") || "-",
                    rows: 5,
                    multiline: true,
                    readOnly: true,
                    sx: {
                      padding: 1,
                    },
                  }}
                />
              </Grid>
            </Fragment>
          }
        />
      </Grid>

      <Grid item xs={12}>
        <ViewLineTable
          data={data ?? []}
          count={itemCount}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
          maxHeight={400}
          onGotoHandler={onGotoHandler}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${OUTNOTES}`} />

          <Button
            variant="outlined"
            onClick={() => {
              togglePrintNote(true);
            }}
          >
            {messages["printNote"]}
          </Button>
        </Stack>
      </Grid>

      <PrintNote
        {...{
          open: openPrintNote,
          toggle: togglePrintNote,
          type: "OUTNOTE",
        }}
      />
    </Grid>
  );
};

export default ViewOutnote;
