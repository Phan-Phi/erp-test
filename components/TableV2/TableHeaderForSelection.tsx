import React from "react";
import { TableToggleAllRowsSelectedProps } from "react-table";

import IndeterminateCheckbox from "components/IndeterminateCheckbox";

interface TableHeaderForSelectionProps {
  getToggleAllRowsSelectedProps: (
    props?: Partial<TableToggleAllRowsSelectedProps> | undefined
  ) => TableToggleAllRowsSelectedProps;
}

const TableHeaderForSelection = (props: TableHeaderForSelectionProps) => {
  const { getToggleAllRowsSelectedProps } = props;

  const { checked, indeterminate, onChange } = getToggleAllRowsSelectedProps?.();

  return (
    <IndeterminateCheckbox
      sx={{
        marginLeft: 0,
        marginRight: 0,
      }}
      checked={checked}
      indeterminate={indeterminate}
      onChange={(_, checked) => {
        onChange?.(_ as React.ChangeEvent);
      }}
    />
  );
};

export default TableHeaderForSelection;
