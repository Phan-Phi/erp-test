import { Fragment } from "react";
import { TableHead as MuiTableHead, TableRow, TableSortLabel, Box } from "@mui/material";
import TableCell from "./TableCell";

const TableHead = ({
  headerGroups,
  selectedFlatRows = [],
  allColumns = [],
  TableHeadProps = {},
  TableRowProps = {},
  children = null,
}) => {
  return (
    <MuiTableHead {...TableHeadProps}>
      {headerGroups.map((headerGroup) => (
        <TableRow {...headerGroup.getHeaderGroupProps()} {...TableRowProps}>
          {selectedFlatRows.length > 0
            ? headerGroup.headers.map((column, i) => {
                const TableCellProps = column.TableCellProps || {
                  sx: {
                    minWidth: 150,
                  },
                };

                const { sx: TableCellSx = {}, ...restTableCellProps } = TableCellProps;

                if (column.id === "selection") {
                  return (
                    <Fragment key={i}>
                      <TableCell
                        {...column.getHeaderProps()}
                        component="th"
                        scope="col"
                        sx={{
                          ...TableCellSx,
                        }}
                        {...restTableCellProps}
                      >
                        {column.render("Header")}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="col"
                        colSpan={allColumns.length}
                        sx={{
                          ...TableCellSx,
                        }}
                        {...restTableCellProps}
                      >
                        {typeof children === "function" && children(selectedFlatRows)}
                      </TableCell>
                    </Fragment>
                  );
                }
                return null;
              })
            : headerGroup.headers.map((column) => {
                const TableCellProps = column.TableCellProps || {
                  sx: {
                    minWidth: 150,
                  },
                };

                const { sx: TableCellSx = {}, ...restTableCellProps } = TableCellProps;

                const WrapperCellProps = column.WrapperCellProps || {
                  sx: {
                    display: "flex",
                    justifyContent: "flext-start",
                    alignItems: "center",
                  },
                };

                const { sx: WrapperCellSx, ...restWrapperCellProps } = WrapperCellProps;

                return (
                  <TableCell
                    {...column.getHeaderProps()}
                    component="th"
                    scope="col"
                    sx={{
                      ...TableCellSx,
                    }}
                    {...restTableCellProps}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flext-start",
                        ...WrapperCellSx,
                      }}
                      {...restWrapperCellProps}
                    >
                      {column.canSort ? (
                        <TableSortLabel
                          {...column.getSortByToggleProps()}
                          active={column.isSorted}
                          direction={column.isSorted && column.isSortedDesc ? "desc" : "asc"}
                        >
                          {column.render("Header")}
                        </TableSortLabel>
                      ) : (
                        column.render("Header")
                      )}
                    </Box>
                  </TableCell>
                );
              })}
        </TableRow>
      ))}
    </MuiTableHead>
  );
};

export default TableHead;
