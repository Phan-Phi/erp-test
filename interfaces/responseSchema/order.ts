import { USER_ITEM } from "./user";
import { Variant } from "./product";
import { Price, Weight, Avatar, PrimaryAddress } from "./utils";
import { WAREHOUSE_RECORD_ITEM, WAREHOUSE_ITEM } from "./warehouse";

export type ORDER_SHIPPER_ITEM = {
  id: number;
  user: USER_ITEM | null;
  name: string;
};

export type ORDER_PURCHASE_CHANNEL_ITEM = {
  id: number;
  name: string;
  description: string;
};

export type ORDER_SHIPPING_METHOD_ITEM = {
  id: number;
  type: string;
  name: string;
  price: Price;
  minimum_order_price: Price;
  maximum_order_price: Price;
  minimum_order_weight: Weight;
  maximum_order_weight: Weight;
};

export type ORDER_ITEM = {
  id: number;
  channel: Channel;
  owner: Owner;
  receiver: Receiver;
  shipping_method: ORDER_SHIPPING_METHOD_ITEM;
  is_editable: boolean;
  shipping_address: PrimaryAddress | null;
  billing_address: PrimaryAddress | null;
  sid: string;
  channel_name: string;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  receiver_name: string;
  receiver_email: string;
  receiver_phone_number: string;
  status: string;
  shipping_method_name: string;
  date_placed: string;
  weight: Weight;
  customer_notes: string;
  line_count: number;
  item_count: number;
  total_price: Price;
  total_before_vouchers: Price;
  total_before_discounts: Price;
  shipping_charge: Price;
  shipping_charge_before_vouchers: Price;
};

export interface Channel {
  id: number;
  name: string;
  description: string;
}

export interface Owner {
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
  birthday: string | null;
  gender: string;
  facebook: string;
  is_staff: boolean;
  is_active: boolean;
  last_login: string;
  date_updated: string;
}

export interface Receiver {
  id: number;
  avatar: Avatar | {};
  default_shipping_address: null;
  default_billing_address: null;
  default_shipping_address_ecom: null;
  sales_in_charge: number;
  type: number;
  gender: string;
  email: string;
  main_phone_number: string;
  first_name: string;
  last_name: string;
  note: string;
  date_joined: string;
  birthday: string;
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

export type ORDER_LINE_ITEM = {
  id: number;
  order: ORDER_ITEM;
  variant: Variant;
  actual_invoice_quantity: number;
  actual_invoice_unit_quantity: number;
  variant_name: string;
  variant_sku: string;
  unit: string;
  unit_weight: Weight;
  quantity: number;
  invoice_quantity: number;
  invoice_unit_quantity: number;
  delivered_quantity: number;
  delivered_unit_quantity: number;
  unit_quantity: number;
  discount_type: string;
  discount_amount: string;
  line_price: Price;
  line_price_before_vouchers: Price;
  line_price_before_discounts: Price;
  unit_price: Price;
  unit_price_before_vouchers: Price;
  unit_price_before_discounts: Price;
  weight: Weight;
};

export type ORDER_INVOICE_ITEM = {
  id: number;
  order: ORDER_ITEM;
  owner: Owner;
  shipper: ORDER_SHIPPER_ITEM;
  is_editable: boolean;
  total_transaction_in_amount: Price;
  total_transaction_out_amount: Price;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  sid: string;
  date_created: Date;
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
};

export type ORDER_INVOICE_QUANTITY_ITEM = {
  id: number;
  invoice: Invoice;
  line: Line;
  warehouse: WAREHOUSE_ITEM;
  record: WAREHOUSE_RECORD_ITEM;
  warehouse_name: string;
  quantity: number;
  unit_quantity: number;
  weight: Weight;
  amount: Price;
  amount_before_vouchers: Price;
  amount_before_discounts: Price;
  pick_up_address: string;
  base_amount: Price;
};

export interface Invoice {
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
  date_created: Date;
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

export interface Line {
  id: number;
  order: number;
  variant: number;
  actual_invoice_quantity: number;
  actual_invoice_unit_quantity: number;
  variant_name: string;
  variant_sku: string;
  unit: string;
  unit_weight: Weight;
  quantity: number;
  invoice_quantity: number;
  invoice_unit_quantity: number;
  delivered_quantity: number;
  delivered_unit_quantity: number;
  unit_quantity: number;
  discount_type: string;
  discount_amount: string;
  line_price: Price;
  line_price_before_vouchers: Price;
  line_price_before_discounts: Price;
  unit_price: Price;
  unit_price_before_vouchers: Price;
  unit_price_before_discounts: Price;
  weight: Weight;
}

// *
