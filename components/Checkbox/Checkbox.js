import { useMemo } from "react";
import { useController } from "react-hook-form";
import { Checkbox as MuiCheckbox, FormGroup, FormControlLabel } from "@mui/material";

const Checkbox = ({
  control,
  FormGroupProps = {},
  FormControlLabelProps = {},
  ...props
}) => {
  const children = useMemo(() => {
    return control ? (
      <ComponentWithControl
        {...{ control, FormGroupProps, FormControlLabelProps, ...props }}
      />
    ) : (
      <ComponentWithNoControl {...{ FormGroupProps, FormControlLabelProps, ...props }} />
    );
  }, [control]);

  return children;
};

const ComponentWithNoControl = ({
  FormGroupProps = {},
  FormControlLabelProps = {},
  ...props
}) => {
  return (
    <FormGroup {...FormGroupProps}>
      <FormControlLabel control={<MuiCheckbox {...props} />} {...FormControlLabelProps} />
    </FormGroup>
  );
};

const ComponentWithControl = ({
  name,
  control,
  defaultValue,
  FormGroupProps = {},
  FormControlLabelProps = {},
  ...props
}) => {
  const {
    field: { ref, value, ...restProps },
  } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <FormGroup {...FormGroupProps}>
      <FormControlLabel
        control={<MuiCheckbox inputRef={ref} {...restProps} checked={value} {...props} />}
        {...FormControlLabelProps}
      />
    </FormGroup>
  );
};

export default Checkbox;
