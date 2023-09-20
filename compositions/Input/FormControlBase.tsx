import {
  InputProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";
import { FormLabel, InputBase } from "components";

export type FormControlBaseProps = {
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

const FormControlBase = (props: FormControlBaseProps) => {
  const { FormControlProps, FormLabelProps, FormHelperTextProps, InputProps } = props;

  return (
    <FormControl {...FormControlProps}>
      <FormLabel {...FormLabelProps} />
      <InputBase {...InputProps} />
      <FormHelperText {...FormHelperTextProps} />
    </FormControl>
  );
};

export default FormControlBase;
