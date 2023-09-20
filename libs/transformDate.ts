import { getTime, millisecondsToSeconds, endOfDay } from "date-fns";

export function transformDate(
  date: Date | null | undefined,
  type: "date_start" | "date_end"
): number {
  const today = new Date();

  if (type === "date_end") {
    return millisecondsToSeconds(getTime(endOfDay(date || today)));
  }

  return millisecondsToSeconds(getTime(date || today));
}
