export interface ADMIN_EXPORT_FILES_POST_TYPE {
  type: "Invoice_quantity" | "Transaction" | "Debt_record";
  file_ext: ".csv" | ".xlsx";
  field_options?: [
    | "Order_sid"
    | "Order_status"
    | "Order_channel_name"
    | "Order_shipping_method_name"
    | "Order_customer_notes"
    | "Order_owner_name"
    | "Order_owner_phone_number"
    | "Order_owner_email"
    | "Invoice_sid"
    | "Invoice_date_created"
    | "Invoice_status"
    | "Order_receiver_name"
    | "Order_receiver_phone_number"
    | "Order_receiver_email"
    | "Shipping_address_address"
    | "Billing_address_address"
    | "Invoice_quantity_amount_before_discounts"
    | "Invoice_quantity_amount_before_discounts_incl_tax"
    | "Invoice_amount_before_discounts"
    | "Invoice_amount_before_discounts_incl_tax"
    | "Invoice_discount_amount"
    | "Invoice_discount_amount_incl_tax"
    | "Invoice_surcharge"
    | "Invoice_shipping_incl_tax"
    | "Invoice_shipping_excl_tax"
    | "Invoice_cod"
    | "Invoice_shipping_status"
    | "Invoice_shipping_name"
    | "Invoice_owner_name"
    | "Invoice_owner_phone_number"
    | "Invoice_owner_email"
    | "Line_variant_sku"
    | "Variant_editable_sku"
    | "Line_variant_name"
    | "Line_variant_unit"
    | "Invoice_quantity_unit_quantity"
    | "Line_variant_unit_price_excl_tax"
    | "Line_variant_unit_price_incl_tax"
    | "Invoice_quantity_amount"
    | "Invoice_quantity_amount_incl_tax"
    | "Line_variant_unit_weight"
    | "Invoice_quantity_weight"
    | "Invoice_quantity_warehouse_name"
    | "Line_variant_unit_price_before_discounts_excl_tax"
    | "Line_variant_unit_price_before_discounts_incl_tax"
    | "Invoice_amount"
    | "Invoice_amount_incl_tax"
    | "Invoice_base_amount"
    | "Invoice_base_amount_incl_tax"
    | "Invoice_merge_profit_amount"
    | "Invoice_merge_profit_amount_incl_tax"
    | "Transaction_sid"
    | "Transaction_owner_name"
    | "Transaction_owner_email"
    | "Transaction_owner_phone_number"
    | "Transaction_status"
    | "Transaction_notes"
    | "Transaction_address"
    | "Transaction_date_created"
    | "Transaction_directed_amount"
    | "Transaction_target_name"
    | "Transaction_payment_method_name"
    | "Transaction_affect_creditor"
    | "Type_name"
    | "Source_sid",
  ];
  date_start?: string;
  date_end?: string;
  customer?: string | null;
}

export interface CHANGE_PASSWORD_POST_TYPE {
  password: string;
  confirm_password: string;
}

export interface LOGIN_POST_TYPE {
  username: string;
  password: string;
}

export interface REFRESH_TOKEN_POST_TYPE {
  refresh_token: string;
  csrf_token: string;
}

export interface VERIFY_TOKEN_POST_TYPE {
  token: string;
}

export interface ADMIN_CASH_PAYMENT_METHODS_POST_TYPE {
  name: string;
  description?: string;
}

export interface ADMIN_CASH_TRANSACTIONS_POST_TYPE {
  status?: "Draft" | "Confirmed";
  source_type?: "stock.receiptorder" | "stock.stockoutnote" | "order.invoice";
  target_type?: "partner.partner" | "customer.customer";
  flow_type?: "Cash_out" | "Cash_in";
  notes?: string;
  address?: string;
  amount: string;
  source_id?: number | null;
  target_id?: number | null;
  target_name?: string;
  affect_creditor?: boolean;
  type: number;
  payment_method?: number | null;
}

export interface ADMIN_CASH_TRANSACTIONS_TYPES_POST_TYPE {
  name: string;
  is_business_activity?: boolean;
  description?: string;
}

export interface ADMIN_CUSTOMERS_DRAFTS_POST_TYPE {
  avatar?: any | null;
  email?: string | null;
  main_phone_number?: string | null;
  first_name?: string;
  last_name?: string;
  note?: string;
  birthday?: string | null;
  gender?: "Male" | "Female" | "Other";
  facebook?: string;
  tax_identification_number?: string | null;
  company_name?: string;
  in_business?: boolean;
  type?: number | null;
}

