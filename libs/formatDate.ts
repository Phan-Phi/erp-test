import { parseISO, format } from "date-fns";

type Params = [date: number | Date | string, format?: string];

type FormatDateProps = (...args: Params) => string;

export const formatDate: FormatDateProps = (
  value: Params[0],
  formatOption = "dd/MM/yyyy - HH:mm:ss"
) => {
  if (value == undefined) {
    return value;
  }

  if (typeof value === "string") {
    value = parseISO(value);
  }

  return format(value, formatOption);
};
