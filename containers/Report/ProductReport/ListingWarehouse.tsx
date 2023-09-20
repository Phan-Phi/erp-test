import useSWR from "swr";
import { useUpdateEffect } from "react-use";
import React, { Fragment, useCallback, useMemo, useRef } from "react";

import { alpha, Box, Stack, Typography } from "@mui/material";

import get from "lodash/get";

import {
  REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE_ITEM,
  REPORT_PRODUCT_WITH_REVENUE_ITEM,
} from "interfaces";
import {
  TableRow,
  TableCell,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
  TableView,
} from "components/TableV2";

import { NumberFormat } from "components";
import { transformUrl } from "libs";
import { REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE } from "apis";

import ListingWarehouseColumnByWarehouseValue from "./ListingWarehouseColumnByWarehouseValue";
import { useFetch, useFetchAllData } from "hooks";
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

  const tableInstance =
    useRef<
      ExtendableTableInstanceProps<REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE_ITEM>
    >();

  const { data: reportDataForPrinting, setUrl, isDone } = useFetchAllData();

  useUpdateEffect(() => {
    if (!isPrinting) return;

    tableInstance.current && setUrl(tableInstance.current.url);
  }, [isPrinting]);

  useUpdateEffect(() => {
    isDone && onIsDoneHandler();
  }, [isDone]);

  const passHandler = useCallback(
    (
      _tableInstance: ExtendableTableInstanceProps<REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE_ITEM>
    ) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

  useUpdateEffect(() => {
    if (tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;

      setUrl(
        transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE, {
          sku: variantSku,
          date_created_start: filter.date_start,
          date_created_end: filter.date_end,
        })
      );
    }
  }, [filter]);

  const renderTotal = useMemo(() => {
    if (data == undefined || reportProductWithIoInventoryWarehouseData == undefined)
      return null;

    if (viewType === "warehouse_value") {
      const quantity =
        get(data, "beginning_quantity") +
        get(data, "input_quantity") -
        get(data, "output_quantity");

      return (
        <TableRow
          sx={{
            backgroundColor: ({ palette }) => {
              return `${alpha(palette.primary2.main, 0.25)} !important`;
            },
          }}
        >
          <TableCell
            sx={{
              fontWeight: 700,
            }}
          >
            {"SL kho: "}
            <NumberFormat
              value={get(reportProductWithIoInventoryWarehouseData, "count")}
              suffix=""
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={quantity} suffix="" />
          </TableCell>
          <TableCell></TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(get(data, "current_price.incl_tax")) * quantity}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "current_base_price.incl_tax"))} />
            sadas
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(get(data, "current_base_price.incl_tax")) * quantity}
            />
          </TableCell>
        </TableRow>
      );
    }

    return null;
  }, [data, viewType, reportProductWithIoInventoryWarehouseData]);

  const columnFn = useMemo(() => {
    return ListingWarehouseColumnByWarehouseValue;
  }, [viewType]);

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

        <CompoundTableWithFunction<REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE_ITEM>
          url={transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE, {
            sku: variantSku,
            date_start: filter.date_start,
            date_end: filter.date_end,
          })}
          columnFn={columnFn}
          passHandler={passHandler}
          variantSku={variantSku}
          renderBodyItem={(rows, tableInstance) => {
            if (rows == undefined) return null;

            return (
              <Fragment>
                {renderTotal}

                {rows.map((row, i) => {
                  tableInstance.prepareRow(row);

                  return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <TableCell
                            {...cell.getCellProps()}
                            {...(cell.column.colSpan && {
                              colSpan: cell.column.colSpan,
                            })}
                            sx={{
                              width: cell.column.width,
                              minWidth: cell.column.minWidth,
                              maxWidth: cell.column.maxWidth,
                            }}
                          >
                            {cell.render("Cell")}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </Fragment>
            );
          }}
        />
      </Box>

      <Box display={isPrinting ? "block" : "none"}>
        {isDone && (
          <TableView
            columns={columnFn()}
            data={reportDataForPrinting}
            prependChildren={renderTotal}
          />
        )}
      </Box>
    </Stack>
  );
};
