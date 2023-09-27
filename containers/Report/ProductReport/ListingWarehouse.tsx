import useSWR from "swr";
import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";

import {
  REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE_ITEM,
  REPORT_PRODUCT_WITH_REVENUE_ITEM,
} from "interfaces";

import { useFetch } from "hooks";
import { transformUrl } from "libs";
import { REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE } from "apis";

import ColumnDetail from "./ColumnDetail";

interface ListingInvoiceProps {
  variantSku: string;
  data: REPORT_PRODUCT_WITH_REVENUE_ITEM;
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "warehouse_value" | "import_export_stock";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

export const ListingWarehouse = (props: ListingInvoiceProps) => {
  const {
    variantSku,
    viewType,
    filter,
    data,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { data: reportProductWithIoInventoryWarehouseData } = useSWR(() => {
    return transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE, {
      page_size: 1,
      sku: variantSku,
      date_created_end: filter.date_end,
      date_created_start: filter.date_start,
    });
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
  } = useFetch<REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE_ITEM>(
    transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE, {
      sku: variantSku,
      date_start: filter.date_start,
      date_end: filter.date_end,
    })
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Stack spacing={3}>
      <Typography fontWeight={700}>Tên sản phẩm: {data.name}</Typography>

      <Box display={isPrinting ? "none" : "block"} displayPrint="none">
        <ColumnDetail
          filter={filter}
          type={viewType}
          count={itemCount}
          isLoading={isLoading}
          data={dataTable ? [dataTable[0]] : []}
          dataInvoiceQuantity={
            reportProductWithIoInventoryWarehouseData
              ? [reportProductWithIoInventoryWarehouseData]
              : []
          }
          dataInvoice={data ? [data] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
        />
      </Box>
    </Stack>
  );
};
