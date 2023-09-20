import { object, array, date, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { validateDateEnd } from "./utils";
import { getChoiceValue } from "libs";

export interface ExportDebtRecordSchemaProps {
  date_start: Date | null;
  date_end: Date | null;
  field_options: [];
  type: string;
  file_ext: string;
  customer: object | null;
}

export const exportDebtRecordSchema = (choice: ChoiceType) => {
  const { export_file_types, export_file_extensions } = choice;

  return yupResolver(
    object().shape({
      date_start: date().nullable().required(),
      date_end: validateDateEnd("date_start").required(),
      field_options: array(object()),
      type: string().oneOf(getChoiceValue(export_file_types)),
      file_ext: string().oneOf(getChoiceValue(export_file_extensions)),
      customer: object().nullable().required(),
    })
  );
};

export const defaultExportDebtRecordFormState = (): ExportDebtRecordSchemaProps => {
  return {
    date_start: null,
    date_end: new Date(),
    type: "Debt_record",
    field_options: [],
    file_ext: ".xlsx",
    customer: null,
  };
};
