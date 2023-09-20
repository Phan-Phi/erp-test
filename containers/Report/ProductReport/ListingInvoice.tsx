import useSWR from "swr";
import { alpha, Box } from "@mui/material";
import { useUpdateEffect } from "react-use";
import React, { Fragment, useCallback, useMemo, useRef } from "react";

import get from "lodash/get";

import {
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
  TableRow,
  TableCell,
  TableView,
} from "components/TableV2";

import { transformUrl } from "libs";
import { NumberFormat } from "components";
import { ORDER_INVOICE_ITEM } from "interfaces";
import { ORDER_INVOICE, ORDER_INVOICE_QUANTITY } from "apis";
import ListingInvoiceColumnBySale from "./ListingInvoiceColumnBySale";
import { useFetch, useFetchAllData } from "hooks";
import ColumnDetail from "./ColumnDetail";

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
    return transformUrl(ORDER_INVOICE, {
      variant_sku: variantSku,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
    });
  });

  const { data: orderInvoiceQuantityData } = useSWR(() => {
    return transformUrl(ORDER_INVOICE_QUANTITY, {
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
  } = useFetch<ORDER_INVOICE_ITEM>(
    transformUrl(ORDER_INVOICE, {
      variant_sku: variantSku,
      shipping_status: "Delivered",
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
    })
  );

  const tableInstance = useRef<ExtendableTableInstanceProps<ORDER_INVOICE_ITEM>>();

  const { data: reportDataForPrinting, setUrl, isDone } = useFetchAllData();

  useUpdateEffect(() => {
    if (!isPrinting) return;

    tableInstance.current && setUrl(tableInstance.current.url);
  }, [isPrinting]);

  useUpdateEffect(() => {
    isDone && onIsDoneHandler();
  }, [isDone]);

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<ORDER_INVOICE_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

  useUpdateEffect(() => {
    if (tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;

      setUrl(
        transformUrl(ORDER_INVOICE, {
          variant_sku: variantSku,
          shipping_status: "Delivered",
          date_created_start: filter.date_start,
          date_created_end: filter.date_end,
        })
      );
    }
  }, [filter]);

  const renderTotal = useMemo(() => {
    if (data == undefined || orderInvoiceQuantityData == undefined) return null;

    if (viewType === "sale") {
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
            colSpan={2}
          >
            {"SL giao dịch: "}
            <NumberFormat value={get(data, "count")} suffix="" />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={get(orderInvoiceQuantityData, "sum_unit_quantity")}
              suffix=""
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                get(orderInvoiceQuantityData, "sum_amount_before_discounts_incl_tax")
              )}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(get(orderInvoiceQuantityData, "sum_amount_incl_tax"))}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                (
                  get(orderInvoiceQuantityData, "sum_amount_before_discounts_incl_tax") -
                  get(orderInvoiceQuantityData, "sum_amount_incl_tax")
                ).toFixed(2)
              )}
            />
          </TableCell>
        </TableRow>
      );
    }

    return null;
  }, [data, orderInvoiceQuantityData, viewType]);

  const columnFn = useMemo(() => {
    return ListingInvoiceColumnBySale;
  }, [viewType]);

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
        <CompoundTableWithFunction<ORDER_INVOICE_ITEM>
          url={transformUrl(ORDER_INVOICE, {
            variant_sku: variantSku,
            shipping_status: "Delivered",
            date_created_start: filter.date_start,
            date_created_end: filter.date_end,
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
    </Fragment>
  );
};
