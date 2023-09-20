import { Fragment } from "react";

import { useIntl } from "react-intl";

import { Autocomplete as MuiAutocomplete, FormHelperText } from "@mui/material";

import { useController } from "react-hook-form";
import { useMemo } from "react";

import {
  getOptionLabel as defaultGetOptionLabel,
  isOptionEqualToValue as defaultIsOptionEqualToValue,
  renderInput as defaultRenderInput,
  renderOption as defaultRenderOption,
} from "./utils";

const AutoComplete = ({
  control,
  displayName = 1,
  getOptionLabel,
  renderInput,
  isOptionEqualToValue,
  renderOption,
  RenderInputProps = {},
  options,
  ...props
}) => {
  const children = useMemo(() => {
    getOptionLabel =
      typeof getOptionLabel === "function"
        ? getOptionLabel
        : defaultGetOptionLabel(displayName);

    renderInput =
      typeof renderInput === "function"
        ? renderInput
        : defaultRenderInput(RenderInputProps);

    isOptionEqualToValue =
      typeof isOptionEqualToValue === "function"
        ? isOptionEqualToValue
        : defaultIsOptionEqualToValue();

    renderOption =
      typeof renderOption === "function"
        ? renderOption
        : defaultRenderOption(displayName);

    if (!options) {
      return null;
    }

    return control ? (
      <ComponentWithControl
        {...{
          control,
          displayName,
          getOptionLabel,
          renderInput,
          isOptionEqualToValue,
          renderOption,
          options,
          ...props,
        }}
      />
    ) : (
      <ComponentWithNoControl
        {...{
          displayName,
          getOptionLabel,
          renderInput,
          isOptionEqualToValue,
          renderOption,
          options,
          ...props,
        }}
      />
    );
  });

  return children;
};

const ComponentWithControl = ({
  defaultValue = null,
  name,
  control,
  displayName,
  getOptionLabel,
  renderInput,
  isOptionEqualToValue,
  renderOption,
  multiple,
  options,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const { messages } = useIntl();

  return (
    <Fragment>
      <MuiAutocomplete
        value={multiple ? [field.value] : field.value}
        onChange={function (_, data) {
          field.onChange(data);
        }}
        options={options}
        getOptionLabel={getOptionLabel}
        autoHighlight
        renderInput={renderInput}
        isOptionEqualToValue={isOptionEqualToValue}
        renderOption={renderOption}
        {...props}
      />
      {error && (
        <FormHelperText
          sx={{
            marginTop: 1,
          }}
          error={true}
        >
          {messages[`error.${error.type}`]}
        </FormHelperText>
      )}
    </Fragment>
  );
};

const ComponentWithNoControl = ({
  displayName,
  getOptionLabel,
  renderInput,
  isOptionEqualToValue,
  renderOption,
  options,
  ...props
}) => {
  return (
    <MuiAutocomplete
      onChange={(_, data) => {}}
      options={options}
      getOptionLabel={getOptionLabel}
      autoHighlight
      renderInput={renderInput}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={renderOption}
      {...props}
    />
  );
};

export default AutoComplete;
