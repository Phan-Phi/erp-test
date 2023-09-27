import useSWR from "swr";
import { Box } from "@mui/material";
import { Fragment, useMemo } from "react";

import ColumnDetail from "./ColumnDetail";

import { useFetch } from "hooks";
import { transformUrl } from "libs";

import {
  ADMIN_ORDERS_INVOICES_END_POINT,
  ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

interface ListingInvoiceProps {
  variantSku: string;
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "warehouse_value" | "import_export_stock";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

/* eslint react/jsx-key: off  */

export const ListingInvoice = (props: ListingInvoiceProps) => {
  const {
    variantSku,
    viewType,
    filter,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { data } = useSWR(() => {
    return transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
      variant_sku: variantSku,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
    });
  });

  const { data: orderInvoiceQuantityData } = useSWR(() => {
    return transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
      variant_sku: variantSku,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
      with_sum_unit_quantity: true,
      with_sum_amount_before_discounts_incl_tax: true,
      with_sum_amount_incl_tax: true,
      page_size: 1,
    });
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
  } = useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
    transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
      variant_sku: variantSku,
      shipping_status: "Delivered",
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
    })
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Fragment>
      <Box
        display={isPrinting ? "none" : "block"}
        // displayPrint="none"
      >
        <ColumnDetail
          filter={filter}
          type={viewType}
          count={itemCount}
          isLoading={isLoading}
          data={dataTable ? dataTable : []}
          dataInvoice={data ? [data] : []}
          dataInvoiceQuantity={orderInvoiceQuantityData ? [orderInvoiceQuantityData] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
        />
      </Box>
    </Fragment>
  );
};
