import { TableBody as MuiTableBody, TableBodyProps, styled } from "@mui/material";

const TableBody = (props: TableBodyProps) => {
  return <StyledTableBody {...props} />;
};

const StyledTableBody = styled(MuiTableBody)(({ theme }) => {
  return {};
});

export default TableBody;
