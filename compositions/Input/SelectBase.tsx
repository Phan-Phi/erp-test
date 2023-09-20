import * as React from "react";

import {
  styled,
  Select,
  useTheme,
  SelectProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";
import { FormLabel } from "components";

export type SelectBaseProps = {
  placeholder?: string;
  label?: React.ReactNode;
  SelectProps?: SelectProps;
  FormLabelProps?: FormLabelProps;
  renderItem?: () => React.ReactNode;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

function SelectBase(props: SelectBaseProps) {
  const {
    label,
    renderItem,
    SelectProps,
    placeholder,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  const theme = useTheme();

  return (
    <FormControl {...FormControlProps}>
      <FormLabel {...FormLabelProps}>{label}</FormLabel>

      <StyledSelect
        SelectDisplayProps={{
          style: {
            padding: 8,
            borderColor: theme.palette.grey[300],
            borderWidth: 1,
            borderStyle: "solid",
          },
        }}
        color="primary2"
        placeholder={placeholder}
        {...SelectProps}
      >
        {renderItem && renderItem()}
      </StyledSelect>

      <FormHelperText {...FormHelperTextProps} />
    </FormControl>
  );
}

const StyledSelect = styled(Select)(() => {
  return {
    ["&:hover .MuiOutlinedInput-notchedOutline"]: {
      borderColor: "transparent",
    },

    ["& .MuiOutlinedInput-notchedOutline"]: {
      borderColor: "transparent",
    },
  };
});

export default SelectBase;
