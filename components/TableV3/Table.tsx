import { Table as MuiTable, TableProps } from "@mui/material";

const Table = (props: TableProps) => {
  return <MuiTable size="small" stickyHeader {...props} />;
};

export default Table;
