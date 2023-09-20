import { Avatar, PrimaryAddress, Price } from "./utils";

import { Variant } from "./product";
import { PARTNER_ITEM } from "./partner";
import { Owner } from "./order";

export type WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM = {
  id: number;
  order: Order;
  is_editable: boolean;
  owner: Owner;
  total_transaction_in_amount: Amount;
  total_transaction_out_amount: Amount;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  sid: string;
  status: string;
  surcharge: Amount;
  date_created: string;
  amount: Amount;
  quantity_count: number;
  item_count: number;
  notes: string;
};

export interface Amount {
  currency: string;
  excl_tax: string;
  incl_tax: string;
  tax: string;
}

export interface Order {
  id: number;
  owner: number;
  status: string;
  warehouse: number;
  partner: number;
  is_editable: boolean;
  sid: string;
  partner_name: string;
  warehouse_name: string;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  date_placed: string;
  line_count: number;
  item_count: number;
  total_price: Amount;
  total_before_discounts: Amount;
}

export type WAREHOUSE_ITEM = {
  id: number;
  name: string;
  primary_address: PrimaryAddress;
  is_used: boolean;
};

export type WAREHOUSE_RECORD_ITEM = {
  id: number;
  warehouse: WAREHOUSE_ITEM;
  variant: Variant;
  quantity: number;
  allocated_quantity: number;
  date_updated: string;
  low_stock_threshold: null;
  price: Price;
};

export type WAREHOUSE_OUTNOTE_ITEM = {
  id: number;
  owner: Owner;
  status: string;
  warehouse: WAREHOUSE_ITEM;
  is_editable: boolean;
  total_transaction_in_amount: Amount;
  total_transaction_out_amount: Amount;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  sid: string;
  warehouse_name: string;
  base_amount: Amount;
  amount: Amount;
  date_created: Date;
  line_count: number;
  item_count: number;
  notes: string;
  total_price: Amount;
  shipping_charge: Amount;
};

export type WAREHOUSE_OUTNOTE_LINE_ITEM = {
  id: number;
  stock_out_note: StockOutNote;
  record: Record;
  variant: Variant;
  quantity: number;
  unit_quantity: number;
  unit: string;
  variant_sku: string;
  variant_name: string;
  unit_base_price_incl_tax: string;
  unit_base_price_excl_tax: string;
  line_price: Price;
  unit_price: Price;
  base_amount: Price;
};

export interface Record {
  id: number;
  warehouse: number;
  variant: number;
  quantity: number;
  allocated_quantity: number;
  date_updated: string;
  low_stock_threshold: null;
  price: Price;
}

export interface StockOutNote {
  id: number;
  owner: number;
  status: string;
  warehouse: number;
  is_editable: boolean;
  total_transaction_in_amount: Price;
  total_transaction_out_amount: Price;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  sid: string;
  warehouse_name: string;
  base_amount: Price;
  amount: Price;
  date_created: string;
  line_count: number;
  item_count: number;
  notes: string;
  total_price: Price;
  shipping_charge: Price;
}

export type WAREHOUSE_PURCHASE_ORDER_ITEM = {
  id: number;
  owner: Owner;
  status: string;
  warehouse: WAREHOUSE_ITEM;
  partner: PARTNER_ITEM;
  is_editable: boolean;
  sid: string;
  partner_name: string;
  warehouse_name: string;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  date_placed: Date;
  line_count: number;
  item_count: number;
  notes: string;
  total_price: Price;
  total_before_discounts: Price;
};

export type WAREHOUSE_PURCHASE_ORDER_LINE_ITEM = {
  id: number;
  order: Order;
  variant: Variant;
  item: Item;
  record: Record;
  actual_receipt_quantity: number;
  quantity: number;
  offer_description: string;
  partner_sku: string;
  variant_sku: string;
  variant_name: string;
  discount_type: string;
  discount_amount: string;
  receipt_quantity: number;
  return_quantity: number;
  line_price: Price;
  line_price_before_discounts: Price;
  unit_price: Price;
  unit_price_before_discounts: Price;
};

export interface Item {
  id: number;
  partner: number;
  variant: number;
  partner_sku: string;
  price: Price;
  date_updated: string;
}

export type WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_QUANTITY_ITEM = {
  id: number;
  order: Order;
  line: WAREHOUSE_PURCHASE_ORDER_LINE_ITEM;
  actual_return_quantity: number;
  expiration_date: string;
  notes: string;
  quantity: number;
  return_quantity: number;
  amount: Price;
};

export type WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER_ITEM = {
  id: number;
  order: WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM;
  is_editable: boolean;
  owner: Owner;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  sid: string;
  status: string;
  amount: Price;
  date_created: string;
  surcharge: Price;
  quantity_count: number;
  item_count: number;
  notes: string;
};

// *

export type WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER_QUANTITY_ITEM = {
  id: number;
  order: WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER_ITEM;
  receipt_order_quantity: ReceiptOrderQuantity;
  quantity: number;
  amount: Price;
};

export interface ReceiptOrderQuantity {
  id: number;
  order: number;
  line: number;
  actual_return_quantity: number;
  expiration_date: string;
  notes: string;
  quantity: number;
  return_quantity: number;
  amount: Price;
}
