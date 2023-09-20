import useSWR from "swr";
import { useIntl } from "react-intl";
import { useUpdateEffect } from "react-use";
import React, { Fragment, useCallback, useMemo, useRef } from "react";

import { alpha, Box } from "@mui/material";

import get from "lodash/get";

import {
  TableRow,
  TableCell,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
  TableView,
} from "components/TableV2";

import ListingInvoiceColumnBySale from "./ListingInvoiceColumnBySale";
import ListingInvoiceColumnByDebt from "./ListingInvoiceColumnByDebt";

import { useFetch, useFetchAllData } from "hooks";
import { NumberFormat } from "components";
import { formatDate, transformUrl } from "libs";
import { ORDER_INVOICE, CASH_DEBT_RECORD } from "apis";
import { ORDER_INVOICE_ITEM, CASH_DEBT_RECORD_ITEM } from "interfaces";
import ColumnDetail from "./ColumnDetail";

interface ListingInvoiceProps {
  receiver: number;
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "debt";
  beginningDebtAmount: number;
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

/* eslint react/jsx-key: off */

const ListingInvoice = (props: ListingInvoiceProps) => {
  const {
    filter,
    viewType,
    receiver,
    beginningDebtAmount,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { messages } = useIntl();

  const { data } = useSWR(() => {
    if (viewType === "profit") {
      return transformUrl(ORDER_INVOICE, {
        receiver,
        date_created_start: filter.date_start,
        date_created_end: filter.date_end,
        shipping_status: "Delivered",
        with_sum_amount_before_discounts_incl_tax: true,
        with_sum_base_amount_incl_tax: true,
        with_sum_amount_incl_tax: true,
      });
    }
  });

  const { data: debtRecordData } = useSWR(() => {
    if (viewType === "debt") {
      return transformUrl(CASH_DEBT_RECORD, {
        creditor_id: receiver,
        date_created_start: filter.date_start,
        date_created_end: filter.date_end,
        creditor_type: "customer.customer",
        page_size: 1,
      });
    }
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
  } = useFetch<ORDER_INVOICE_ITEM>(
    transformUrl(ORDER_INVOICE, {
      receiver,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
      with_sum_amount_before_discounts_incl_tax: true,
    })
  );
  const {
    data: dataTableDebt,
    isLoading: isLoadingDebt,
    itemCount: itemCountDebt,
  } = useFetch<CASH_DEBT_RECORD_ITEM>(
    transformUrl(CASH_DEBT_RECORD, {
      creditor_id: receiver,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      creditor_type: "customer.customer",
    })
  );

  const tableInstance = useRef<ExtendableTableInstanceProps<any>>();

  const { data: reportDataForPrinting, setUrl, isDone } = useFetchAllData();

  useUpdateEffect(() => {
    if (!isPrinting) return;

    tableInstance.current && setUrl(tableInstance.current.url);
  }, [isPrinting]);

  useUpdateEffect(() => {
    isDone && onIsDoneHandler();
  }, [isDone]);

  const passHandler = useCallback((_tableInstance: ExtendableTableInstanceProps<any>) => {
    tableInstance.current = _tableInstance;
  }, []);

  useUpdateEffect(() => {
    if (tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;

      if (viewType === "sale") {
        setUrl(
          transformUrl(ORDER_INVOICE, {
            receiver,
            date_created_start: filter.date_start,
            date_created_end: filter.date_end,
            shipping_status: "Delivered",
          })
        );
      }

      if (viewType === "debt") {
        setUrl(
          transformUrl(CASH_DEBT_RECORD, {
            creditor_id: receiver,
            date_created_start: filter.date_start,
            date_created_end: filter.date_end,
            creditor_type: "customer.customer",
          })
        );
      }
    }
  }, [filter]);

  const columnFn = useMemo(() => {
    if (viewType === "sale") {
      return ListingInvoiceColumnBySale;
    } else if (viewType === "debt") {
      return ListingInvoiceColumnByDebt;
    } else {
      return ListingInvoiceColumnBySale;
    }
  }, [viewType]);

  const renderTotal = useMemo(() => {
    if (viewType === "sale") {
      if (data == undefined) return null;

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
            <NumberFormat value={parseFloat(get(data, "sum_amount_incl_tax"))} />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "debt") {
      if (debtRecordData == undefined) return null;

      return (
        <Fragment>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              {get(filter, "date_start") && formatDate(get(filter, "date_start") * 1000)}
            </TableCell>
            <TableCell>Dư nợ đầu kỳ</TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                textAlign: "right",
              }}
            >
              0
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                textAlign: "right",
              }}
            >
              <NumberFormat value={parseFloat(beginningDebtAmount.toFixed(2))} />
            </TableCell>
          </TableRow>

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
              colSpan={5}
            >
              {"SL giao dịch: "}
              <NumberFormat value={get(debtRecordData, "count")} suffix="" />
            </TableCell>
          </TableRow>
        </Fragment>
      );
    }

    return null;
  }, [data, debtRecordData, viewType, beginningDebtAmount, filter]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  let component: React.ReactNode = null;

  if (viewType === "sale") {
    component = (
      <Fragment>
        <ColumnDetail
          filter={filter}
          type={viewType}
          count={itemCount}
          isLoading={isLoading}
          data={dataTable ? dataTable : []}
          dataInvoice={data ? [data] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
        />
        {/* <CompoundTableWithFunction<ORDER_INVOICE_ITEM>
          url={transformUrl(ORDER_INVOICE, {
            receiver,
            date_created_start: filter.date_start,
            date_created_end: filter.date_end,
            shipping_status: "Delivered",
            with_sum_amount_before_discounts_incl_tax: true,
          })}
          columnFn={columnFn}
          passHandler={passHandler}
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
        /> */}
      </Fragment>
    );
  } else if (viewType === "debt") {
    component = (
      <Fragment>
        <ColumnDetail
          filter={filter}
          type={viewType}
          count={itemCountDebt}
          isLoading={isLoadingDebt}
          data={dataTableDebt ? dataTableDebt : []}
          dataInvoice={debtRecordData ? [debtRecordData] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          beginningDebtAmount={beginningDebtAmount}
          // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
        />
        {/* <CompoundTableWithFunction<CASH_DEBT_RECORD_ITEM>
          url={transformUrl(CASH_DEBT_RECORD, {
            creditor_id: receiver,
            date_created_start: filter.date_start,
            date_created_end: filter.date_end,
            creditor_type: "customer.customer",
          })}
          columnFn={columnFn}
          passHandler={passHandler}
          messages={messages}
          renderBodyItem={(rows, tableInstance) => {
            if (rows == undefined) return null;

            return (
              <Fragment>
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

                {renderTotal}
              </Fragment>
            );
          }}
        /> */}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Box
        display={isPrinting ? "none" : "block"}
        // displayPrint="none"
      >
        {component}
      </Box>

      <Box display={isPrinting ? "block" : "none"}>
        {isDone && (
          <TableView
            columns={columnFn()}
            data={reportDataForPrinting}
            appendChildren={renderTotal}
          />
        )}
      </Box>
    </Fragment>
  );
};

export default ListingInvoice;
