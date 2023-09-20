import React, { useState } from "react";
import {
  differenceInDays,
  endOfDay,
  millisecondsToSeconds,
  startOfDay,
  addMilliseconds,
  subMilliseconds,
} from "date-fns";

import { useIntl } from "react-intl";

import {
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  Stack,
  Typography,
  Button,
} from "@mui/material";

import { Select, DatePicker } from "components";

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
    value: "this_week",
    displayValue: "Tuần này",
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

const VALID_VALUE_LIST = [
  "today",
  "yesterday",
  "this_week",
  "last_seven_days",
  "this_month",
  "last_month",
];

import { ConvertTimeFrameType } from "libs/dateUtils";

interface DisplayCardProps {
  value: ConvertTimeFrameType;
  onChange: (value: ConvertTimeFrameType) => void;
  onTimeFrameChange: (props: {
    date_start: number;
    date_end: number;
    period: number;
  }) => void;
}

export const TimeFrame = (props: DisplayCardProps) => {
  const { messages } = useIntl();

  const { value } = props;

  const [selectedData, setSelectedDate] = useState<{
    date_start: number | null;
    date_end: number | null;
  }>({
    date_start: null,
    date_end: null,
  });

  return (
    <Card>
      <CardHeader title={"Thời gian"} />
      <CardContent
        sx={{
          paddingTop: "0 !important",
        }}
      >
        <Stack spacing={3}>
          <Select
            renderItem={() => {
              return DATA.map((el) => {
                return (
                  <MenuItem value={el.value} key={el.value} children={el.displayValue} />
                );
              });
            }}
            SelectProps={{
              value: VALID_VALUE_LIST.includes(value) ? value : "",
              onChange: (e) => {
                props.onChange(e.target.value as ConvertTimeFrameType);

                setSelectedDate({
                  date_start: null,
                  date_end: null,
                });
              },
            }}
          />

          <Stack spacing={2}>
            <Typography fontWeight={700}>Lựa chọn khác</Typography>

            <Stack>
              <Typography variant="subtitle1">Từ ngày</Typography>
              <DatePicker
                value={selectedData.date_start}
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate((prev) => {
                      return {
                        ...prev,
                        date_start: startOfDay(value).getTime(),
                      };
                    });
                  }
                }}
                DatePickerProps={{
                  maxDate: Date.now(),
                }}
              />
            </Stack>

            <Stack>
              <Typography variant="subtitle1">Đến ngày</Typography>
              <DatePicker
                value={selectedData.date_end}
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate((prev) => {
                      return {
                        ...prev,
                        date_end: endOfDay(value).getTime(),
                      };
                    });
                  }
                }}
                DatePickerProps={{
                  maxDate: Date.now(),
                }}
              />
            </Stack>

            <Button
              children={messages["filter"]}
              disabled={selectedData.date_start == null || selectedData.date_end == null}
              onClick={() => {
                const { date_start, date_end } = selectedData;

                if (date_start && date_end) {
                  const value = differenceInDays(date_end, date_start);

                  if (value > 31) {
                    props.onTimeFrameChange({
                      date_start: millisecondsToSeconds(date_start),
                      date_end: millisecondsToSeconds(
                        addMilliseconds(date_end, 1).getTime()
                      ),
                      period: 3600 * 24 * 31,
                    });
                  } else {
                    props.onTimeFrameChange({
                      date_start: millisecondsToSeconds(date_start),
                      date_end: millisecondsToSeconds(
                        addMilliseconds(date_end, 1).getTime()
                      ),
                      period: 3600 * 24,
                    });
                  }
                }
              }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
