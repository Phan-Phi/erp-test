import { forwardRef } from "react";
import {
  TablePagination as MuiTablePagination,
  TablePaginationProps,
} from "@mui/material";

const TablePagination = forwardRef(function TablePagination(
  props: TablePaginationProps,
  ref
) {
  return (
    <MuiTablePagination
      width="100%"
      labelRowsPerPage={"Số dòng mỗi trang"}
      rowsPerPageOptions={[25, 50, 75, 100]}
      ref={ref}
      component="div"
      {...props}
    />
  );
});

export default TablePagination;
