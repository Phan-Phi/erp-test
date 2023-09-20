import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { validatePhoneNumber } from "./utils";
import { ChoiceItem, ChoiceType } from "interfaces";
import { ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

export interface WarehouseAddressSchemaProps {
  id?: number;
  line1: string;
  line2: string;
  district: ChoiceItem | null;
  ward: ChoiceItem | null;
  province: ChoiceItem | null;
  postcode: string;
  country: string;
  phone_number: string;
  warehouse: string;
}

export const warehouseAddressSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    // return ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_RESOLVER;
    return yupResolver(
      object().shape({
        line1: string().required().trim(),
        line2: string().trim(),
        district: mixed().nullable(),
        ward: mixed().nullable(),
        province: mixed().nullable(),
        country: string(),
        warehouse: string(),
        phone_number: validatePhoneNumber().required(),
      })
    );
  }
  // return ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_RESOLVER;
  return yupResolver(
    object().shape({
      line1: string().required().trim(),
      line2: string().trim(),
      district: mixed().nullable(),
      ward: mixed().nullable(),
      province: mixed().nullable(),
      country: string(),
      warehouse: string(),
      phone_number: validatePhoneNumber().required(),
    })
  );
};

export const defaultWarehouseAddressFormState = (
  choice?: ChoiceType
): WarehouseAddressSchemaProps => {
  if (choice === undefined) {
    return {
      line1: "",
      line2: "",
      district: null,
      ward: null,
      province: null,
      country: "VN",
      warehouse: "",
      phone_number: "",
      postcode: "",
    };
  }

  return {
    line1: "",
    line2: "",
    district: null,
    ward: null,
    province: null,
    country: "VN",
    warehouse: "",
    phone_number: "",
    postcode: "",
  };
};
