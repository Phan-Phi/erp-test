import * as React from "react";
import { Controller, Control, Path } from "react-hook-form";

import {
  FormGroup,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormGroupProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import { FormLabel } from "./FormLabel";

type RenderItemType = ({
  value,
  onChange,
}: {
  value: boolean | undefined;
  onChange: (...event: any[]) => void;
}) => React.ReactNode;

type CommonProps = {
  label?: string;
  FormGroupProps?: FormGroupProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

type ConditionalProps<T extends object> =
  | {
      control: Control<T, any>;
      name: Path<T>;
      renderItem: RenderItemType;
    }
  | { control?: undefined; name?: never; renderItem: () => React.ReactNode };

type Props<T extends object> = CommonProps & ConditionalProps<T>;

export function Checkbox<T extends object>(props: Props<T>) {
  const {
    label,
    name,
    control,
    renderItem,
    FormLabelProps,
    FormGroupProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={(props) => {
          const {
            field: { onChange, value },
          } = props;

          return (
            <FormControl {...FormControlProps}>
              <FormLabel children={label} {...FormLabelProps} />

              <FormGroup {...FormGroupProps}>
                {renderItem &&
                  renderItem({ value: value as boolean | undefined, onChange })}
              </FormGroup>

              <FormHelperText {...FormHelperTextProps} />
            </FormControl>
          );
        }}
      />
    );
  } else if (!control && !name) {
    return (
      <FormControl {...FormControlProps}>
        <FormLabel children={label} {...FormLabelProps} />

        <FormGroup {...FormGroupProps}>{renderItem && renderItem()}</FormGroup>

        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  } else {
    return null;
  }
}
