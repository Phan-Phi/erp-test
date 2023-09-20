import React, { Fragment, useMemo, ComponentProps } from "react";
import { ColumnInstance, Row } from "react-table";

import { Stack, IconButton, Skeleton } from "@mui/material";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import WrapperTableCell from "./WrapperTableCell";

type CommonProps = { loading?: boolean; checkDeletePushTime?: number };

type ConditionalProps<T extends Record<string, unknown>> =
  | {
      renderItem: () => React.ReactNode;
      onViewHandler?: never;
      onDeleteHandler?: never;
      row?: never;
      column?: never;
      WrapperTableCellProps?: never;
    }
  | {
      row: Row<T>;
      renderItem?: undefined;
      column: ColumnInstance<T>;
      WrapperTableCellProps?: ComponentProps<typeof WrapperTableCell>;
      onViewHandler: (props: { row: Row<T>; column: ColumnInstance<T> }) => void;
      onDeleteHandler?: (props: { row: Row<T>; column: ColumnInstance<T> }) => void;
    };

type ActionTableCellProps<T extends Record<string, unknown>> = CommonProps &
  ConditionalProps<T>;

const ActionTableCell = <T extends Record<string, unknown>>(
  props: ActionTableCellProps<T>
) => {
  const {
    checkDeletePushTime,
    renderItem,
    onViewHandler,
    row,
    column,
    onDeleteHandler,
    WrapperTableCellProps,
    loading,
  } = props;

  const renderContent = useMemo(() => {
    if (renderItem) {
      return renderItem();
    }

    return (
      <Fragment>
        {onViewHandler ? (
          <IconButton
            onClick={() => {
              onViewHandler({ row, column });
            }}
          >
            <VisibilityOutlinedIcon />
          </IconButton>
        ) : null}

        {onDeleteHandler ? (
          <IconButton
            disabled={
              checkDeletePushTime == undefined
                ? false
                : checkDeletePushTime > 0
                ? true
                : false
            }
            onClick={() => {
              onDeleteHandler({ row, column });
            }}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        ) : null}
      </Fragment>
    );
  }, [renderItem, row, column, checkDeletePushTime, onDeleteHandler, onViewHandler]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <WrapperTableCell {...WrapperTableCellProps}>
      <Stack flexDirection="row" columnGap={2}>
        {renderContent}
      </Stack>
    </WrapperTableCell>
  );
};

export default ActionTableCell;
