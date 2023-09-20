import React from "react";

import { DateTimePicker } from "components";

const TableCellForPickDateTime = (props: React.ComponentProps<typeof DateTimePicker>) => {
  return (
    <div>
      <DateTimePicker {...props} />
    </div>
  );
};

export default TableCellForPickDateTime;
