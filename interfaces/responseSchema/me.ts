import { Avatar } from "./utils";

interface ME_ITEM {
  id: number;
  avatar: Avatar | {};
  default_shipping_address: null | object;
  default_billing_address: null | object;
  is_superuser: boolean;
  username: string;
  email: string;
  main_phone_number: string;
  first_name: string;
  last_name: string;
  note: string;
  date_joined: string | null;
  birthday: string | null;
  gender: string;
  facebook: string;
  is_staff: boolean;
  is_active: boolean;
  last_login: string;
  date_updated: string;
}

interface ME_PERMISSION_ITEM {
  id: number;
  content_type: string;
  name: string;
  codename: string;
}

export type { ME_ITEM, ME_PERMISSION_ITEM };
