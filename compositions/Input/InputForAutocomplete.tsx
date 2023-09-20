import React, { Fragment, forwardRef } from "react";
import { AutocompleteRenderInputParams, Box, CircularProgress } from "@mui/material";

import FormControlBase, { FormControlBaseProps } from "./FormControlBase";

interface ExtendedAutocompleteRenderInputParams extends AutocompleteRenderInputParams {
  label?: React.ReactNode;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  loading?: boolean;
}

const InputForAutocomplete = forwardRef(function InputForAutocomplete(
  props: ExtendedAutocompleteRenderInputParams & FormControlBaseProps,
  ref
) {
  const {
    InputLabelProps,
    label,
    placeholder,
    InputProps,
    inputProps,
    errorMessage,
    FormControlProps,
    FormHelperTextProps,
    FormLabelProps,
    loading,
    ...restProps
  } = props;

  return (
    <FormControlBase
      FormControlProps={{ ...restProps, ...FormControlProps }}
      FormLabelProps={{
        ...InputLabelProps,
        ...FormLabelProps,
        children: label,
      }}
      InputProps={{
        ...InputProps,
        inputProps,
        placeholder,
        inputRef: ref,
        readOnly: inputProps.readOnly,
        endAdornment: (
          <Fragment>
            {loading && (
              <Box display="flex" alignItems="center" marginRight={1}>
                <CircularProgress size={20} />
              </Box>
            )}
            {InputProps.endAdornment}
          </Fragment>
        ),
      }}
      FormHelperTextProps={{
        children: errorMessage,
        ...FormHelperTextProps,
      }}
    />
  );
});

export default InputForAutocomplete;
