import { Variant } from "./product";

export type DISCOUNT_ITEM = {
  id: number;
  name: string;
  discount_type: string;
  discount_amount: string;
  usage_limit: null | number;
  used: number;
  date_start: string;
  date_end: string | null;
};

// *

export type DISCOUNT_DISCOUNTED_VARIANT_ITEM = {
  id: number;
  variant: Variant;
  sale: DISCOUNT_ITEM;
};
