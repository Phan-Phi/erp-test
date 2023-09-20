import {
  millisecondsToSeconds,
  secondsToMilliseconds,
  differenceInDays,
  startOfYesterday,
  addMilliseconds,
  endOfYesterday,
  startOfMonth,
  startOfWeek,
  endOfToday,
  endOfWeek,
  startOfDay,
  endOfMonth,
  parseISO,
  endOfDay,
  getTime,
  subDays,
  getDay,
  format,
} from "date-fns";

export type ConvertTimeFrameType =
  | "today"
  | "yesterday"
  | "this_month"
  | "last_seven_days"
  | "last_month"
  | "this_week"
  | "month"
  | "";

export const getUnitFromTimeFrame = (
  type: ConvertTimeFrameType
): ConvertPeriodTimeType => {
  let value: ConvertPeriodTimeType = "day";

  switch (type) {
    case "today":
      value = "hour";
      break;
    case "yesterday":
      value = "hour";
      break;
    case "this_month":
      value = "day";
      break;
    case "last_month":
      value = "day";
      break;
    case "last_seven_days":
      value = "day";
      break;
    case "this_week":
      value = "day";
      break;
    case "month":
      value = "month";
      break;
  }

  return value;
};

export const convertTimeFrame = (type: ConvertTimeFrameType) => {
  const currentYear = new Date().getFullYear();
  let lastYear: number;
  const currentMonth = new Date().getMonth();

  let lastMonth: number;

  if (currentMonth === 0) {
    lastMonth = 11;
    lastYear = currentYear - 1;
  } else {
    lastMonth = currentMonth - 1;
    lastYear = currentYear;
  }

  let dateStart: number = 0;
  let dateEnd: number = 0;

  switch (type) {
    case "today":
      dateStart = millisecondsToSeconds(getTime(startOfDay(Date.now())));

      dateEnd = millisecondsToSeconds(getTime(addMilliseconds(endOfDay(Date.now()), 1)));
      break;
    case "yesterday":
      dateStart = millisecondsToSeconds(getTime(startOfYesterday()));
      dateEnd = millisecondsToSeconds(getTime(addMilliseconds(endOfYesterday(), 1)));
      break;
    case "this_month":
      dateStart = millisecondsToSeconds(getTime(startOfMonth(new Date())));
      dateEnd = millisecondsToSeconds(
        getTime(addMilliseconds(endOfMonth(new Date()), 1))
      );
      break;
    case "last_seven_days":
      dateStart = millisecondsToSeconds(getTime(startOfDay(subDays(Date.now(), 6))));
      dateEnd = millisecondsToSeconds(getTime(addMilliseconds(endOfToday(), 1)));
      break;
    case "last_month":
      dateStart = millisecondsToSeconds(
        getTime(startOfMonth(new Date(lastYear, lastMonth, 1, 0, 0, 0)))
      );
      dateEnd = millisecondsToSeconds(
        getTime(addMilliseconds(endOfMonth(new Date(lastYear, lastMonth, 1, 0, 0, 0)), 1))
      );
      break;
    case "this_week":
      dateStart = millisecondsToSeconds(
        getTime(
          startOfWeek(Date.now(), {
            weekStartsOn: 1,
          })
        )
      );

      dateEnd = millisecondsToSeconds(
        getTime(
          addMilliseconds(
            endOfWeek(Date.now(), {
              weekStartsOn: 1,
            }),
            1
          )
        )
      );
      break;
  }

  return {
    date_start: dateStart,
    date_end: dateEnd,
  };
};

export type ConvertPeriodTimeType =
  | "hour"
  | "day"
  | "month"
  | "week"
  | "quarter"
  | "year";

export const convertUnitToPeriodTime = (type: ConvertPeriodTimeType) => {
  let value = 60 * 60;

  switch (type) {
    case "hour":
      value = 60 * 60;
      break;
    case "day":
      value = 60 * 60 * 24;
      break;
    case "week":
      value = 60 * 60 * 24;
      break;
    case "month":
      value = 60 * 60 * 24 * 31;
      break;
    case "quarter":
      value = 60 * 60 * 24 * 31 * 3;
      break;
    case "year":
      value = 60 * 60 * 24 * 365;
      break;
  }

  return value;
};

