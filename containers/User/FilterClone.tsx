import { useIntl } from "react-intl";
import { useState, useCallback } from "react";
import { Stack, Button, Box, Typography, MenuItem } from "@mui/material";

import { useChoice } from "hooks";
import { SearchField, FilterByTimeRange, Select } from "components";

type FilterProps = {
  onFilterHandler: (key: any) => (value: any) => void;
  data?: Record<string, string>;
  reset: () => void;
};

const FilterClone = ({ onFilterHandler, data, reset }: FilterProps) => {
  const { messages } = useIntl();

  const choice = useChoice();

  const [isReady, setIsReady] = useState(true);

  const [statusList] = useState([
    ["true", messages["active.true"] as string],
    ["false", messages["active.false"] as string],
  ]);

  const resetStateHandler = useCallback(() => {
    reset();

    setIsReady(false);

    setTimeout(() => {
      setIsReady(true);
    }, 300);
  }, [reset]);

  if (!isReady) {
    return null;
  }

  const { genders } = choice;

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={data?.["search"]}
        onChange={onFilterHandler("search")}
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterBirthday"]}
        </Typography>

        <FilterByTimeRange
          onChangeDateStart={onFilterHandler("birthday_start")}
          onChangeDateEnd={onFilterHandler("birthday_end")}
          initDateStart={data?.birthday_start || null}
          initDateEnd={data?.birthday_end || null}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterGender"]}
        </Typography>

        <Select
          {...{
            renderItem: () => {
              return genders.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: data?.["gender"] ?? "",
              onChange(event) {
                onFilterHandler("gender")(event.target.value || "");
              },
              placeholder: messages["filterGender"] as string,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterIsActive"]}
        </Typography>

        <Select
          {...{
            renderItem: () => {
              return statusList.map((el, idx) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: data?.["is_active"] ?? "",
              onChange(event) {
                onFilterHandler("is_active")(event.target.value || "");
              },
              placeholder: messages["filterIsActive"] as string,
            },
          }}
        />
      </Box>

      <Button color="error" variant="contained" onClick={resetStateHandler}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default FilterClone;
