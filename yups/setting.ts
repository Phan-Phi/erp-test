import { string, object, mixed, array } from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

export interface SettingSchemaProps {
  currency: string;
  logo: { file: File | string }[];
  line1: string;
  line2: string;
  ward: object;
  district: object | string;
  province: object | string;
  country: object | string;
  postcode: string;
  company_name: string;
  store_name: string;
  store_description: string;
  store_website: string;
  hotline_1: string;
  hotline_2: string;
  tax_identification_number: string;
  weight_unit: string;
  invoice_qr_code: { file: File | string }[];
  invoice_notes: string;
  bank_account_info: string;
}

export const settingSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        logo: array(mixed()),
        line1: string().trim().required().max(256),
        line2: string().trim().max(256),
        district: mixed().nullable(),
        ward: mixed().nullable(),
        province: mixed().nullable(),
        country: string(),
        company_name: string(),
        store_name: string(),
        store_description: string(),
        store_website: string().url(),
        hotline_1: string(),
        hotline_2: string(),
        tax_identification_number: string().max(20),
        currency: string().required(),
        weight_unit: string(),
        invoice_qr_code: array(mixed()),
        invoice_notes: string(),
        bank_account_info: string(),
      })
    );
  }

  return yupResolver(
    object().shape({
      logo: array(mixed()),
      line1: string().trim().required().max(256),
      line2: string().trim().max(256),
      district: mixed().nullable(),
      ward: mixed().nullable(),
      province: mixed().nullable(),
      country: string(),
      company_name: string(),
      store_name: string(),
      store_description: string(),
      store_website: string().url(),
      hotline_1: string(),
      hotline_2: string(),
      tax_identification_number: string().max(20),
      currency: string().required(),
      weight_unit: string(),
      invoice_qr_code: array(mixed()),
      invoice_notes: string(),
      bank_account_info: string(),
    })
  );
};

export const defaultSettingFormState = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return {
      logo: [],
      line1: "",
      line2: "",
      ward: null,
      district: null,
      province: null,
      country: "VN",
      company_name: "",
      store_name: "",
      store_description: "",
      store_website: "",
      hotline_1: "",
      hotline_2: "",
      tax_identification_number: "",
      currency: "VND",
      weight_unit: "KG",
      invoice_qr_code: [],
      invoice_notes: "",
      bank_account_info: "",
    };
  }

  return {
    logo: [],
    line1: "",
    line2: "",
    ward: null,
    district: null,
    province: null,
    country: "VN",
    company_name: "",
    store_name: "",
    store_description: "",
    store_website: "",
    hotline_1: "",
    hotline_2: "",
    tax_identification_number: "",
    currency: "VND",
    weight_unit: "KG",
    invoice_qr_code: [],
    invoice_notes: "",
    bank_account_info: "",
  };
};
