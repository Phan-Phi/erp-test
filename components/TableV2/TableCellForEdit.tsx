import { ColumnInstance, Row } from "react-table";
import React, { useState, useCallback, useEffect } from "react";
import { Input, Select, SelectProps } from "@mui/material";
import NumberFormat, { NumberFormatPropsBase } from "react-number-format";

import { InputBase } from "components";

type CommonProps = {
  value: any;
  onChange: (...args: any[]) => void;
};
type ConditionalProps =
  | {
      inputType: "text";
      renderItem?: never;
      SelectProps?: never;
      NumberFormatProps?: never;
    }
  | {
      inputType: "select";
      renderItem: () => React.ReactNode;
      SelectProps?: SelectProps;
      NumberFormatProps?: never;
    }
  | {
      inputType: "number";
      renderItem?: never;
      SelectProps?: never;
      NumberFormatProps?: Omit<NumberFormatPropsBase<typeof InputBase>, "customInput">;
    };

type TableCellForEditProps = CommonProps & ConditionalProps;

const TableCellForEdit = (props: TableCellForEditProps) => {
  const { value: initValue, inputType, renderItem, onChange, NumberFormatProps } = props;
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const onChangeHandler = useCallback((e) => {
    if (inputType === "text") {
      setValue(e.target.value);
      onChange(e.target.value);
    } else if (inputType === "number") {
      const { formattedValue, value, floatValue } = e;

      setValue(value);
      onChange(value);
    } else if (inputType === "select") {
      setValue(e.target.value);
      onChange(e.target.value);
    }
  }, []);

  if (inputType === "select") {
    return (
      <Select
        value={value}
        onChange={onChangeHandler}
        sx={{
          ["& .MuiSelect-select"]: {
            paddingLeft: 1,
          },
        }}
        fullWidth
        variant="standard"
      >
        {renderItem()}
      </Select>
    );
  } else if (inputType === "text") {
    return <Input fullWidth value={value} onChange={onChangeHandler} />;
  } else {
    return (
      <NumberFormat
        fullWidth
        value={value}
        customInput={InputBase}
        onValueChange={onChangeHandler}
        thousandSeparator
        isNumericString
        {...NumberFormatProps}
      />
    );
  }
};

export default TableCellForEdit;
