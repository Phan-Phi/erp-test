import { Avatar, Price, PrimaryAddress } from "./utils";

import { USER_ITEM } from "./user";

export type CUSTOMER_TYPE_ITEM = {
  id: number;
  name: string;
  description: string;
  parent: object | null;
  level: number;
  full_name: string;
};

export type CUSTOMER_DRAFT_ITEM = {
  id: number;
  avatar: Avatar | {};
  default_shipping_address: null | PrimaryAddress;
  default_shipping_address_ecom: null | PrimaryAddress;
  default_billing_address: null | PrimaryAddress;
  official_customer: null | User;
  type: null | CUSTOMER_TYPE_ITEM;
  gender: string;
  state: string;
  token: string;
  email: null | string;
  main_phone_number: string;
  first_name: string;
  last_name: string;
  note: string;
  birthday: null | string;
  facebook: string;
  tax_identification_number: null | string;
  company_name: string;
  in_business: boolean;
  is_mutated: boolean;
  date_created: string;
};

export type CUSTOMER_ADDRESS_ITEM = {
  id: number;
  line1: string;
  line2: string;
  district: string;
  ward: string;
  province: string;
  postcode: string;
  phone_number: string;
  notes: string;
  is_default_for_shipping: boolean;
  is_default_for_shipping_ecom: boolean;
  is_default_for_billing: boolean;
  country: string;
  user: User;
};

export interface User {
  id: number;
  avatar: Avatar | {};
  sales_in_charge: null;
  type: null;
  gender: string;
  email: string;
  main_phone_number: string;
  first_name: string;
  last_name: string;
  note: string;
  date_joined: string;
  birthday: string | null;
  facebook: string;
  date_updated: string;
  max_debt: Price;
  tax_identification_number: null;
  company_name: string;
  in_business: boolean;
  sid: string;
  total_debt_amount: Price;
  total_purchase: Price;
}

export type CUSTOMER_DRAFT_ADDRESS_ITEM = {
  id: number;
  line1: string;
  line2: string;
  district: string;
  ward: string;
  province: string;
  postcode: string;
  phone_number: string;
  notes: string;
  is_default_for_shipping: boolean;
  is_default_for_shipping_ecom: boolean;
  is_default_for_billing: boolean;
  country: string;
  user: User;
};

// *

export type CUSTOMER_ITEM = {
  id: number;
  avatar: Avatar | {};
  default_shipping_address: null | PrimaryAddress;
  default_billing_address: null | PrimaryAddress;
  default_shipping_address_ecom: null | PrimaryAddress;
  sales_in_charge: USER_ITEM;
  type: null;
  gender: string;
  email: string | null;
  main_phone_number: string;
  first_name: string;
  last_name: string;
  note: string;
  date_joined: string;
  birthday: string | null;
  facebook: string;
  date_updated: string;
  max_debt: Price;
  tax_identification_number: string | null;
  company_name: string;
  in_business: boolean;
  sid: string;
  total_debt_amount: Price;
  total_purchase: Price;
};
