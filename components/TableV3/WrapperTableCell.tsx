import React from "react";
import { ColumnInstance } from "react-table";

import { Box, styled, BoxProps, Tooltip, TooltipProps, Skeleton } from "@mui/material";

interface ExtendBoxProps extends Omit<BoxProps, "title"> {
  title?: TooltipProps["title"];
  loading?: boolean;
}

type ConditionalProps =
  | { isSortBy: true; column: ColumnInstance }
  | { isSortBy?: false; column?: never };

type Props = ExtendBoxProps & ConditionalProps;

const WrapperTableCell = (props: Props) => {
  const { title, isSortBy, column, loading, ...restProps } = props;

  if (loading) return <Skeleton />;

  return (
    <Tooltip title={title || ""}>
      <StyledBox {...restProps} />
    </Tooltip>
  );
};

const StyledBox = styled(Box)({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
});

export default WrapperTableCell;
