import { Avatar, PrimaryAddress } from "./utils";

import { PERMISSION_ITEM } from "./permission";

export type USER_ITEM = {
  id: number;
  avatar: Avatar | {};
  default_shipping_address: PrimaryAddress | null;
  default_billing_address: PrimaryAddress | null;
  is_superuser: boolean;
  username: string;
  email: string;
  main_phone_number: string;
  first_name: string;
  last_name: string;
  note: string;
  date_joined: string;
  birthday: null;
  gender: string;
  facebook: string;
  is_staff: boolean;
  is_active: boolean;
  last_login: string;
  date_updated: string;
};

export interface USER_ADDRESS_ITEM {
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
  is_default_for_billing: boolean;
  country: string;
  user: USER_ITEM;
}

// *

export type USER_PERMISSION_ITEM = {
  id: number;
  user: USER_ITEM;
  permission: PERMISSION_ITEM;
};
