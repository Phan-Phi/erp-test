import React, { useMemo, useRef } from "react";
import { Box, Button, Popover, Stack, styled, useTheme } from "@mui/material";

import {
  Range,
  defaultInputRanges,
  defaultStaticRanges,
  DateRangePickerProps,
  DateRangePicker as OriginalDateRangePicker,
} from "react-date-range";

import { useToggle } from "hooks";
import { formatDate } from "libs";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { InputBase } from "components/Input/InputBase";
import { endOfYear, isSameDay, startOfYear, startOfWeek, endOfWeek } from "date-fns";

const DateRangePicker = (
  props: DateRangePickerProps & {
    onFilterByTime?: () => void;
  }
) => {
  const theme = useTheme();

  const { ranges, onFilterByTime, ...restProps } = props;

  const anchorRef = useRef<HTMLDivElement>();

  const { open, onOpen, onClose } = useToggle();

  const newDefaultStaticRanges = useMemo(() => {
    const newLabel: Record<string, string> = {
      Today: "Hôm nay",
      Yesterday: "Hôm qua",
      "This Week": "Tuần này",
      "Last Week": "Tuần trước",
      "This Month": "Tháng này",
      "Last Month": "Tháng trước",
    };

    const result = defaultStaticRanges.map((el) => {
      const oldLabel = el.label;

      return {
        ...el,
        label: oldLabel ? newLabel[oldLabel] : oldLabel,
      };
    });

    result[2].range = () => ({
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });

    return result;
  }, []);

  const newDefaultInputRanges = useMemo(() => {
    const newLabel: Record<string, string> = {
      "days up to today": "Số ngày tính đến hôm nay",
      "days starting today": "Số ngày tính từ hôm nay",
    };

    return defaultInputRanges.map((el) => {
      const oldLabel = el.label;
      return {
        ...el,
        label: oldLabel ? newLabel[oldLabel] : oldLabel,
      };
    });
  }, []);

  return (
    <Stack spacing={1}>
      <Box onClick={onOpen}>
        <StyledInputBase fullWidth value={formatDateRange(ranges?.[0])} />
      </Box>

      <Box ref={anchorRef} />
      <Popover
        open={open}
        onClose={onClose}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <OriginalDateRangePicker
          months={2}
          direction="horizontal"
          maxDate={new Date()}
          dateDisplayFormat="dd/MM/yyyy"
          fixedHeight
          ranges={ranges}
          rangeColors={[theme.palette.primary2.light, "#3ecf8e", "#fed14c"]}
          staticRanges={[
            ...newDefaultStaticRanges,
            {
              label: "Năm nay",
              range: () => ({
                startDate: startOfYear(new Date()),
                endDate: endOfYear(new Date()),
              }),
              isSelected(range: any) {
                const definedRange: any = this.range();
                return (
                  isSameDay(range.startDate, definedRange.startDate) &&
                  isSameDay(range.endDate, definedRange.endDate)
                );
              },
            },
          ]}
          inputRanges={newDefaultInputRanges}
          monthDisplayFormat="MM/yyyy"
          startDatePlaceholder="Từ Ngày"
          endDatePlaceholder="Đến Ngày"
          {...restProps}
        />
      </Popover>

      <Button
        fullWidth
        variant="outlined"
        disabled={!ranges?.[0]?.startDate}
        onClick={onFilterByTime}
      >
        Lọc
      </Button>
    </Stack>
  );
};

const formatDateRange = (range?: Range) => {
  if (range == undefined) return "";

  const { endDate, startDate } = range;

  let startDateStr = "Từ ngày";
  let endDateStr = "Đến ngày";

  if (startDate) {
    startDateStr = formatDate(startDate, "dd/MM/yyyy");
  }

  if (endDate) {
    endDateStr = formatDate(endDate, "dd/MM/yyyy");
  }

  return `${startDateStr} → ${endDateStr}`;
};

const StyledInputBase = styled(InputBase)(() => {
  return {
    pointerEvents: "none",
  };
});

export default DateRangePicker;
