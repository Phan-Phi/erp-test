import * as React from "react";
import { UseControllerReturn } from "react-hook-form";

import SelectBase, { SelectBaseProps } from "./SelectBase";

type FormControlSelectProps = {
  controlState: any;
} & SelectBaseProps;

function FormControlForSelect(props: FormControlSelectProps) {
  const {
    controlState,
    FormControlProps,
    SelectProps,
    FormHelperTextProps,
    FormLabelProps,

    ...restProps
  } = props;

  const { field, fieldState } = controlState as UseControllerReturn;

  const { name, onBlur, onChange, ref, value } = field;
  const { error } = fieldState;

  return (
    <SelectBase
      FormControlProps={{
        error: !!error,
        ...FormControlProps,
      }}
      SelectProps={{
        onChange: (e) => {
          onChange(e.target.value);
        },
        value,
        onBlur,
        inputRef: ref,
        ...SelectProps,
      }}
      FormLabelProps={{
        htmlFor: name,
        ...FormLabelProps,
      }}
      FormHelperTextProps={{
        children: error && error.message,

        ...FormHelperTextProps,
      }}
      {...restProps}
    />
  );
}

export default FormControlForSelect;
