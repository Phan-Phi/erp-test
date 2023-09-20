import * as React from "react";
import { Controller, Control, Path } from "react-hook-form";

import {
  styled,
  Select as MuiSelect,
  useTheme,
  SelectProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import { FormLabel } from "./FormLabel";

type CommonProps = {
  label?: string;
  SelectProps?: SelectProps;
  FormLabelProps?: FormLabelProps;
  renderItem?: () => React.ReactNode;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

type ConditionalProps<T extends object> =
  | {
      control: Control<T, any>;
      name: Path<T>;
    }
  | { control?: undefined; name?: never };

type Props<T extends object> = CommonProps & ConditionalProps<T>;

export function Select<T extends object>(props: Props<T>) {
  const {
    name,
    label,
    control,
    renderItem,
    SelectProps,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  const theme = useTheme();

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={(props) => {
          const {
            field: { onChange, value },
            fieldState: { error },
          } = props;

          return (
            <FormControl {...FormControlProps} error={!!error}>
              <FormLabel children={label} {...FormLabelProps} />

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
                {...SelectProps}
                value={value}
                onChange={onChange}
              >
                {renderItem && renderItem()}
              </StyledSelect>

              <FormHelperText {...FormHelperTextProps} children={error?.message} />
            </FormControl>
          );
        }}
      />
    );
  } else {
    return (
      <FormControl {...FormControlProps}>
        <FormLabel children={label} {...FormLabelProps} />

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
          {...SelectProps}
        >
          {renderItem && renderItem()}
        </StyledSelect>

        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  }
}

const StyledSelect = styled(MuiSelect)(({ theme }) => {
  return {
    ["&:hover .MuiOutlinedInput-notchedOutline"]: {
      borderColor: "transparent",
    },

    ["& .MuiOutlinedInput-notchedOutline"]: {
      borderColor: "transparent",
    },
  };
});
