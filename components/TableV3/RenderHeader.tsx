import { isEmpty } from "lodash";
import React, { Fragment } from "react";
import { TableInstance } from "react-table";

import TableRow from "./TableRow";
import TableCell from "./TableCell";

interface RenderHeaderProps {
  table: TableInstance<any>;
  renderHeaderContentForSelectedRow?: (
    tableInstance: TableInstance<any>
  ) => React.ReactNode;
}

const RenderHeader = (props: RenderHeaderProps) => {
  const { table, renderHeaderContentForSelectedRow } = props;

  return (
    <Fragment>
      {table.headerGroups.map((headerGroup) => {
        if (!isEmpty(table.selectedFlatRows)) {
          return (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                if (column.id === "selection") {
                  return (
                    <Fragment key={index}>
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
                      >
                        {column.render("Header")}
                      </TableCell>

                      <TableCell
                        component="th"
                        scope="col"
                        colSpan={table.allColumns.length * 2}
                      >
                        {renderHeaderContentForSelectedRow?.(table)}
                      </TableCell>
                    </Fragment>
                  );
                }
              })}
            </TableRow>
          );
        }

        return (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, index) => {
              return (
                <Fragment key={index}>
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
                  >
                    {column.render("Header")}
                  </TableCell>
                </Fragment>
              );
            })}
          </TableRow>
        );
      })}
    </Fragment>
  );
};

export default RenderHeader;
