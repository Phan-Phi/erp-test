import { ChoiceItem } from "interfaces";

export const getChoiceValue = (data: ChoiceItem[]): string[] => {
  return data.map((el) => {
    return el[0];
  });
};
