import {
  TablePagination as MuiTablePagination,
  TablePaginationProps,
  styled,
  Box,
} from "@mui/material";

const TablePagiantion = (props: TablePaginationProps) => {
  return (
    <StyledTablePagination
      labelRowsPerPage={"Số dòng mỗi trang"}
      rowsPerPageOptions={[25, 50, 75, 100]}
      {...props}
    />
  );
};

const StyledTablePagination = styled(MuiTablePagination)(({ theme }) => {
  return {
    ["& .MuiTablePagination-spacer"]: {
      display: "none",
    },
    ["@media print"]: {
      display: "none",
    },
  };
});

export default TablePagiantion;
