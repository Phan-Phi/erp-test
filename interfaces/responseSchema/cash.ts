import { Price, Avatar, Weight } from "./utils";

import { Owner } from "./order";

export type CASH_DEBT_RECORD_ITEM = {
  id: number;
  creditor_type: string;
  source_type: string;
  sid: string;
  date_created: string;
  source: Source;
  creditor: Creditor;
  debt_amount: Price;
  total_debt_amount_at_time: Price;
};

export interface Creditor {
  id: number;
  primary_address: number;
  is_used: boolean;
  max_debt: Price;
  name: string;
  tax_identification_number: string;
  total_debt_amount: Price;
  total_purchase: Price;
}

export type CASH_PAYMENT_METHOD_ITEM = {
  id: number;
  total_revenue: Price;
  total_expense: Price;
  date_updated: string;
  name: string;
  description: string;
  beginning_balance: Price;
  total_balance: Price;
};

export type CASH_TRANSACTION_TYPE_ITEM = {
  id: number;
  is_used: boolean;
  total_revenue: Price;
  total_expense: Price;
  date_updated: string;
  name: string;
  is_business_activity: boolean;
  description: string;
  date_created: string;
  beginning_balance: Price;
  total_balance: Price;
};

// *

export type CASH_TRANSACTION_ITEM = {
  id: number;
  type: CASH_TRANSACTION_TYPE_ITEM;
  payment_method: PaymentMethod;
  source_type: string;
  target_type: string;
  owner: Owner;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  flow_type: string;
  status: string;
  notes: string;
  address: string;
  date_created: Date;
  amount: Price;
  target_name: string;
  payment_method_name: string;
  affect_creditor: boolean;
  sid: string;
  source: Source;
  target: Target;
};

export interface PaymentMethod {
  id: number;
  total_revenue: Price;
  total_expense: Price;
  date_updated: Date;
  name: string;
  description: string;
}

export interface Source {
  id: number;
  order: number;
  owner: number;
  shipper: number;
  is_editable: boolean;
  total_transaction_in_amount: Price;
  total_transaction_out_amount: Price;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  sid: string;
  date_created: string;
  status: string;
  shipping_status: string;
  cod: boolean;
  shipper_name: string;
  surcharge: Price;
  weight: Weight;
  amount: Price;
  amount_before_vouchers: Price;
  amount_before_discounts: Price;
  base_amount: Price;
  quantity_count: number;
  item_count: number;
  shipping_charge: Price;
}

export interface Target {
  id: number;
  avatar: Avatar;
  default_shipping_address: number;
  default_billing_address: null;
  default_shipping_address_ecom: null;
  sales_in_charge: number;
  type: number;
  gender: string;
  email: null;
  main_phone_number: string;
  first_name: string;
  last_name: string;
  note: string;
  date_joined: Date;
  birthday: null;
  facebook: string;
  date_updated: Date;
  max_debt: Price;
  tax_identification_number: null;
  company_name: string;
  in_business: boolean;
  sid: string;
  total_debt_amount: Price;
  total_purchase: Price;
}
