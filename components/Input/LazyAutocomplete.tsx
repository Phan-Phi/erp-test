import useSWR from "swr";
import { useMap } from "react-use";
import { useIntl } from "react-intl";

import { Controller, Control, Path } from "react-hook-form";
import { useState, useEffect, Fragment } from "react";

import {
  CircularProgress,
  Autocomplete,
  FormHelperText,
  AutocompleteProps,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
  FormControl,
  InputProps,
} from "@mui/material";

import get from "lodash/get";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import differenceWith from "lodash/differenceWith";

import { transformUrl } from "libs";
import { InputBase } from "./InputBase";
import { FormLabel } from "./FormLabel";

type CommonProps<V extends object> = {
  url?: string;
  label?: string;
  placeholder?: string;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  AutocompleteProps?: Omit<
    AutocompleteProps<V, undefined, undefined, undefined>,
    "renderInput" | "options" | "ListboxProps"
  >;
  FormHelperTextProps?: FormHelperTextProps;
  params?: {
    [key: string]: any;
  };
  shouldSearch?: boolean;
  InputProps?: InputProps;
  searchKey?: string;
};

type ConditionalProps<T extends object, V extends object> =
  | {
      control: Control<T, any>;
      name: Path<T>;
      initValue?: never;
    }
  | {
      control?: undefined;
      name?: never;
      initValue?: V | null;
    };

type Props<T extends object, V extends object> = CommonProps<V> & ConditionalProps<T, V>;

export const LazyAutocomplete = <T extends object, V extends object>(
  props: Props<T, V>
) => {
  const { url } = props;

  if (!url) return null;

  return <RootComponent {...props} />;
};

const RootComponent = <T extends object, V extends object>(props: Props<T, V>) => {
  const {
    name,
    control,
    url,
    placeholder,
    params: additionalParams,
    shouldSearch = false,
    AutocompleteProps = {},
    FormControlProps,
    FormHelperTextProps,
    FormLabelProps,
    label,
    InputProps,
    initValue,
    searchKey = "search",
  } = props;

  const [map, { set }] = useMap<{
    [key: string]: any[];
  }>({
    "": [],
  });

  const [page, setPage] = useState(1);

  const [hasNextPage, setHasNextPage] = useState(true);

  const [open, setOpen] = useState(false);

  const [shouldLoad, setShouldLoad] = useState(true);

  const [height, setHeight] = useState(0);

  const [searchStr, setSearchStr] = useState("");

  const { messages } = useIntl();

  const [selectedValue, setSelectedValue] = useState<V | null>(() => {
    if (initValue == undefined) return null;

    return initValue;
  });

  const { data: resData } = useSWR(() => {
    const params = {
      page,
      page_size: 20,
      [searchKey]: searchStr,
      ...additionalParams,
    };

    if (shouldSearch) {
      if (open && hasNextPage && shouldLoad && searchStr) {
        return transformUrl(url, params);
      }
    } else {
      if (open && hasNextPage && shouldLoad) {
        return transformUrl(url, params);
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

      const newList = differenceWith(results, prevList, (value1: any, value2: any) => {
        return value1?.id === value2?.id;
      });

      set(key, [...prevList, ...newList]);
    }

    setShouldLoad(false);
  }, [resData, height, map, searchStr]);

  let loading: boolean;

  if (shouldSearch) {
    loading = !resData && open && hasNextPage && shouldLoad && !!searchStr;
  } else {
    loading = !resData && open && hasNextPage && shouldLoad;
  }

  if (control && name && AutocompleteProps) {
    return (
      <Controller
        name={name}
        control={control}
        render={(props) => {
          const {
            field: { value, onChange },
            fieldState: { error },
          } = props;

          return (
            <Autocomplete
              fullWidth={true}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              options={map[searchStr] || []}
              loading={!!loading}
              disableCloseOnSelect={false}
              includeInputInList={true}
              filterSelectedOptions={true}
              noOptionsText="Không có dữ liệu"
              ListboxProps={{
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
              }}
              onInputChange={debounce((e) => {
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
              }, 300)}
              renderInput={(params) => {
                return (
                  <FormControl {...FormControlProps} id={params.id} error={!!error}>
                    <FormLabel children={label} {...FormLabelProps} />
                    <InputBase
                      placeholder={placeholder}
                      {...InputProps}
                      {...params.InputProps}
                      inputProps={params.inputProps}
                      endAdornment={
                        <Fragment>
                          {loading ? (
                            <CircularProgress size={20} sx={{ marginRight: 1 }} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      }
                      size={params.size}
                    />
                    <FormHelperText {...FormHelperTextProps} children={error?.message} />
                  </FormControl>
                );
              }}
              value={value as V | null | undefined}
              onChange={(_, value) => {
                onChange(value);
              }}
              loadingText={<CircularProgress size={20} />}
              {...AutocompleteProps}
            />
          );
        }}
      />
    );
  } else if (typeof selectedValue === "object") {
    return (
      <Autocomplete
        fullWidth={true}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        options={map[searchStr] || []}
        loading={!!loading}
        disableCloseOnSelect={false}
        includeInputInList={true}
        filterSelectedOptions={true}
        noOptionsText="Không có dữ liệu"
        ListboxProps={{
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
        }}
        onInputChange={debounce((e) => {
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
        }, 300)}
        renderInput={(params) => {
          return (
            <FormControl {...FormControlProps} id={params.id}>
              <FormLabel children={label} {...FormLabelProps} />
              <InputBase
                placeholder={placeholder}
                {...InputProps}
                {...params.InputProps}
                inputProps={params.inputProps}
                endAdornment={
                  <Fragment>
                    {loading ? (
                      <CircularProgress size={20} sx={{ marginRight: 1 }} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                }
                size={params.size}
              />
              <FormHelperText {...FormHelperTextProps} />
            </FormControl>
          );
        }}
        loadingText={<CircularProgress size={20} />}
        {...AutocompleteProps}
        value={selectedValue}
        onChange={(event, value, reason, details) => {
          setSelectedValue(value);

          AutocompleteProps?.onChange?.(event, value, reason, details);
        }}
      />
    );
  } else {
    return null;
  }
};
