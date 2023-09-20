import useSWR from "swr";
import React, { Fragment, useCallback, useMemo, useRef } from "react";

import { alpha, Box, Stack } from "@mui/material";

import get from "lodash/get";

import {
  TableRow,
  TableCell,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
  TableView,
} from "components/TableV2";

import { LoadingDynamic as Loading, NumberFormat } from "components";

import ListingInvoiceColumnByTime from "./ListingInvoiceColumnByTime";
import ListingInvoiceColumnByProfit from "./ListingInvoiceColumnByProfit";
import ListingInvoiceColumnByDiscount from "./ListingInvoiceColumnByDiscount";

import { ORDER_INVOICE_ITEM } from "interfaces";
import { ORDER_INVOICE } from "apis";
import { transformUrl } from "libs";
import { useFetch, useFetchAllData } from "hooks";
import { useUpdateEffect } from "react-use";
import ColumnDetail from "./ColumnDetail";

interface ListingInvoiceProps {
  filter: Record<string, any>;
  viewType: "time" | "profit" | "discount";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

const ListingInvoice = (props: ListingInvoiceProps) => {
  const {
    filter,
    viewType,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { data } = useSWR(() => {
    return transformUrl(ORDER_INVOICE, {
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
      with_sum_amount_before_discounts_incl_tax: true,
      with_sum_base_amount_incl_tax: true,
      with_sum_amount_incl_tax: true,
    });
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
  } = useFetch<ORDER_INVOICE_ITEM>(
    transformUrl(ORDER_INVOICE, {
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
      with_sum_amount_before_discounts_incl_tax: true,
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

  const columnFn = useMemo(() => {
    if (viewType === "time") {
      return ListingInvoiceColumnByTime;
    } else if (viewType === "profit") {
      return ListingInvoiceColumnByProfit;
    } else if (viewType === "discount") {
      return ListingInvoiceColumnByDiscount;
    } else {
      return ListingInvoiceColumnByTime;
    }
  }, [viewType]);

  const renderTotal = useMemo(() => {
    if (data == undefined) return null;

    if (viewType === "time") {
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
            colSpan={3}
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
              value={parseFloat(get(data, "sum_amount_before_discounts_incl_tax"))}
            />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "profit") {
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
              value={parseFloat(get(data, "sum_amount_before_discounts_incl_tax"))}
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
                  get(data, "sum_amount_before_discounts_incl_tax") -
                  get(data, "sum_amount_incl_tax")
                ).toFixed(2)
              )}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_amount_incl_tax"))} />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_base_amount_incl_tax"))} />
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
                  get(data, "sum_amount_incl_tax") - get(data, "sum_base_amount_incl_tax")
                ).toFixed(2)
              )}
            />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "discount") {
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
            colSpan={4}
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
            <NumberFormat value={parseFloat(get(data, "sum_amount_incl_tax"))} />
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
                  get(data, "sum_amount_before_discounts_incl_tax") -
                  get(data, "sum_amount_incl_tax")
                ).toFixed(2)
              )}
            />
          </TableCell>
        </TableRow>
      );
    }

    return null;
  }, [data, viewType]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (data == undefined) return <Loading />;

  return (
    <Fragment>
      <Box display={isPrinting ? "none" : "block"} displayPrint="none">
        <Fragment>
          <ColumnDetail
            filter={filter}
            type={viewType}
            count={itemCount}
            isLoading={isLoading}
            // data={dataTable ?? []}
            data={dataTable ? dataTable : []}
            dataTotal={data ? [data] : []}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
          />
          {/* <CompoundTableWithFunction<ORDER_INVOICE_ITEM>
            url={transformUrl(ORDER_INVOICE, {
              date_created_start: filter.date_start,
              date_created_end: filter.date_end,
              shipping_status: "Delivered",
              with_sum_amount_before_discounts_incl_tax: true,
            })}
            columnFn={columnFn}
            passHandler={passHandler}
            renderBodyItem={(rows, tableInstance) => {
              if (rows == undefined) {
                return null;
              }

              return (
                <Fragment>
                  {renderTotal}

                  {rows.map((row, i) => {
                    tableInstance.prepareRow(row);

                    const { key, ...restRowProps } = row.getRowProps();

                    return (
                      <TableRow key={key} {...restRowProps}>
                        {row.cells.map((cell) => {
                          const { key, ...restCellProps } = cell.getCellProps();

                          return (
                            <TableCell
                              {...restCellProps}
                              key={key}
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
          /> */}
        </Fragment>
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

export default ListingInvoice;
