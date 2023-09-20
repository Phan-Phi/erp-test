import { Typography, Box, TableBody as MuiTableBody, TableRow } from "@mui/material";
import TableCell from "./TableCell";
import { LoadingTable } from "../Loading";

import { useIntl } from "react-intl";

const TableBody = ({
  page,
  rows,
  allColumns,
  loading,
  getTableBodyProps,
  prepareRow,
  TableBodyProps = {},
  TableRowProps = {},
}) => {
  const {
    sx: TableRowSx = {},
    onClick: onClickOfTableRow = () => {},
    ...restTableRowProps
  } = TableRowProps;

  let data = page ? page : rows;

  const { messages } = useIntl();

  return (
    <MuiTableBody {...getTableBodyProps()} {...TableBodyProps}>
      {data.length > 0 ? (
        data.map((row) => {
          prepareRow(row);
          return (
            <TableRow
              {...row.getRowProps()}
              onClick={(e) => {
                onClickOfTableRow(e, row);
              }}
              {...{
                sx: {
                  backgroundColor: row.isSelected ? "action.hover" : null,
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "action.hover",
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: "action.hover",
                  },
                  ...TableRowSx,
                },
                ...restTableRowProps,
              }}
            >
              {row.cells.map((cell) => {
                const TableCellProps = cell.column.TableCellProps || {
                  sx: {
                    minWidth: 150,
                  },
                };

                const { sx: TableCellSx, ...restTableCellProps } = TableCellProps;

                const WrapperCellProps = cell.column.WrapperCellProps || {
                  sx: {
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  },
                };

                const { sx: WrapperCellSx, ...restWrapperCellProps } = WrapperCellProps;

                return (
                  <TableCell
                    {...cell.getCellProps()}
                    sx={{
                      ...TableCellSx,
                    }}
                    {...restTableCellProps}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        ...WrapperCellSx,
                      }}
                      {...restWrapperCellProps}
                    >
                      {cell.render("Cell")}
                    </Box>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell colSpan={allColumns.length}>
            <Typography
              sx={{
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {messages["noData"]}
            </Typography>
          </TableCell>
        </TableRow>
      )}
      {loading && (
        <TableRow>
          <TableCell colSpan={allColumns.length}>
            <LoadingTable />
          </TableCell>
        </TableRow>
      )}
    </MuiTableBody>
  );
};

export default TableBody;
