import React from "react";
import {
  TableContainer as MuiTableContainer,
  TableContainerProps as MuiTableContainerProps,
  styled,
} from "@mui/material";

const selectedKeyList = ["height", "maxHeight", "minHeight"] as const;

type SelectedKeyType = (typeof selectedKeyList)[number];

type SelectedType = Pick<React.CSSProperties, SelectedKeyType>;

type TableContainerProps = MuiTableContainerProps & SelectedType;

const TableContainer = (props: TableContainerProps) => {
  return <StyledTableContainer {...props} />;
};

const StyledTableContainer = styled(MuiTableContainer, {
  shouldForwardProp: (propName) => !selectedKeyList.includes(propName as any),
})<SelectedType>(({ height, maxHeight, minHeight }) => {
  return {
    height,
    maxHeight,
    minHeight,
  };
});

export default TableContainer;
