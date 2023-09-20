import { string, object, boolean, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { validatePhoneNumber } from "./utils";
import { ChoiceType, ProvinceTuple, DistrictTuple, WardTuple } from "interfaces";

export interface CustomerAddressSchemaProps {
  id?: number;
  line1: string;
  line2: string;
  district: ProvinceTuple | null;
  ward: DistrictTuple | null;
  province: WardTuple | null;
  phone_number: string;
  notes: string;
  is_default_for_shipping: boolean;
  is_default_for_billing: boolean;
  country: "VN";
  user: string;
}

export const customerAddressSchema = (choice?: ChoiceType) => {
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
        is_default_for_shipping: boolean().required(),
        is_default_for_billing: boolean().required(),
        country: string().default("VN"),
        user: mixed(),
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
      is_default_for_shipping: boolean().required(),
      is_default_for_billing: boolean().required(),
      country: string().default("VN"),
      user: mixed(),
    })
  );
};

export const defaultCustomerAddressFormState = (
  choice?: ChoiceType
): CustomerAddressSchemaProps => {
  if (choice === undefined) {
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
