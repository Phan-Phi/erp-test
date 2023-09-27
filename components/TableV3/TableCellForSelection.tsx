import React from "react";
import { Row } from "react-table";
import { Skeleton } from "@mui/material";

import IndeterminateCheckbox from "components/IndeterminateCheckbox";

interface TableCellForSelectionProps<T extends Record<string, unknown>> {
  row: Row<T>;
  loading?: boolean;
  disabled?: boolean;
}

const TableCellForSelection = <T extends Record<string, unknown>>(
  props: TableCellForSelectionProps<T>
) => {
  const { loading, row, disabled } = props;

  if (loading) {
    return <Skeleton />;
  }

  const { checked, onChange, indeterminate } = row.getToggleRowSelectedProps?.();

  return (
    <IndeterminateCheckbox
      sx={{
        marginLeft: 0,
        marginRight: 0,
      }}
      disabled={disabled}
      checked={disabled ? false : checked}
      indeterminate={indeterminate}
      onChange={(e, checked) => {
        onChange?.(e as React.ChangeEvent);
      }}
    />
  );
};

export default TableCellForSelection;

// export const decorateSelection = (column, loading) => {
//   column.disableSortBy = true;

//   column.TableCellProps = {
//     sx: {
//       minWidth: 64,
//       maxWidth: 64,
//       width: 64,
//     },
//   };

//   return column;
// };
