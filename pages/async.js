import { useState, useEffect, Fragment, useRef, forwardRef } from "react";
import useSWR from "swr";
import queryString from "query-string";
import { useMap } from "react-use";

import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import get from "lodash/get";
import differenceWith from "lodash/differenceWith";

import { Box, TextField, CircularProgress, Autocomplete, Typography, Popper } from "@mui/material";


// update Vercel

const URL = process.env.NEXT_PUBLIC_USER_URL;

const AsyncPage = () => {
  const [map, { set }] = useMap({
    "": [],
  });
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [open, setOpen] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(true);
  const [height, setHeight] = useState(0);
  const boxRef = useRef(null);
  const [searchStr, setSearchStr] = useState("");

  const { data: resData } = useSWR(() => {
    const params = {
      page,
      page_size: 20,
      ...(searchStr && {
        is_not_customer: true,
        search: searchStr,
      }),
    };

    const stringifyParmas = queryString.stringify(params);

    if (open && hasNextPage && shouldLoad && searchStr) {
      return `${URL}?${stringifyParmas}`;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (!resData) {
      return;
    }

    const results = get(resData, "data.results");
    const nextPage = get(resData, "data.next");

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

      // const boxEl = get(boxRef, "current");

      // if (boxEl) {
      //   boxEl.scroll({
      //     top: height,
      //     behavior: "smooth",
      //   });
      // }
    }

    setShouldLoad(false);
  }, [resData, height, map, searchStr]);

  const loading = !resData && open && hasNextPage && shouldLoad && searchStr;

  return (
    <Box>
      <Autocomplete
        {...{
          sx: {
            width: "500px",
          },
          fullWidth: true,
          onOpen: () => {
            setOpen(true);
          },
          onClose: () => {
            setOpen(false);
          },
          loading: Boolean(loading),
          getOptionLabel: (option) => {
            return option.email || "";
          },
          isOptionEqualToValue: (option, value) => {
            const id = get(value, "id");

            if (id) {
              return option.id === value.id;
            } else {
              return true;
            }
          },
          renderOption: (props, option) => {
            return (
              <Typography {...props} key={option.id}>
                {option.email}
              </Typography>
            );
          },
          renderInput: (params) => {
            return (
              <TextField
                {...params}
                label="User"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {loading ? <CircularProgress color="inherit" size={24} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
              />
            );
          },
          options: map[searchStr] || [],
          ListboxProps: {
            ref: boxRef,
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
          includeInputInList: true,
          filterSelectedOptions: true,
        }}
      />
    </Box>
  );
};

export default AsyncPage;
