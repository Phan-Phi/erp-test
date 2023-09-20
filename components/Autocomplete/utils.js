import { TextField, Typography, Box } from "@mui/material";

import isEmpty from "lodash/isEmpty";

export const renderOption = (displayName) => {
  return (props, option) => {
    return (
      <Box component="li" {...props} key={option?.id || option[displayName]}>
        <Typography>{option[displayName]}</Typography>
      </Box>
    );
  };
};

export const getOptionLabel = (name) => {
  return (option) => {
    if (isEmpty(option)) {
      return "";
    } else {
      return option[name];
    }
  };
};

export const isOptionEqualToValue = () => {
  return (option, value) => {
    if (isEmpty(option) || isEmpty(value)) {
      return true;
    }
    return option?.id === value?.id;
  };
};

export const renderInput = (RenderInputProps) => {
  return (params) => {
    const { InputLabelProps, ...props } = params;

    return (
      <TextField
        {...params}
        InputLabelProps={{
          ...InputLabelProps,
          sx: {
            paddingLeft: 2,
          },
        }}
        variant="standard"
        {...props}
        {...RenderInputProps}
      />
    );
  };
};
