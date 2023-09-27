import { useIntl } from "react-intl";
import { useState, useCallback } from "react";
import { Stack, Button, Box, Typography, MenuItem } from "@mui/material";

import { useChoice } from "hooks";
import { SearchField, FilterByTimeRange, Select, DateRangePicker } from "components";

type FilterProps = {
  onGender: (value: unknown) => void;
  onIsActive: (value: unknown) => void;
  onSearch: (value: string | undefined) => void;
  filter: any;
  resetFilter: (value: unknown) => void;
  onFilterByTime: any;
  onDateRangeChange: any;
};

const Filter = ({
  filter,
  onGender,
  onIsActive,
  resetFilter,
  onFilterByTime,
  onDateRangeChange,
  onSearch,
}: FilterProps) => {
  const { messages } = useIntl();

  const choice = useChoice();

  const [isReady, setIsReady] = useState(true);

  const [statusList] = useState([
    ["true", messages["active.true"] as string],
    ["false", messages["active.false"] as string],
  ]);

  if (!isReady) {
    return null;
  }

  const { genders } = choice;

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={(value) => {
          onSearch(value);
        }}
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterBirthday"]}
        </Typography>

        <DateRangePicker
          ranges={[filter.range]}
          onChange={(ranges) => {
            const range = ranges.range;
            range && onDateRangeChange && onDateRangeChange(range);
          }}
          onFilterByTime={onFilterByTime}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterGender"]}
        </Typography>

        <Select
          renderItem={() => {
            return genders.map((el) => {
              return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
            });
          }}
          SelectProps={{
            onChange: (e) => {
              onGender(e.target.value);
            },
            value: filter.gender,
            placeholder: messages["filterGender"] as string,
          }}
        />

        {/* <Select
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
        /> */}
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterIsActive"]}
        </Typography>

        <Select
          renderItem={() => {
            return statusList.map((el) => {
              return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
            });
          }}
          SelectProps={{
            onChange: (e) => {
              onIsActive(e.target.value);
            },
            value: filter.is_active,
            placeholder: messages["filterIsActive"] as string,
          }}
        />
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
