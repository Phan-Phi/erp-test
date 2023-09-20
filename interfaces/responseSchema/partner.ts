import { Price, PrimaryAddress, PrimaryImage, Unit, Weight } from "./utils";

import { Variant } from "./product";

export type PARTNER_ITEM_ITEM = {
  id: number;
  partner: PARTNER_ITEM;
  variant: Variant;
  partner_sku: string;
  price: Price;
  date_updated: string;
};

export type PARTNER_ITEM = {
  id: number;
  primary_address: PrimaryAddress;
  is_used: boolean;
  max_debt: Price;
  name: string;
  tax_identification_number: string;
  total_debt_amount: Price;
  total_purchase: Price;
};