export interface ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_TYPE {
  line1: string;
  line2?: string;
  district?: string;
  ward?: string;
  province?: string;
  postcode?: string;
  phone_number?: string;
  notes?: string;
  is_default_for_shipping?: boolean;
  is_default_for_shipping_ecom?: boolean;
  is_default_for_billing?: boolean;
  country?: "VN";
  user: number;
}

export interface ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_TYPE {
  token: string;
}

export interface ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_TYPE {
  token: string;
}

export interface ADMIN_CUSTOMERS_TYPES_POST_TYPE {
  name: string;
  description?: string;
  parent?: number | null;
}

export interface ADMIN_DISCOUNTS_POST_TYPE {
  name: string;
  date_start?: string;
  date_end?: string | null;
}

export interface ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_TYPE {
  category?: number | null;
  discount_type?: "Percentage" | "Absolute";
  discount_amount?: string;
  usage_limit?: number | null;
  variant?: number | null;
  sale?: number;
}

export interface ADMIN_DISCOUNTS_VOUCHERS_POST_TYPE {
  type?: "Entire_order" | "Shipping" | "Specific_product_variant";
  name: string;
  code: string;
  description?: string;
  usage_limit?: number | null;
  date_start?: string;
  date_end?: string | null;
  apply_once_per_order?: boolean;
  apply_once_per_customer?: boolean;
  discount_type?: "Percentage" | "Absolute";
  discount_amount?: string;
  min_spent_amount?: string;
  min_checkout_items_quantity?: number;
}

export interface ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_TYPE {
  category?: number | null;
  variant?: number | null;
  voucher?: number;
}

export interface ADMIN_ORDERS_POST_TYPE {
  receiver?: number | null;
  receiver_name?: string;
  receiver_email?: string;
  receiver_phone_number?: string | null;
  status?: "Draft";
  customer_notes?: string;
  channel?: number | null;
  shipping_method?: number | null;
}

export interface ADMIN_ORDERS_BILLING_ADDRESSES_POST_TYPE {
  order: number;
  line1: string;
  line2?: string;
  ward?: string;
  district?: string;
  province?: string;
  country?: "VN";
  postcode?: string;
  phone_number?: string;
  notes?: string;
}

export interface ADMIN_ORDERS_INVOICES_POST_TYPE {
  order: number;
  status?: "Draft";
  shipping_status?: "Pending";
  cod?: boolean;
  shipping_incl_tax?: string;
  shipping_excl_tax?: string;
  surcharge?: string;
  shipper?: number | null;
}

export interface ADMIN_ORDERS_INVOICES_QUANTITIES_POST_TYPE {
  line: number;
  invoice: number;
  unit_quantity?: number;
  record?: number | null;
  warehouse?: number | null;
}

export interface ADMIN_ORDERS_LINES_POST_TYPE {
  discount_type?: "Percentage" | "Absolute";
  discount_amount?: string;
  order: number;
  variant: number;
  unit?: string;
  unit_quantity?: number;
}

export interface ADMIN_ORDERS_PURCHASE_CHANNELS_POST_TYPE {
  name: string;
  description?: string;
}

export interface ADMIN_ORDERS_SHIPPERS_POST_TYPE {
  user?: number | null;
  name: string;
}

export interface ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_TYPE {
  order: number;
  line1: string;
  line2?: string;
  ward?: string;
  district?: string;
  province?: string;
  country?: "VN";
  postcode?: string;
  phone_number?: string;
  notes?: string;
}

export interface ADMIN_ORDERS_SHIPPING_METHODS_POST_TYPE {
  name: string;
  type: "Price" | "Weight";
  price?: string;
  price_incl_tax?: string;
  minimum_order_price?: string;
  maximum_order_price?: string | null;
  minimum_order_weight?: number;
  maximum_order_weight?: number | null;
}

export interface ADMIN_PARTNERS_POST_TYPE {
  max_debt?: string;
  name: string;
  tax_identification_number?: string | null;
  notes?: string;
  email?: string;
  contact_info?: string;
}

export interface ADMIN_PARTNERS_ADDRESSES_POST_TYPE {
  phone_number?: string;
  line1: string;
  line2?: string;
  district?: string;
  ward?: string;
  province?: string;
  postcode?: string;
  country?: "VN";
  partner: number;
}

export interface ADMIN_PARTNERS_ITEMS_POST_TYPE {
  partner_sku: string;
  price?: string;
  price_incl_tax?: string;
  partner: number;
  variant: number;
}

