import { ChoiceItem } from "interfaces";

export const getDisplayValueFromChoiceItem = (
  data: ChoiceItem[],
  value: string
): string | undefined => {
  const tupleValue = data.find((el) => {
    return el[0] === value;
  });

  if (tupleValue) {
    const [, displayValue] = tupleValue;

    return displayValue;
  } else {
    return undefined;
  }
};
