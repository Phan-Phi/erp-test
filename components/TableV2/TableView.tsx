import { useTable, Column } from "react-table";
import { TableContainer } from "@mui/material";

import Table from "./Table";
import TableRow from "./TableRow";
import TableCell from "./TableCell";
import TableHead from "./TableHead";
import TableBody from "./TableBody";

interface TableViewProps {
  data: any[];
  columns: Column<any>[];
  prependChildren?: React.ReactNode;
  appendChildren?: React.ReactNode;
}

const TableView = (props: TableViewProps) => {
  const { columns, data, prependChildren, appendChildren } = props;

  const { rows, headers, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((column, idx) => {
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
                >
                  {column.render("Header")}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {prependChildren}

          {rows.map((row) => {
            prepareRow(row);

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

          {appendChildren}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
