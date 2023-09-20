import { string, object, boolean, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { validatePhoneNumber } from "./utils";
import { ChoiceType, DistrictTuple, ProvinceTuple, WardTuple } from "interfaces";

export interface UserAddressSchemaProps {
  id?: number;
  line1: string;
  line2: string;
  district: DistrictTuple | null;
  ward: WardTuple | null;
  province: ProvinceTuple | null;
  phone_number: string;
  notes: string;
  is_default_for_shipping: boolean;
  is_default_for_billing: boolean;
  country: "VN";
  user: string;
}

export const userAddressSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        line1: string().required().trim(),
        line2: string().trim(),
        district: mixed().nullable(),
        ward: mixed().nullable(),
        province: mixed().nullable(),
        phone_number: validatePhoneNumber(),
        notes: string().trim(),
        is_default_for_shipping: boolean().default(false),
        is_default_for_billing: boolean().default(false),
        country: string().default("VN"),
        user: string(),
      })
    );
  }

  return yupResolver(
    object().shape({
      line1: string().required().trim(),
      line2: string().trim(),
      district: mixed().nullable(),
      ward: mixed().nullable(),
      province: mixed().nullable(),
      phone_number: validatePhoneNumber(),
      notes: string().trim(),
      is_default_for_shipping: boolean().default(false),
      is_default_for_billing: boolean().default(false),
      country: string().default("VN"),
      user: string(),
    })
  );
};

export const defaultUserAddressFormState = (
  choice?: ChoiceType
): UserAddressSchemaProps => {
  if (choice == undefined) {
    return {
      line1: "",
      line2: "",
      district: null,
      ward: null,
      province: null,
      phone_number: "",
      notes: "",
      is_default_for_shipping: false,
      is_default_for_billing: false,
      country: "VN",
      user: "",
    };
  }

  return {
    line1: "",
    line2: "",
    district: null,
    ward: null,
    province: null,
    phone_number: "",
    notes: "",
    is_default_for_shipping: false,
    is_default_for_billing: false,
    country: "VN",
    user: "",
  };
};
