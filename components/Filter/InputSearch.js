import { useState, useCallback } from "react";
import { useDebounce, useUpdateEffect } from "react-use";
import { TextField } from "@mui/material";

const InputSearch = ({ passHandler = () => {}, initSearch = "", gotoPage, ...props }) => {
  const [search, setSearch] = useState(initSearch);

  useUpdateEffect(() => {
    setSearch(initSearch);
  }, [initSearch]);

  useDebounce(
    () => {
      passHandler({
        search,
      });
      typeof gotoPage === "function" && gotoPage(0);
    },
    500,
    [search]
  );

  const onChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);
  }, []);

  return (
    <TextField
      {...{
        ...props,
        value: search,
        variant: "standard",
        onChange,
        InputLabelProps: {
          sx: {
            fontSize: "14px",
          },
        },
        InputProps: {
          sx: {
            fontSize: "14px",
            paddingLeft: 0,
          },
        },
      }}
    />
  );
};

export default InputSearch;
