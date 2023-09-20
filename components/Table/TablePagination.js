import { useIntl } from "react-intl";

import { TablePagination as MuiTablePagination } from "@mui/material";

const TablePagination = ({
  totalCount,
  pageSize,
  pageIndex,
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPageOptions = [25, 50, 100],
  ...props
}) => {
  const { messages } = useIntl();

  return (
    <MuiTablePagination
      sx={{
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
        },
      }}
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={totalCount}
      rowsPerPage={pageSize}
      page={pageIndex}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage={messages["rowsPerPage"]}
      {...props}
    />
  );
};

export default TablePagination;
