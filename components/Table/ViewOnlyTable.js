import { useTable, useSortBy } from "react-table";

import { Grid, Box, Table } from "@mui/material";

import { TableHead, TableBody, TableContainer } from "../Table";

const ViewOnlyTable = ({ columns, data, maxHeight = 300, ...props }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    allColumns,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      ...props,
    },
    useSortBy
  );

  return (
    <Box>
      <Grid container spacing={2} direction="row">
        <Grid item xs={12}>
          <TableContainer sx={{ maxHeight }}>
            <Table {...getTableProps()} stickyHeader size="small">
              <TableHead
                {...{
                  allColumns,
                  headerGroups,
                  selectedFlatRows,
                }}
              />

              <TableBody
                {...{
                  allColumns,
                  rows,
                  getTableBodyProps,
                  prepareRow,
                  loading: false,
                  TableRowProps: {
                    sx: {
                      "&:hover": {
                        cursor: "unset",
                        backgroundColor: "action.hover",
                      },
                    },
                  },
                }}
              />
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewOnlyTable;
