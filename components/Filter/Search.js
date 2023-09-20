import { useState, useEffect, Fragment } from "react";
import useSWR from "swr";
import queryString from "query-string";
import { useMap } from "react-use";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import differenceWith from "lodash/differenceWith";

import {
  TextField,
  CircularProgress,
  Autocomplete,
  Typography,
  MenuItem,
} from "@mui/material";

const Search = ({
  url,
  label,
  displayName,
  isOptionEqualToValue,
  renderOption,
  getOptionLabel,
  renderInput,
  ...restProps
}) => {
  if (!url || !displayName) {
    return null;
  }

  if (typeof isOptionEqualToValue !== "function") {
    isOptionEqualToValue = (option, value) => {
      return option?.id === value?.id;
    };
  }

  if (typeof renderOption !== "function") {
    renderOption = (props, option) => {
      return (
        <MenuItem {...props} key={option.id || option[displayName]}>
          <Typography
            sx={{
              fontSize: "14px",
            }}
          >
            {option[displayName]}
          </Typography>
        </MenuItem>
      );
    };
  }

  if (typeof getOptionLabel !== "function") {
    getOptionLabel = (option) => {
      if (isEmpty(option)) {
        return null;
      } else {
        return option[displayName];
      }
    };
  }

  if (typeof renderInput !== "function") {
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
              sx: {
                fontSize: "14px",
                paddingLeft: 0,
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: "14px",
                paddingLeft: "0px !important",
                ["&.MuiInputLabel-shrink"]: {
                  transform: "translate(0px, -9px) scale(0.75)!important",
                },
              },
            }}
          />
        );
      };
    };
  }

  return (
    <Children
      {...{
        url,
        label,
        isOptionEqualToValue,
        renderOption,
        getOptionLabel,
        renderInput,
        ...restProps,
      }}
    />
  );
};

const Children = ({
  url,
  isOptionEqualToValue,
  renderOption,
  getOptionLabel,
  renderInput,
  params: additionalParams,
  passHandler = () => {},
  shouldSearch = false,
  ...restProps
}) => {
  const [map, { set }] = useMap({
    "": [],
  });
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [open, setOpen] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(true);
  const [height, setHeight] = useState(0);
  const [searchStr, setSearchStr] = useState("");

  const { data: resData } = useSWR(() => {
    const params = {
      page,
      page_size: 20,
      search: searchStr,
      ...additionalParams,
    };

    const stringifyParmas = queryString.stringify(params);

    if (shouldSearch) {
      if (open && hasNextPage && shouldLoad && searchStr) {
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
        return value1.id === value2.id;
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
    <Autocomplete
      {...{
        fullWidth: true,
        onOpen: () => {
          setOpen(true);
        },
        onClose: () => {
          setOpen(false);
        },
        loading: Boolean(loading),
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
            const value = e.target.value;
            setSearchStr(value);
            setShouldLoad(true);
            setPage(1);
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
          passHandler({
            value: newValue,
          });
        },
        defaultValue: null,
        includeInputInList: true,
        filterSelectedOptions: true,
        ...restProps,
      }}
    />
  );
};

export default Search;
