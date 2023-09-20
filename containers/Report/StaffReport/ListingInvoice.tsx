import useSWR from "swr";
import { useUpdateEffect } from "react-use";
import React, { Fragment, useCallback, useMemo, useRef } from "react";

import get from "lodash/get";

import { alpha, Box } from "@mui/material";
import ColumnDetail from "./ColumnDetail";

import { transformUrl } from "libs";
import { ORDER_INVOICE } from "apis";
import { NumberFormat } from "components";
import { ORDER_INVOICE_ITEM } from "interfaces";

import {
  TableRow,
  TableCell,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
  TableView,
} from "components/TableV2";

import ListingInvoiceColumn from "./ListingInvoiceColumn";
import { useFetch, useFetchAllData } from "hooks";

interface ListingTimeProps {
  owner: number;
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "hang_ban_theo_nhan_vien";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

export const ListingInvoice = (props: ListingTimeProps) => {
  const {
    owner,
    viewType,
    filter,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { data } = useSWR(() => {
    return transformUrl(ORDER_INVOICE, {
      order_owner: owner,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
      with_sum_amount_incl_tax: true,
    });
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
  } = useFetch<ORDER_INVOICE_ITEM>(
    transformUrl(ORDER_INVOICE, {
      order_owner: owner,
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
          order_owner: owner,
          shipping_status: "Delivered",
          date_created_start: filter.date_start,
          date_created_end: filter.date_end,
        })
      );
    }
  }, [filter]);

  const renderTotal = useMemo(() => {
    if (data == undefined) return null;

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
            <NumberFormat value={parseFloat(get(data, "sum_amount_incl_tax"))} />
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

  return (
    <Fragment>
      <Box display={isPrinting ? "none" : "block"}>
        <ColumnDetail
          filter={filter}
          type={viewType}
          count={itemCount}
          isLoading={isLoading}
          data={dataTable ? dataTable : []}
          dataTotal={data ? [data] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
        {/* <CompoundTableWithFunction<ORDER_INVOICE_ITEM>
          url={transformUrl(ORDER_INVOICE, {
            order_owner: owner,
            shipping_status: "Delivered",
            date_created_start: filter.date_start,
            date_created_end: filter.date_end,
          })}
          columnFn={ListingInvoiceColumn}
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
      </Box>

      <Box display={isPrinting ? "block" : "none"}>
        {isDone && (
          <TableView
            columns={ListingInvoiceColumn()}
            data={reportDataForPrinting}
            prependChildren={renderTotal}
          />
        )}
      </Box>
    </Fragment>
  );
};