export const getPeriodFromTimeFrame = (type: ConvertTimeFrameType) => {
  let value = 60 * 60;

  switch (type) {
    case "today":
      value = 60 * 60;
      break;
    case "yesterday":
      value = 60 * 60;
      break;
    case "this_week":
      value = 60 * 60 * 24;
      break;
    case "last_seven_days":
      value = 60 * 60 * 24;
      break;
    case "last_month":
      value = 60 * 60 * 24;
      break;
    case "this_month":
      value = 60 * 60 * 24;
      break;
    case "month":
      value = 60 * 60 * 24 * 31;
      break;
  }

  return value;
};

export const convertTimeToString = (type: ConvertPeriodTimeType, rawValue: string) => {
  let value = parseISO(rawValue);

  let result: string = "";

  switch (type) {
    case "day":
      result = format(value, "dd/MM");
      break;
    case "hour":
      result = format(value, "HH:mm");
      break;
    case "week":
      result = getDay(value).toString();
      break;
    case "month":
      result = format(value, "MM/yyyy");
      break;
    case "quarter":
      result = format(value, "QQQ/yyyy");
      break;
    case "year":
      result = format(value, "yyyy");
      break;
  }

  return result;
};

export const convertWeekOfDays = (type: string) => {
  let value: undefined | { id: string; defaultMessage: string };

  switch (type) {
    case "0":
      value = { id: "sunday", defaultMessage: "Chủ nhật" };
      break;
    case "1":
      value = { id: "monday", defaultMessage: "Thứ hai" };

      break;
    case "2":
      value = { id: "tuesday", defaultMessage: "Thứ ba" };

      break;
    case "3":
      value = { id: "wednesday", defaultMessage: "Thứ tư" };

      break;
    case "4":
      value = { id: "thursday", defaultMessage: "Thứ năm" };

      break;
    case "5":
      value = { id: "friday", defaultMessage: "Thứ sáu" };

      break;
    case "6":
      value = { id: "saturday", defaultMessage: "Thứ bảy" };
      break;
  }

  return value;
};

export const convertChartNum = (
  timeFrame: ConvertTimeFrameType,
  type: ConvertPeriodTimeType
) => {
  if (type === "day") {
    const date = convertTimeFrame(timeFrame);
    const dateStart = date.date_start * 1000;
    const dateEnd = date.date_end * 1000;
    return differenceInDays(dateEnd, dateStart) + 1 || 1;
  } else if (type === "hour") {
    return 24;
  } else if (type === "week") {
    return 7;
  }
};

export const getPeriodFromTimeObj = ({
  date_start,
  date_end,
}: {
  date_start: number | null;
  date_end: number | null;
}) => {
  if (date_start == null || date_end == null) {
    return 3600;
  }

  const dateStartByMilliseconds = secondsToMilliseconds(date_start);
  const dateEndByMilliseconds = secondsToMilliseconds(date_end);

  const distance = differenceInDays(dateEndByMilliseconds, dateStartByMilliseconds);

  if (distance <= 1) {
    return 3600;
  } else if (distance <= 7) {
    return 3600 * 24;
  } else if (distance <= 31) {
    return 3600 * 24;
  } else {
    return 1;
  }
};

export const getPeriodUnitFromTimeObj = ({
  date_start,
  date_end,
}: {
  date_start: number | null;
  date_end: number | null;
}) => {
  if (date_start == null || date_end == null) {
    return "Second";
  }

  const dateStartByMilliseconds = secondsToMilliseconds(date_start);
  const dateEndByMilliseconds = secondsToMilliseconds(date_end);

  const distance = differenceInDays(dateEndByMilliseconds, dateStartByMilliseconds);

  if (distance > 31) {
    return "Month";
  } else {
    return "Second";
  }
};

export const getDifferenceInDays = ({
  date_start,
  date_end,
}: {
  date_start: number | null;
  date_end: number | null;
}) => {
  if (date_start == null || date_end == null) {
    return "day";
  }

  const dateStartByMilliseconds = secondsToMilliseconds(date_start);
  const dateEndByMilliseconds = secondsToMilliseconds(date_end);

  return differenceInDays(dateEndByMilliseconds, dateStartByMilliseconds);
};
