import React from "react";
import { ColumnInstance } from "react-table";

import SyncAltIcon from "@mui/icons-material/SyncAlt";

import {
  Box,
  styled,
  BoxProps,
  Tooltip,
  TooltipProps,
  TableSortLabel,
} from "@mui/material";

interface ExtendBoxProps extends Omit<BoxProps, "title"> {
  title?: TooltipProps["title"];
}

type ConditionalProps<T extends Record<string, unknown>> =
  | { isSortBy: true; column: ColumnInstance<T> }
  | { isSortBy?: false; column?: never };

type Props<T extends Record<string, unknown>> = ExtendBoxProps & ConditionalProps<T>;

const WrapperTableCell = <T extends Record<string, unknown> = {}>(props: Props<T>) => {
  const { title, isSortBy, column, ...restProps } = props;

  if (isSortBy && column) {
    const { onClick, style } = column.getSortByToggleProps();

    return (
      <TableSortLabel
        active={column.isSorted}
        direction={column.isSorted && column.isSortedDesc ? "desc" : "asc"}
        onClick={onClick}
        style={style}
      >
        <StyledBox width={150} {...restProps} />
        {column.isSorted === false && (
          <WrapperIcon>
            <SyncAltIcon fontSize="small" />
          </WrapperIcon>
        )}
      </TableSortLabel>
    );
  }

  return (
    <Tooltip title={title || ""}>
      <StyledBox {...restProps} />
    </Tooltip>
  );
};

const StyledBox = styled(Box)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  display: "flex",
});

const WrapperIcon = styled(Box)({
  position: "absolute",
  right: 4,
  top: "50%",
  transform: "translateY(-50%) rotate(90deg)",
});

export default WrapperTableCell;
