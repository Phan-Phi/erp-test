import { useIntl } from "react-intl";
import React, { useState } from "react";

import { startOfYear, endOfYear, getTime, millisecondsToSeconds } from "date-fns";

import { Card, CardHeader, CardContent, Stack, Typography, Button } from "@mui/material";

import { Radio, RadioItem, DatePicker } from "components";

const DATA = [
  {
    value: "month",
    displayValue: "Theo tháng",
  },
  {
    value: "quarter",
    displayValue: "Theo quý",
  },
  {
    value: "year",
    displayValue: "Theo năm",
  },
];

type TValue = "month" | "quarter" | "year";

interface ViewTypeProps {
  value: string;
  onChange: (value: TValue) => void;
  onTimeFrameChange: (props: { date_start: number; date_end: number }) => void;
}

export const ViewTypeForFinance = (props: ViewTypeProps) => {
  const { value } = props;

  const { messages } = useIntl();

  const [selectedData, setSelectedDate] = useState<{
    date_start: Date | null;
    date_end: Date | null;
  }>({
    date_start: startOfYear(new Date()),
    date_end: endOfYear(new Date()),
  });

  return (
    <Card>
      <CardHeader title={"Xem theo"} />
      <CardContent
        sx={{
          paddingTop: "0 !important",
        }}
      >
        <Stack spacing={2}>
          <Radio
            renderItem={() => {
              return DATA.map((el) => {
                return (
                  <RadioItem
                    key={el.value}
                    label={el.displayValue}
                    RadioProps={{
                      value: el.value,
                    }}
                  />
                );
              });
            }}
            RadioGroupProps={{
              onChange: (e, value) => {
                props.onChange(value as TValue);
              },
              value,
            }}
          />

          <Typography fontWeight={700}>Thời gian</Typography>

          <Stack>
            <Typography variant="subtitle1">Từ ngày</Typography>
            <DatePicker
              DatePickerProps={{
                views: ["year"],
                inputFormat: "yyyy",
                maxDate: new Date(),
              }}
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate((prev) => {
                    return {
                      ...prev,
                      date_start: startOfYear(value),
                    };
                  });
                }
              }}
              value={selectedData.date_start}
            />
          </Stack>

          <Stack>
            <Typography variant="subtitle1">Đến ngày</Typography>
            <DatePicker
              DatePickerProps={{
                views: ["year"],
                inputFormat: "yyyy",
                maxDate: new Date(),
              }}
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate((prev) => {
                    return {
                      ...prev,
                      date_end: endOfYear(value),
                    };
                  });
                }
              }}
              value={selectedData.date_end}
            />
          </Stack>

          <Button
            children={messages["filter"]}
            disabled={selectedData.date_start == null || selectedData.date_end == null}
            onClick={() => {
              const { date_start, date_end } = selectedData;

              if (date_start && date_end) {
                props.onTimeFrameChange({
                  date_start: millisecondsToSeconds(getTime(date_start)),
                  date_end: millisecondsToSeconds(getTime(date_end)),
                });
              }
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
