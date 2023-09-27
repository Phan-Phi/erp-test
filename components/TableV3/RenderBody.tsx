import useSWR from "swr";
import { isEmpty } from "lodash";
import React, { Fragment } from "react";
import NumberFormat from "react-number-format";
import { Row, TableInstance } from "react-table";

import TableRow from "./TableRow";
import TableCell from "./TableCell";

import { NoData } from "components/Loading";
import { formatDate, transformUrl } from "libs";
import { Skeleton, Typography, alpha } from "@mui/material";

import {
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM,
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER_ITEM,
} from "interfaces";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT } from "__generated__/END_POINT";

interface RenderBodyProps {
  table: TableInstance<any>;
  loading?: boolean;
  isBackground?: boolean;
  filter?: any;
}

const RenderBody = (props: RenderBodyProps) => {
  const { filter, table, loading, isBackground = false } = props;

  if (loading) {
    return (
      <Fragment>
        {[...new Array(15)].map((_, idx) => {
          return (
            <TableRow key={idx}>
              {table.visibleColumns.map((el) => {
                return (
                  <TableCell
                    colSpan={el.colSpan}
                    width={el.width}
                    maxWidth={el.maxWidth}
                    key={el.id}
                  >
                    <Skeleton />
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </Fragment>
    );
  }

  if (table.rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={100}>
          <Typography textAlign="center">Không có dữ liệu</Typography>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Fragment>
      {table.rows.map((row) => {
        table.prepareRow(row);

        return (
          <Fragment>
            <TableRow
              {...row.getRowProps()}
              sx={{
                backgroundColor: ({ palette }) => {
                  return isBackground
                    ? `${alpha(palette.primary2.main, 0.25)} !important`
                    : null;
                },
              }}
            >
              {row.cells.map((cell) => {
                return (
                  <TableCell
                    {...cell.getCellProps()}
                    width={cell.column.width}
                    colSpan={cell.column.colSpan}
                    maxWidth={cell.column.maxWidth}
                  >
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
            {row.isExpanded && <SubRow {...{ row, table, filter }} />}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default RenderBody;

const SubRow = ({
  row,
  table,
  filter,
}: {
  row: Row<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM>;
  table: TableInstance<any>;
  filter: Record<string, any>;
}) => {
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
};
