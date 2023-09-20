import { useIntl } from "react-intl";
import { useUpdateEffect } from "react-use";
import React, { Fragment, useCallback, useState } from "react";
import { Stack, styled, Typography, Button } from "@mui/material";

import {
  startOfDay,
  endOfDay,
  millisecondsToSeconds,
  secondsToMilliseconds,
  addMilliseconds,
  subMilliseconds,
} from "date-fns";

import { DatePicker } from "components/Input/DatePicker";

type FilterByTimeRangeProps = {
  initDateStart?: unknown;
  initDateEnd?: unknown;
  onChangeDateStart?: (value: unknown) => void;
  onChangeDateEnd?: (value: unknown) => void;
  DatePickerPropsForStart?: React.ComponentPropsWithoutRef<
    typeof DatePicker
  >["DatePickerProps"];
  DatePickerPropsForEnd?: React.ComponentPropsWithoutRef<
    typeof DatePicker
  >["DatePickerProps"];
};

const convertDateFromSecondsToMilliseconds = (value: unknown): number | null => {
  let parsedValue: number | null = null;

  if (typeof value === "string") {
    parsedValue = secondsToMilliseconds(parseInt(value));
  } else if (typeof value === "number") {
    parsedValue = secondsToMilliseconds(value);
  }

  return parsedValue;
};

const FilterByTimeRange = (props: FilterByTimeRangeProps) => {
  const {
    initDateStart = null,
    initDateEnd = null,
    onChangeDateStart,
    onChangeDateEnd,
    DatePickerPropsForStart,
    DatePickerPropsForEnd,
  } = props;

  const { messages } = useIntl();

  const [dateStart, setDateStart] = useState<number | null>(
    convertDateFromSecondsToMilliseconds(initDateStart)
  );
  const [dateEnd, setDateEnd] = useState<number | null>(
    convertDateFromSecondsToMilliseconds(initDateEnd)
  );

  useUpdateEffect(() => {
    if (initDateStart == null) {
      setDateStart(null);
      return;
    }

    setDateStart(convertDateFromSecondsToMilliseconds(initDateStart));
  }, [initDateStart]);

  useUpdateEffect(() => {
    if (initDateEnd == null) {
      setDateEnd(null);
      return;
    }

    const dateEnd = convertDateFromSecondsToMilliseconds(initDateEnd);

    if (dateEnd) {
      setDateEnd(subMilliseconds(dateEnd, 1).getTime());
    } else {
      setDateEnd(dateEnd);
    }
  }, [initDateEnd]);

  const onFilterHandler = useCallback(
    (dateStart: number | null, dateEnd: number | null) => {
      return () => {
        if (dateStart) {
          onChangeDateStart?.(millisecondsToSeconds(dateStart));
        } else if (dateStart == null) {
          onChangeDateStart?.(dateStart);
        }

        if (dateEnd) {
          onChangeDateEnd?.(millisecondsToSeconds(addMilliseconds(dateEnd, 1).getTime()));
        } else if (dateEnd == null) {
          onChangeDateEnd?.(dateEnd);
        }
      };
    },
    []
  );

  return (
    <Fragment>
      <Stack spacing={2}>
        <StyledCardItem>
          <StyledTypography variant="subtitle1">Từ ngày</StyledTypography>
          <DatePicker
            value={dateStart}
            onChange={(value) => {
              if (value instanceof Date) {
                setDateStart(startOfDay(value).getTime());
              }
            }}
            DatePickerProps={{
              maxDate: Date.now(),
              ...DatePickerPropsForStart,
            }}
          />
        </StyledCardItem>

        <StyledCardItem>
          <StyledTypography variant="subtitle1">Đến ngày</StyledTypography>
          <DatePicker
            value={dateEnd}
            onChange={(value) => {
              if (value instanceof Date) {
                setDateEnd(endOfDay(value).getTime());
              }
            }}
            DatePickerProps={{
              minDate: dateStart,
              maxDate: Date.now(),
              ...DatePickerPropsForEnd,
            }}
          />
        </StyledCardItem>

        <Button
          children={messages["filter"]}
          onClick={onFilterHandler(dateStart, dateEnd)}
        />
      </Stack>
    </Fragment>
  );
};

const StyledTypography = styled(Typography)({
  width: 90,
});

const StyledCardItem = styled(Stack)({});

export default FilterByTimeRange;
