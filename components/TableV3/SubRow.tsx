import React, { Fragment } from "react";
import TableCell from "./TableCell";
import { formatDate, transformUrl } from "libs";
import {
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM,
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER_ITEM,
} from "interfaces";
import useSWR from "swr";
import TableRow from "./TableRow";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT } from "__generated__/END_POINT";
import { NoData, Skeleton } from "components/Loading";
import { isEmpty } from "lodash";
import NumberFormat from "react-number-format";
import { Row, TableInstance } from "react-table";

export default function SubRow({
  row,
  table,
  filter,
}: {
  row: Row<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM>;
  table: TableInstance<any>;
  filter: Record<string, any>;
}) {
  const { data } = useSWR<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER_ITEM[]>(
    transformUrl(
      ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
      {
        order: row.original.id,
        status: "Confirmed",
        get_all: true,
        date_created_start: filter.date_start,
        date_created_end: filter.date_end,
      }
    )
  );

  if (data == undefined) {
    return (
      <TableRow>
        {table.visibleColumns.map((el, i) => {
          return (
            <TableCell key={i}>
              <Skeleton />
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  if (isEmpty(data)) {
    return (
      <TableRow>
        <TableCell colSpan={table.visibleColumns.length}>
          <NoData />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Fragment>
      <TableRow>
        <TableCell
          sx={{
            fontWeight: 700,
          }}
        >
          Mã phiếu trả hàng
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 700,
          }}
        >
          Ngày tạo
        </TableCell>
        <TableCell
          sx={{
            textAlign: "right",
            fontWeight: 700,
          }}
        >
          SL trả
        </TableCell>
        <TableCell
          colSpan={2}
          sx={{
            textAlign: "right",
            fontWeight: 700,
          }}
        >
          Giá trị trả
        </TableCell>
      </TableRow>

      {data.map((el) => {
        return (
          <TableRow key={el.id}>
            <TableCell>{el.sid}</TableCell>
            <TableCell>{formatDate(el.date_created)}</TableCell>
            <TableCell
              sx={{
                textAlign: "right",
              }}
            >
              <NumberFormat value={el.item_count} suffix="" />
            </TableCell>
            <TableCell
              colSpan={2}
              sx={{
                textAlign: "right",
              }}
            >
              <NumberFormat value={parseFloat(el.amount.incl_tax)} />
            </TableCell>
          </TableRow>
        );
      })}
    </Fragment>
  );
}
