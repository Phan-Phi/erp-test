import { TableContainer as MuiTableContainer, Paper } from "@mui/material";

const TableContainer = ({ children, ...rest }) => {
  return (
    <MuiTableContainer component={Paper} {...rest}>
      {children}
    </MuiTableContainer>
  );
};

export default TableContainer;
