import { Price } from "./utils";

export type REPORT_GENERAL_NET_REVENUE_ITEM = {
  invoice_count: number;
  net_revenue_in_date: Price;
  net_revenue_in_previous_date: Price;
  net_revenue_in_date_of_previous_month: Price;
};

export type REPORT_NET_REVENUE_ITEM = {
  dates: DateElement[];
  net_revenue: Price;
};

export interface DateElement {
  date_start: string;
  date_end: string;
}

export type REPORT_TOP_PRODUCT_BY_NET_REVENUE_ITEM = {
  name: string;
  sku: string;
  unit: string;
  net_revenue: Price;
};

export type REPORT_TOP_PRODUCT_BY_QUANTITY_ITEM = {
  name: string;
  sku: string;
  unit: string;
  quantity: number;
};

export type REPORT_REVENUE_ITEM = {
  date_start: string;
  date_end: string;
  invoice_count: number;
  net_revenue: Price;
  revenue: Price;
  base_amount: Price;
};

export type REPORT_TOP_PRODUCT_BY_PROFIT_ITEM = {
  name: string;
  sku: string;
  unit: string;
  profit: Price;
};

export type REPORT_TOP_PRODUCT_BY_ROS_ITEM = {
  name: string;
  sku: string;
  unit: string;
  ros: string;
};

export type REPORT_TOP_CUSTOMER_BY_DEBT_AMOUNT_ITEM = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  debt_amount: Price;
};

export type REPORT_TOP_CUSTOMER_BY_NET_REVENUE_ITEM = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  net_revenue: Price;
};

export type REPORT_TOP_PARTNER_BY_RECEIPT_AMOUNT_ITEM = {
  id: number;
  name: string;
  receipt_amount: Price;
};

export type REPORT_TOP_PARTNER_BY_DEBT_AMOUNT_ITEM = {
  id: number;
  name: string;
  debt_amount: Price;
};

export type REPORT_TOP_STAFF_BY_NET_REVENUE_ITEM = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  net_revenue: Price;
};

export type REPORT_CASH_ITEM = {
  date_start: string;
  date_end: string;
  transaction_types: TransactionType[];
  net_revenue: Price;
  revenue: Price;
  base_amount: Price;
};

interface TransactionType {
  id: number;
  name: string;
  revenue: Price;
  expense: Price;
}

export type REPORT_STAFF_WITH_REVENUE_ITEM = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  invoice_count: number;
  net_revenue: Price;
  revenue: Price;
  base_amount: Price;
};

export type REPORT_PRODUCT_WITH_REVENUE_ITEM = {
  name: string;
  sku: string;
  unit: string;
  invoice_count: number;
  quantity: number;
  net_revenue: Price;
  revenue: Price;
  base_amount: Price;
};

export type REPORT_PRODUCT_WITH_IO_INVENTORY_ITEM = {
  name: string;
  sku: string;
  unit: string;
  beginning_quantity: number;
  input_quantity: number;
  output_quantity: number;
  beginning_amount: Price;
  total_input_amount: Price;
  total_output_amount: Price;
  current_price: Price;
  current_base_price: Price;
};

export type REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE_ITEM = {
  name: string;
  sku: string;
  unit: string;
  warehouse_name: string;
  beginning_quantity: number;
  input_quantity: number;
  output_quantity: number;
  beginning_amount: Price;
  total_input_amount: Price;
  total_output_amount: Price;
  current_price: Price;
  current_base_price: Price;
};

export type REPORT_CUSTOMER_WITH_REVENUE_ITEM = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  invoice_count: number;
  net_revenue: Price;
  revenue: Price;
  base_amount: Price;
};

export type REPORT_CUSTOMER_WITH_DEBT_AMOUNT_ITEM = {
  id: number;
  name: string;
  email: null;
  phone_number: string;
  beginning_debt_amount: Price;
  credit: Price;
  debit: Price;
};

export type REPORT_PARTNER_WITH_DEBT_AMOUNT_ITEM = {
  id: number;
  name: string;
  beginning_debt_amount: Price;
  credit: Price;
  debit: Price;
};

export type REPORT_PARTNER_WITH_PURCHASE_AMOUNT_ITEM = {
  id: number;
  name: string;
  purchase_amount: Price;
  return_amount: Price;
};

// *
