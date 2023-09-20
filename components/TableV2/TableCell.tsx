import { TableCell as MuiTableCell, TableCellProps, styled } from "@mui/material";

const TableCell = (props: TableCellProps) => {
  return <StyledTableCell {...props} />;
};

const StyledTableCell = styled(MuiTableCell)(({ theme }) => {
  return {};
});

export default TableCell;
