import { TableRow as MuiTableRow, TableRowProps, styled } from "@mui/material";

const TableRow = (props: TableRowProps) => {
  return <StyledTableRow {...props} />;
};

const StyledTableRow = styled(MuiTableRow)(({ theme }) => {
  return {};
});

export default TableRow;