export interface ADMIN_PRODUCTS_POST_TYPE {
  is_published?: boolean;
  publication_date?: string;
  available_for_purchase?: string;
  product_class: number;
  meta_title?: string;
  meta_description?: string;
  seo_title?: string;
  seo_description?: string;
  name: string;
  description?: string;
}

export interface ADMIN_PRODUCTS_ATTRIBUTES_POST_TYPE {
  input_type: "Option" | "Multi_option";
  name: string;
  is_variant_only?: boolean;
}

export interface ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_TYPE {
  name: string;
  value: string;
  attribute: number;
}

export interface ADMIN_PRODUCTS_CATEGORIES_POST_TYPE {
  parent?: number | null;
  name: string;
  description?: string;
  image?: any | null;
  image_alt?: string;
}

export interface ADMIN_PRODUCTS_IMAGES_POST_TYPE {
  image: any;
  sort_order?: number | null;
  alt?: string;
  product: number;
}

export interface ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_TYPE {
  category: number;
  product: number;
}

export interface ADMIN_PRODUCTS_RECOMMENDATIONS_POST_TYPE {
  ranking?: number;
  primary: number;
  recommendation: number;
}

export interface ADMIN_PRODUCTS_TYPES_POST_TYPE {
  name: string;
  tax_rate?: string;
  has_variants?: boolean;
}

export interface ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_TYPE {
  attribute: number;
  product_class: number;
}

export interface ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_TYPE {
  attribute: number;
  product_class: number;
}

export interface ADMIN_PRODUCTS_VARIANTS_POST_TYPE {
  track_inventory?: boolean;
  is_default?: boolean;
  product: number;
  editable_sku?: string;
  unit: string;
  weight?: number;
  bar_code?: string;
  name?: string;
  price_incl_tax?: string;
  list_id_values?: string;
}

export interface ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_TYPE {
  variant: number;
  image: number;
}

export interface ADMIN_PRODUCTS_VARIANTS_UNITS_POST_TYPE {
  editable_sku?: string;
  unit: string;
  multiply?: number;
  weight?: number;
  bar_code?: string;
  price_incl_tax?: string;
  variant: number;
}

export interface ADMIN_USERS_POST_TYPE {
  avatar?: any | null;
  username?: string | null;
  email?: string | null;
  main_phone_number?: string | null;
  first_name?: string;
  last_name?: string;
  note?: string;
  birthday?: string | null;
  gender?: "Male" | "Female" | "Other";
  facebook?: string;
  is_staff?: boolean;
  is_active?: boolean;
}

export interface ADMIN_USERS_ADDRESSES_POST_TYPE {
  line1: string;
  line2?: string;
  district?: string;
  ward?: string;
  province?: string;
  postcode?: string;
  phone_number?: string;
  notes?: string;
  is_default_for_shipping?: boolean;
  is_default_for_billing?: boolean;
  country?: "VN";
  user: number;
}

export interface ADMIN_USERS_PERMISSIONS_POST_TYPE {
  user: number;
  permission: number;
}

export interface ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_TYPE {
  token: string;
}

export interface ADMIN_WAREHOUSES_POST_TYPE {
  name: string;
  manager?: number | null;
}

export interface ADMIN_WAREHOUSES_ADDRESSES_POST_TYPE {
  line1: string;
  line2?: string;
  district?: string;
  ward?: string;
  province?: string;
  postcode?: string;
  country?: "VN";
  warehouse: number;
  phone_number?: string;
}

export interface ADMIN_WAREHOUSES_OUT_NOTES_POST_TYPE {
  status?: "Draft" | "Confirmed";
  shipping_incl_tax?: string;
  shipping_excl_tax?: string;
  amount?: string;
  amount_incl_tax?: string;
  notes?: string;
  warehouse: number;
}

export interface ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_TYPE {
  unit?: string | null;
  variant?: number | null;
  record?: number | null;
  stock_out_note: number;
  unit_quantity?: number;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_TYPE {
  status?: "Draft";
  notes?: string;
  warehouse: number;
  partner: number;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_TYPE {
  discount_type?: "Percentage" | "Absolute";
  discount_amount?: string;
  order: number;
  quantity?: number;
  offer_description?: string;
  variant?: number | null;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_TYPE {
  order: number;
  status?: "Draft";
  surcharge?: string;
  notes?: string;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_TYPE {
  order: number;
  line: number;
  expiration_date?: string;
  notes?: string;
  quantity?: number;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_TYPE {
  order: number;
  status?: "Draft";
  surcharge?: string;
  notes?: string;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_TYPE {
  order: number;
  receipt_order_quantity: number;
  quantity?: number;
}
