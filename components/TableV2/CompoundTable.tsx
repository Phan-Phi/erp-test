import {
  Paper,
  TableProps,
  TableFooter,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableContainerProps,
  TableContainer as MuiTableContainer,
} from "@mui/material";

import { Fragment, useMemo } from "react";
import { HeaderGroup, Row, TableInstance } from "react-table";

import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import get from "lodash/get";

import Table from "./Table";
import TableRow from "./TableRow";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import TableCell from "./TableCell";

interface ExtendTableRowProps<T extends Record<string, unknown>> extends TableRowProps {
  onRowClick?: (
    value: Row<T>,
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>
  ) => void;
}

export type CompoundTableProps<T extends Record<string, unknown>> = {
  bodyItemList?: Row<T>[];
  TableProps?: TableProps;
  TableRowProps?: ExtendTableRowProps<T>;
  headerItemList?: HeaderGroup<T>[];
  TableBodyProps?: TableBodyProps;
  TableHeadProps?: TableHeadProps;
  TableCellProps?: TableCellProps;
  renderBodyItem?: (
    rows: Row<T>[] | undefined,
    tableInstance: TableInstance<any>
  ) => React.ReactNode;
  renderPagination?: () => React.ReactNode;
  renderHeaderItem?: () => React.ReactNode;

  renderHeaderContentForSelectedRow?: (
    tableInstance: TableInstance<any>
  ) => React.ReactNode;

  TableContainerProps?: TableContainerProps;
  tableInstance: TableInstance<any>;
  prepareRow: (row: Row<T>) => void;
};

const CompoundTable = <T extends Record<string, unknown>>(
  props: CompoundTableProps<T>
) => {
  const {
    TableProps,
    prepareRow,
    bodyItemList,
    tableInstance,
    TableRowProps,
    TableCellProps,
    headerItemList,
    TableBodyProps,
    TableHeadProps,
    renderBodyItem,
    renderPagination,
    renderHeaderItem,
    TableContainerProps,
    renderHeaderContentForSelectedRow,
  } = props;

  const renderHeader = useMemo(() => {
    if (typeof renderHeaderItem === "function") {
      return renderHeaderItem();
    }

    if (headerItemList) {
      if (!isEmpty(tableInstance.selectedFlatRows)) {
        return headerItemList.map((headerGroup) => {
          return (
            <TableRow
              {...headerGroup.getHeaderGroupProps()}
              {...omit(TableRowProps, "onRowClick")}
            >
              {headerGroup.headers.map((column) => {
                if (column.id === "selection") {
                  const { key } = column.getHeaderProps();

                  return (
                    <Fragment key={key}>
                      <TableCell
                        {...column.getHeaderProps()}
                        {...(column.colSpan && {
                          colSpan: column.colSpan,
                        })}
                        sx={{
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                          textAlign: column.textAlign,
                          whiteSpace: "nowrap",
                        }}
                        {...TableCellProps}
                      >
                        {column.render("Header")}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="col"
                        colSpan={tableInstance.allColumns.length * 2}
                      >
                        {renderHeaderContentForSelectedRow?.(tableInstance)}
                      </TableCell>
                    </Fragment>
                  );
                }

                return null;
              })}
            </TableRow>
          );
        });
      }

      return headerItemList.map((headerGroup) => {
        return (
          <TableRow
            {...headerGroup.getHeaderGroupProps()}
            {...omit(TableRowProps, "onRowClick")}
          >
            {headerGroup.headers.map((column) => {
              return (
                <TableCell
                  {...column.getHeaderProps()}
                  {...(column.colSpan && {
                    colSpan: column.colSpan,
                  })}
                  sx={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    textAlign: column.textAlign,
                    whiteSpace: "nowrap",
                  }}
                  {...TableCellProps}
                >
                  {column.render("Header")}
                </TableCell>
              );
            })}
          </TableRow>
        );
      });
    }

    return null;
  }, [
    renderHeaderItem,
    headerItemList,
    tableInstance.state,
    renderHeaderContentForSelectedRow,
  ]);

  const renderBody = useMemo(() => {
    if (typeof renderBodyItem === "function") {
      return renderBodyItem(bodyItemList, tableInstance);
    }

    if (isEmpty(bodyItemList)) {
      return (
        <TableRow>
          <TableCell
            colSpan={30}
            align="center"
            sx={{
              paddingY: 2,
            }}
          >
            Không có dữ liệu
          </TableCell>
        </TableRow>
      );
    }

    if (bodyItemList) {
      return bodyItemList.map((row, i) => {
        prepareRow(row);
        return (
          <TableRow
            {...row.getRowProps()}
            {...omit(TableRowProps, "onRowClick")}
            onClick={(event) => {
              const nodeName: string = get(event, "target.nodeName");

              if (["INPUT", "UL", "LI"].includes(nodeName)) {
                return;
              }

              TableRowProps?.onClick?.(event);
              TableRowProps?.onRowClick?.(row, event);
            }}
          >
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
                  {...TableCellProps}
                >
                  {cell.render("Cell")}
                </TableCell>
              );
            })}
          </TableRow>
        );
      });
    }

    return null;
  }, [
    tableInstance?.loading,
    tableInstance.state,
    bodyItemList,
    tableInstance?.activeEditRow,
    tableInstance?.updateHandler,
    tableInstance?.deleteHandler,
    renderBodyItem,
  ]);

  return (
    <MuiTableContainer component={Paper} {...TableContainerProps}>
      <Table {...TableProps}>
        <TableHead {...TableHeadProps}>{renderHeader}</TableHead>
        <TableBody {...TableBodyProps}>{renderBody}</TableBody>

        {typeof renderPagination === "function" && (
          <TableFooter>
            <TableRow>{renderPagination()}</TableRow>
          </TableFooter>
        )}
      </Table>
    </MuiTableContainer>
  );
};

export default CompoundTable;
