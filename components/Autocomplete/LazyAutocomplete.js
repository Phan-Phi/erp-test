import useSWR from "swr";
import queryString from "query-string";
import { useMap } from "react-use";
import { useIntl } from "react-intl";

import { useController } from "react-hook-form";
import { useState, useEffect, Fragment } from "react";

import {
  Box,
  TextField,
  CircularProgress,
  Autocomplete,
  Typography,
  FormHelperText,
} from "@mui/material";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import differenceWith from "lodash/differenceWith";

const LazyAutocomplete = ({
  url,
  label,
  displayName,
  isOptionEqualToValue,
  renderOption,
  getOptionLabel,
  renderInput,
  shouldSearch,
  params = {},
  RenderInputProps = {},
  ...props
}) => {
  if (!url) {
    return null;
  }

  isOptionEqualToValue =
    typeof isOptionEqualToValue === "function"
      ? isOptionEqualToValue
      : (option, value) => {
          if (option == undefined || value == undefined) {
            return false;
          }

          return option?.id === value?.id;
        };

  renderOption =
    typeof renderOption === "function"
      ? renderOption
      : (props, option) => {
          return (
            <Box component="li" {...props} key={option?.id || "initial"}>
              <Typography>{option?.[displayName]}</Typography>
            </Box>
          );
        };

  getOptionLabel =
    typeof getOptionLabel === "function"
      ? getOptionLabel
      : (option) => {
          if (isEmpty(option)) {
            return "None";
          } else {
            return option?.[displayName];
          }
        };

  renderInput = (loading) => {
    return (params) => {
      return (
        <TextField
          {...params}
          label={label}
          variant="standard"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color="inherit" size={24} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
          InputLabelProps={{
            sx: {
              paddingLeft: "16px",
            },
          }}
          {...RenderInputProps}
        />
      );
    };
  };

  return (
    <Children
      {...{
        url,
        label,
        isOptionEqualToValue,
        renderOption,
        getOptionLabel,
        renderInput,
        shouldSearch,
        params,
        ...props,
      }}
    />
  );
};

const Children = ({
  name,
  control,
  defaultValue = null,
  url,
  isOptionEqualToValue,
  renderOption,
  getOptionLabel,
  renderInput,
  params: additionalParams,
  passHandler = () => {},
  shouldSearch = false,
  ...props
}) => {
  const {
    field: { ref, value, onChange: formHookOnChange, ...restProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const [map, { set }] = useMap({
    "": [defaultValue],
  });

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [open, setOpen] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(true);
  const [height, setHeight] = useState(0);
  const [searchStr, setSearchStr] = useState("");
  const { messages } = useIntl();

  const { data: resData } = useSWR(() => {
    const params = {
      page,
      page_size: 20,
      search: searchStr,
      ...additionalParams,
    };

    const stringifyParmas = queryString.stringify(params);

    if (shouldSearch) {
      if (open && hasNextPage && shouldLoad) {
        return `${url}?${stringifyParmas}`;
      } else {
        return null;
      }
    } else {
      if (open && hasNextPage && shouldLoad) {
        return `${url}?${stringifyParmas}`;
      } else {
        return null;
      }
    }
  });

  useEffect(() => {
    if (!resData) {
      return;
    }

    const results = get(resData, "results");
    const nextPage = get(resData, "next");

    if (nextPage) {
      setPage((prev) => {
        return prev + 1;
      });
    } else {
      setHasNextPage(false);
    }

    if (results) {
      const key = searchStr;
      const prevList = map[key] || [];

      const newList = differenceWith(results, prevList, (value1, value2) => {
        return value1?.id === value2?.id;
      });

      set(key, [...prevList, ...newList]);
    }

    setShouldLoad(false);
  }, [resData, height, map, searchStr]);

  let loading;

  if (shouldSearch) {
    loading = !resData && open && hasNextPage && shouldLoad && searchStr;
  } else {
    loading = !resData && open && hasNextPage && shouldLoad;
  }

  return (
    <Fragment>
      <Autocomplete
        {...{
          defaultValue,
          fullWidth: true,
          onOpen: () => {
            setOpen(true);
          },
          onClose: () => {
            setOpen(false);
          },
          loading: !!loading,
          getOptionLabel,
          isOptionEqualToValue,
          renderOption,
          renderInput: renderInput(loading),
          options: map[searchStr] || [],
          ListboxProps: {
            onScroll: throttle((e) => {
              const scrollTop = e.target.scrollTop;
              const scrollHeight = e.target.scrollHeight;
              const elementHeight = e.target.offsetHeight;
              const ratio = (scrollTop + elementHeight) / scrollHeight;

              if (ratio > 0.99 && !shouldLoad) {
                setShouldLoad(true);
                setHeight(scrollTop + elementHeight);
              }
            }, 300),
          },
          onInputChange: debounce((e) => {
            if (e !== null) {
              const value = e.target.value || "";
              setPage(1);
              setSearchStr(value);
              setShouldLoad(true);
              setHasNextPage(true);

              if (!map[value]) {
                set(value, []);
              }
            }
          }, 300),
          filterOptions: (options) => {
            return options;
          },
          onChange: (_, newValue) => {
            formHookOnChange(newValue);
          },
          includeInputInList: true,
          filterSelectedOptions: true,
          ...props,
        }}
      />
      {error && (
        <FormHelperText error={!!error} children={messages["message.error.required"]} />
      )}
    </Fragment>
  );
};

export default LazyAutocomplete;
