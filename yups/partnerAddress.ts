import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { validatePhoneNumber } from "./utils";
import { ChoiceItem, ChoiceType } from "interfaces";

export interface PartnerAddressSchemaProps {
  id?: number;
  line1: string;
  line2: string;
  phone_number: string;
  district: ChoiceItem | null;
  ward: ChoiceItem | null;
  province: ChoiceItem | null;
  postcode?: string;
  country: string;
}

export const partnerAddressSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        line1: string().required().trim().max(255),
        line2: string().trim(),
        district: mixed().nullable(),
        ward: mixed().nullable(),
        province: mixed().nullable(),
        country: string().nullable(),
        partner: string(),
        phone_number: validatePhoneNumber(),
      })
    );
  }

  return yupResolver(object().shape({}));
};

export const defaultPartnerAddressFormState = (
  choice?: ChoiceType
): PartnerAddressSchemaProps => {
  if (choice === undefined) {
    return {
      line1: "",
      line2: "",
      district: null,
      ward: null,
      province: null,
      country: "VN",
      phone_number: "",
    };
  }

  return {
    line1: "",
    line2: "",
    district: null,
    ward: null,
    province: null,
    country: "VN",
    phone_number: "",
  };
};
