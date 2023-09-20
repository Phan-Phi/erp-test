import { useIntl } from "react-intl";

import { TextField, Typography, MenuItem, Autocomplete } from "@mui/material";

import isEmpty from "lodash/isEmpty";

export default ({
  label = "",
  value = "",
  options = [],
  multiple = false,
  getOptionLabel,
  displayName = "",
  renderInput,
  renderOption,
  isOptionEqualToValue,
  passHandler = () => {},
  choiceKey,
  ...restProps
}) => {
  const { messages } = useIntl();

  if (typeof renderInput !== "function") {
    renderInput = (params) => {
      return (
        <TextField
          {...params}
          InputLabelProps={{
            ...params.InputLabelProps,
            sx: {
              fontSize: "14px",
              paddingLeft: "0px !important",
              ["&.MuiInputLabel-shrink"]: {
                transform: "translate(0px, -9px) scale(0.75)!important",
              },
            },
          }}
          InputProps={{
            ...params.InputProps,
            sx: {
              paddingLeft: 0,
              fontSize: "14px",
            },
          }}
          label={label}
          variant="standard"
        />
      );
    };
  }

  if (typeof getOptionLabel !== "function") {
    if (choiceKey) {
      getOptionLabel = (option) => {
        if (isEmpty(option)) {
          return "";
        } else {
          if (Array.isArray(option)) {
            return messages[`${choiceKey}.${option[0]}`];
          }
          return messages[`${choiceKey}.${option}`];
        }
      };
    } else {
      getOptionLabel = (option) => {
        if (isEmpty(option)) {
          return "";
        } else {
          if (Array.isArray(option)) {
            return option[displayName];
          }
          return option;
        }
      };
    }
  }

  if (typeof renderOption !== "function") {
    if (choiceKey) {
      renderOption = (props, option) => {
        return (
          <MenuItem {...props} key={option.id || option[0]}>
            <Typography>{messages[`${choiceKey}.${option[0]}`]}</Typography>
          </MenuItem>
        );
      };
    } else {
      renderOption = (props, option) => {
        return (
          <MenuItem {...props} key={option.id || option[displayName]}>
            <Typography>{option[displayName]}</Typography>
          </MenuItem>
        );
      };
    }
  }

  if (typeof isOptionEqualToValue !== "function") {
    if (choiceKey) {
      isOptionEqualToValue = (option, value) => {
        if (value == "") {
          return true;
        }

        return option[0] === value;
      };
    } else {
      isOptionEqualToValue = (option, value) => {
        if (value == "") {
          return true;
        }

        return option[0] == value;
      };
    }
  }

  return (
    <Autocomplete
      value={multiple ? [value] : value}
      onChange={(_, newValue) => {
        passHandler({ value: newValue });
      }}
      options={options}
      getOptionLabel={getOptionLabel}
      autoHighlight
      renderInput={renderInput}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={renderOption}
      {...restProps}
    />
  );
};
