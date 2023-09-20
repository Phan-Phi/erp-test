import { forwardRef, useRef, useEffect } from "react";
import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
} from "@mui/material";

interface ExtendCheckboxProps extends Omit<FormControlLabelProps, "control" | "label"> {
  hasText?: boolean;
  checked?: CheckboxProps["checked"];
  indeterminate?: CheckboxProps["indeterminate"];
  CheckboxProps?: Omit<CheckboxProps, "indeterminate" | "checked">;
}

export default forwardRef<any, ExtendCheckboxProps>((props, ref) => {
  const { indeterminate, hasText = false, checked, CheckboxProps, ...restProps } = props;

  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    if (typeof resolvedRef !== "function") {
      resolvedRef.current.indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  return (
    <FormControlLabel
      label={hasText ? "Tất cả" : undefined}
      control={
        <Checkbox
          checked={checked}
          inputRef={resolvedRef}
          indeterminate={indeterminate}
          {...CheckboxProps}
        />
      }
      {...restProps}
    />
  );
});
