import { useState } from "react";

import { useUpdateEffect } from "react-use";

import { useIntl } from "react-intl";

import viLocale from "date-fns/locale/vi";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TextField, Stack, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import {
  isValid,
  compareAsc,
  startOfDay,
  endOfDay,
  millisecondsToSeconds,
} from "date-fns";

const transformedData = (data) => {
  const transformedInitState = {};

  for (const key of Object.keys(data)) {
    if (data[key] === "" || data[key] == null) {
      transformedInitState[key] = null;
      continue;
    }

    transformedInitState[key] = new Date(Number(data[key]) * 1000).getTime();
  }

  return transformedInitState;
};

const DateRangeFilter = ({
  passHandler = () => {},
  initState,
  date_start_label = "Ngày Bắt Đầu",
  date_end_label = "Ngày Kết Thúc",
  prefix = "date",
}) => {
  const { messages } = useIntl();

  const [error, setError] = useState({
    date_start: false,
    date_end: false,
  });
  const [dateRange, setDateRange] = useState(() => {
    return transformedData(initState);
  });

  useUpdateEffect(() => {
    setDateRange(transformedData(initState));
  }, [initState]);

  return (
    <Stack spacing={3}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
        <DatePicker
          label={date_start_label}
          value={dateRange[`${prefix}_start`] || null}
          error={error[`${prefix}_start`]}
          onChange={(newValue) => {
            if (newValue === null) {
              setDateRange((prev) => {
                return {
                  ...prev,
                  [`${prefix}_start`]: null,
                };
              });

              setError((prev) => {
                return {
                  ...prev,
                  [`${prefix}_start`]: false,
                };
              });

              return;
            }

            if (isValid(newValue)) {
              setDateRange((prev) => {
                return {
                  ...prev,
                  [`${prefix}_start`]: newValue,
                };
              });
              setError((prev) => {
                return {
                  ...prev,
                  [`${prefix}_start`]: false,
                };
              });
            } else {
              setError((prev) => {
                return {
                  ...prev,
                  [`${prefix}_start`]: true,
                };
              });
            }
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                fullWidth
                InputLabelProps={{
                  ...params.InputLabelProps,
                  sx: {
                    fontSize: "14px",
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    paddingLeft: 0,
                    fontSize: "14px",
                  },
                }}
                variant="standard"
              />
            );
          }}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
        <DatePicker
          label={date_end_label}
          value={dateRange[`${prefix}_end`] || null}
          error={error[`${prefix}_end`]}
          minDate={dateRange[`${prefix}_start`]}
          onChange={(newValue) => {
            if (newValue === null) {
              setDateRange((prev) => {
                return {
                  ...prev,
                  [`${prefix}_end`]: null,
                };
              });

              setError((prev) => {
                return {
                  ...prev,
                  [`${prefix}_end`]: false,
                };
              });

              return;
            }

            if (isValid(newValue)) {
              setDateRange((prev) => {
                return {
                  ...prev,
                  [`${prefix}_end`]: newValue,
                };
              });
              setError((prev) => {
                return {
                  ...prev,
                  [`${prefix}_end`]: false,
                };
              });
            } else {
              setError((prev) => {
                return {
                  ...prev,
                  [`${prefix}_end`]: true,
                };
              });
            }
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                fullWidth
                InputLabelProps={{
                  ...params.InputLabelProps,
                  sx: {
                    fontSize: "14px",
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    paddingLeft: 0,
                    fontSize: "14px",
                  },
                }}
                variant="standard"
              />
            );
          }}
        />
      </LocalizationProvider>
      <Button
        variant="contained"
        disabled={
          error.date_start ||
          error.date_end ||
          compareAsc(dateRange[`${prefix}_end`], dateRange[`${prefix}_start`]) === -1
        }
        onClick={() => {
          let date_start;
          let date_end;

          if (isValid(dateRange[`${prefix}_start`])) {
            date_start = millisecondsToSeconds(
              startOfDay(dateRange[[`${prefix}_start`]])
            );
          } else {
            date_start = null;
          }

          if (isValid(dateRange[`${prefix}_end`])) {
            date_end = millisecondsToSeconds(endOfDay(dateRange[`${prefix}_end`]));
          } else {
            date_end = null;
          }

          passHandler({
            [`${prefix}_start`]: date_start,
            [`${prefix}_end`]: date_end,
          });
        }}
      >
        {messages["filter"]}
      </Button>
    </Stack>
  );
};

export default DateRangeFilter;
