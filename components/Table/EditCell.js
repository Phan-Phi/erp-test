import { forwardRef, useState, useEffect } from "react";
import NumberFormat from "react-number-format";

import { Input, Select, MenuItem } from "@mui/material";

const NumberFormatCustom = forwardRef((props, ref) => {
  let { onChange, onValueChange, suffix = " ₫", ...restProps } = props;

  onValueChange =
    typeof onValueChange === "function"
      ? onValueChange(onChange)
      : (values) => {
          const { value } = values;

          onChange({
            target: {
              value: parseFloat(value),
            },
          });
        };

  return (
    <NumberFormat
      getInputRef={ref}
      onValueChange={onValueChange}
      thousandSeparator
      isNumericString
      suffix={suffix}
      {...restProps}
    />
  );
});

const EditableCell = ({
  row,
  columnId,
  value: initialValue,
  updateEditRowDataHandler,
  inputType = "text",
  options = [],
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
    typeof updateEditRowDataHandler === "function" &&
      updateEditRowDataHandler({ value: e.target.value, keyName: columnId, row });
  };

  if (inputType === "select") {
    let children;

    if (options instanceof Array) {
      children = options.map((el) => {
        return (
          <MenuItem key={el[0]} value={el[0]}>
            {el[0]}
          </MenuItem>
        );
      });
    } else if (options instanceof Function) {
      children = options();
    }

    return (
      <Select
        labelId="select"
        id="select"
        value={value}
        label="select"
        onChange={onChange}
        fullWidth
        variant="standard"
        sx={{
          paddingLeft: 0,
        }}
      >
        {children}
      </Select>
    );
  } else if (inputType === "text") {
    return (
      <Input
        fullWidth
        sx={{
          paddingLeft: 0,
        }}
        value={value}
        onChange={onChange}
      />
    );
  } else {
    return (
      <Input
        fullWidth
        sx={{
          paddingLeft: 0,
        }}
        value={value}
        inputComponent={NumberFormatCustom}
        inputProps={props}
        onChange={onChange}
      />
    );
  }
};

export default EditableCell;
