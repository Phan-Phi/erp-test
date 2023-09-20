import React from "react";

import { MenuItem } from "@mui/material";

import { Select } from "components";

const DATA = [
  {
    value: "today",
    displayValue: "Hôm nay",
  },
  {
    value: "yesterday",
    displayValue: "Hôm qua",
  },
  {
    value: "last_seven_days",
    displayValue: "7 ngày qua",
  },
  {
    value: "this_month",
    displayValue: "Tháng này",
  },
  {
    value: "last_month",
    displayValue: "Tháng trước",
  },
];

interface TimeFrameFilterProps {
  onChange: (value: any) => void;
}

const TimeFrameFilter = ({ onChange }: TimeFrameFilterProps) => {
  return (
    <Select
      {...{
        renderItem: () => {
          return DATA.map((el) => {
            return (
              <MenuItem key={el.value} value={el.value}>
                {el.displayValue}
              </MenuItem>
            );
          });
        },
        SelectProps: {
          defaultValue: "this_month",
          autoWidth: true,
          onChange: (e) => {
            onChange(e.target.value);
          },
        },
        FormControlProps: {
          sx: {
            width: 200,
          },
        },
      }}
    />
  );
};

export default TimeFrameFilter;
