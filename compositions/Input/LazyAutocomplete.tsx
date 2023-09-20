import { useState } from "react";
import { useToggle } from "react-use";

import { CircularProgress, Autocomplete, AutocompleteProps, Box } from "@mui/material";

import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

import { transformUrl } from "libs";
import { useFetchInfinite } from "hooks";
import InputForAutocomplete from "./InputForAutocomplete";

type CommonProps<V extends object> = {
  url?: string;
  placeholder?: string;
  label?: React.ReactNode;
  AutocompleteProps?: Omit<
    AutocompleteProps<V, undefined, undefined, undefined>,
    "renderInput" | "options" | "ListboxProps"
  >;
  params?: {
    [key: string]: any;
  };
  error?: any;
  required?: boolean;
};

const LazyAutocomplete = <V extends object>(props: CommonProps<V>) => {
  const {
    url,
    placeholder,
    params: additionalParams,
    AutocompleteProps = {},
    label,
    error,
    required,
  } = props;

  const [open, toggle] = useToggle(false);
  const [searchStr, setSearchStr] = useState("");

  const { data, isLoading, fetchNextPage } = useFetchInfinite((_, prevData) => {
    const initParams = {
      search: searchStr,
      page_size: 25,
      ...additionalParams,
    };

    if (prevData == null) return transformUrl(url, initParams);

    return prevData.next;
  });

  return (
    <Autocomplete
      fullWidth={true}
      open={open}
      onOpen={() => toggle(true)}
      onClose={() => toggle(false)}
      options={data || []}
      loading={isLoading}
      disableCloseOnSelect={false}
      includeInputInList={true}
      filterSelectedOptions={true}
      ListboxProps={{
        onScroll: throttle((e) => {
          const scrollTop = e.target.scrollTop;
          const scrollHeight = e.target.scrollHeight;
          const elementHeight = e.target.offsetHeight;
          const ratio = (scrollTop + elementHeight) / scrollHeight;

          if (ratio > 0.98 && !isLoading) {
            fetchNextPage();
          }
        }, 300),
      }}
      onInputChange={debounce((_, value) => {
        setSearchStr(value);
      }, 300)}
      renderInput={(props) => {
        return (
          <InputForAutocomplete
            loading={isLoading}
            label={label}
            placeholder={placeholder}
            error={!!error}
            errorMessage={error && error.message}
            FormControlProps={{
              required: required,
            }}
            {...props}
          />
        );
      }}
      loadingText={
        <Box display="flex" justifyContent="center">
          <CircularProgress size={20} />
        </Box>
      }
      {...AutocompleteProps}
    />
  );
};

export default LazyAutocomplete;
