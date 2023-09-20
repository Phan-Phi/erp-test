import { useIntl } from "react-intl";
import { useDebounce, useUpdateEffect } from "react-use";
import { InputProps, Stack, styled } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useCallback, ChangeEventHandler, useRef, useState } from "react";

import { InputBase } from "components";

type SearchFieldProps = {
  initSearch?: string;
  InputProps?: InputProps;
  isShowIcon?: boolean;
  onChange?: (searchText: string | undefined) => void;
  placeholder?: string;
};

const SearchField = (props: SearchFieldProps) => {
  const { messages } = useIntl();

  const {
    InputProps,
    onChange,
    initSearch = undefined,
    isShowIcon = true,
    placeholder = messages["search"] as string,
  } = props;

  const isFirstRun = useRef(true);

  const [searchText, setSearchText] = useState<string | undefined>(initSearch);

  useDebounce(
    () => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }

      onChange?.(searchText);
    },
    500,
    [searchText]
  );

  useUpdateEffect(() => {
    setSearchText(initSearch);
  }, [initSearch]);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  return (
    <Stack flexDirection="row" alignItems="center" columnGap={1.5} width="100%">
      {isShowIcon && <SearchOutlinedIcon />}
      <StyledInput
        placeholder={placeholder}
        value={searchText || ""}
        onChange={onChangeHandler}
        {...InputProps}
      />
    </Stack>
  );
};

const StyledInput = styled(InputBase)({
  flexGrow: 1,
});

export default SearchField;
