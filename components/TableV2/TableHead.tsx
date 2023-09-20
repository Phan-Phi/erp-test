import { TableHead as MuiTableHead, TableHeadProps, styled } from "@mui/material";

const TableHead = (props: TableHeadProps) => {
  return <StyledTableHead {...props} />;
};

const StyledTableHead = styled(MuiTableHead)(({ theme }) => {
  return {};
});

export default TableHead;
