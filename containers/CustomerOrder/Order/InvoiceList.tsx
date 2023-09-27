import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import React, { useCallback, useMemo, useState } from "react";

import { cloneDeep, get, omit } from "lodash";
import { Box, Grid, Stack } from "@mui/material";

import FilterInvoice from "./FilterInvoice";
import InvoiceListTable from "./InvoiceListTable";
import { TableHeader, WrapperTable } from "components";

import { useFetch, useLayout } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";

import {
  ADMIN_ORDER_INVOICE_VIEW_TYPE_V1,
  ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_ORDERS_INVOICES_END_POINT } from "__generated__/END_POINT";

export type InvoiceListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  nested_depth: number;
  search: string;
  status: string;
  shipping_status: string;
  shipper: ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1 | null;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
};

const defaultFilterValue: InvoiceListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  nested_depth: 1,
  search: "",
  status: "",
  shipping_status: "",
  shipper: null,
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
};

const omitFiled = ["range", "range_params"];

export default function InvoiceList() {
  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();

  const [filter, setFilter] = useState<InvoiceListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, omit(filter, omitFiled))
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        let shipperId = get(cloneFilter, "shipper.id");

        let startDate = transformDate(cloneFilter.range_params.startDate, "date_start");
        let endDate = transformDate(cloneFilter.range_params.endDate, "date_end");

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        changeKey(
          transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
            ...omit(cloneFilter, omitFiled),
            shipper: shipperId,
            date_created_start: isStartDate ? startDate : undefined,
            date_created_end: isEndDate ? endDate : undefined,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let shipperId = get(cloneFilter, "shipper.id");

    let updateFilter = {
      ...cloneFilter,
      range_params: {
        startDate: cloneFilter.range.startDate,
        endDate: cloneFilter.range.endDate,
      },
    };

    setFilter(updateFilter);

    let startDate = transformDate(updateFilter.range_params.startDate, "date_start");
    let endDate = transformDate(updateFilter.range_params.endDate, "date_end");

    let isStartDate = updateFilter.range_params.startDate;
    let isEndDate = updateFilter.range_params.endDate;

    changeKey(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        shipper: shipperId,
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const resetFilter = useCallback(() => {
    setFilter(defaultFilterValue);
    changeKey(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, omit(defaultFilterValue, omitFiled))
    );
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <FilterInvoice
          filter={filter}
          resetFilter={resetFilter}
          onSearchChange={onFilterChangeHandler("search")}
          onStatusChange={onFilterChangeHandler("status")}
          onShippingStatusChange={onFilterChangeHandler("shipping_status")}
          onShipperChange={onFilterChangeHandler("shipper")}
          onDateRangeChange={onFilterChangeHandler("range")}
          onFilterByTime={onClickFilterByTime}
        />
      </Grid>

      <Grid item xs={10}>
        <Stack spacing={2}>
          <Box ref={ref}>
            <TableHeader title="Danh sách hóa đơn" />
          </Box>

          <WrapperTable>
            <InvoiceListTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 48}
            />
          </WrapperTable>

          <Box padding="10px" />
        </Stack>
      </Grid>
    </Grid>
  );
}
