import { Table as MuiTable, TableProps, styled } from "@mui/material";

const Table = (props: TableProps) => {
  return <StyledTable size="small" stickyHeader {...props} />;
};

const StyledTable = styled(MuiTable)(({ theme }) => {
  return {};
});

export default Table;
