export interface ADMIN_CASH_PAYMENT_METHODS_WITH_ID_PATCH_TYPE {
  name: string;
  description?: string;
}

export interface ADMIN_CASH_TRANSACTIONS_TYPES_WITH_ID_PATCH_TYPE {
  name: string;
  is_business_activity?: boolean;
  description?: string;
}

export interface ADMIN_CASH_TRANSACTIONS_WITH_ID_PATCH_TYPE {
  status?: "Draft" | "Confirmed";
  flow_type?: "Cash_out" | "Cash_in";
  notes?: string;
  address?: string;
  amount: string;
  affect_creditor?: boolean;
  type: number;
  payment_method?: number | null;
}

export interface ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_TYPE {
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
}

export interface ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_TYPE {
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

export interface ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_TYPE {
  name: string;
  description?: string;
  parent?: number | null;
}

export interface ADMIN_CUSTOMERS_WITH_ID_PATCH_TYPE {
  sales_in_charge?: number | null;
  max_debt?: string;
}

export interface ADMIN_DISCOUNTS_VOUCHERS_WITH_ID_PATCH_TYPE {
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

export interface ADMIN_DISCOUNTS_WITH_ID_PATCH_TYPE {
  name: string;
  date_start?: string;
  date_end?: string | null;
}

export interface ADMIN_ORDERS_BILLING_ADDRESSES_WITH_ID_PATCH_TYPE {
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

export interface ADMIN_ORDERS_INVOICES_QUANTITIES_WITH_ID_PATCH_TYPE {
  unit_quantity?: number;
}

export interface ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_TYPE {
  status?: "Draft";
  shipping_status?: "Pending";
  cod?: boolean;
  shipping_incl_tax?: string;
  shipping_excl_tax?: string;
  surcharge?: string;
  shipper?: number | null;
}

export interface ADMIN_ORDERS_LINES_WITH_ID_PATCH_TYPE {
  discount_type?: "Percentage" | "Absolute";
  discount_amount?: string;
  unit_quantity?: number;
}

export interface ADMIN_ORDERS_PURCHASE_CHANNELS_WITH_ID_PATCH_TYPE {
  name: string;
  description?: string;
}

export interface ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_TYPE {
  user?: number | null;
  name: string;
}

export interface ADMIN_ORDERS_SHIPPING_ADDRESSES_WITH_ID_PATCH_TYPE {
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

export interface ADMIN_ORDERS_SHIPPING_METHODS_WITH_ID_PATCH_TYPE {
  name: string;
  type: "Price" | "Weight";
  price?: string;
  price_incl_tax?: string;
  minimum_order_price?: string;
  maximum_order_price?: string | null;
  minimum_order_weight?: number;
  maximum_order_weight?: number | null;
}

export interface ADMIN_ORDERS_WITH_ID_PATCH_TYPE {
  receiver?: number | null;
  receiver_name?: string;
  receiver_email?: string;
  receiver_phone_number?: string | null;
  status?: "Draft";
  customer_notes?: string;
  channel?: number | null;
  shipping_method?: number | null;
}

export interface ADMIN_PARTNERS_ADDRESSES_WITH_ID_PATCH_TYPE {
  phone_number?: string;
  line1: string;
  line2?: string;
  district?: string;
  ward?: string;
  province?: string;
  postcode?: string;
  country?: "VN";
}

export interface ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_TYPE {
  partner_sku: string;
  price?: string;
  price_incl_tax?: string;
}

export interface ADMIN_PARTNERS_WITH_ID_PATCH_TYPE {
  max_debt?: string;
  name: string;
  tax_identification_number?: string | null;
  notes?: string;
  email?: string;
  contact_info?: string;
}

export interface ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_PATCH_TYPE {
  name: string;
  value: string;
}

export interface ADMIN_PRODUCTS_ATTRIBUTES_WITH_ID_PATCH_TYPE {
  input_type: "Option" | "Multi_option";
  name: string;
  is_variant_only?: boolean;
}

export interface ADMIN_PRODUCTS_CATEGORIES_WITH_ID_PATCH_TYPE {
  parent?: number | null;
  name: string;
  description?: string;
  image?: any | null;
  image_alt?: string;
}

export interface ADMIN_PRODUCTS_IMAGES_WITH_ID_PATCH_TYPE {
  sort_order?: number | null;
  alt?: string;
}

export interface ADMIN_PRODUCTS_RECOMMENDATIONS_WITH_ID_PATCH_TYPE {
  ranking?: number;
}

export interface ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_PATCH_TYPE {
  values: [number];
}

export interface ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_PATCH_TYPE {
  values: [number];
}

export interface ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_TYPE {
  name: string;
  tax_rate?: string;
  has_variants?: boolean;
}

export interface ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_TYPE {
  editable_sku?: string;
  unit: string;
  multiply?: number;
  weight?: number;
  bar_code?: string;
  price_incl_tax?: string;
}

export interface ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_TYPE {
  track_inventory?: boolean;
  is_default?: boolean;
  editable_sku?: string;
  unit: string;
  weight?: number;
  bar_code?: string;
  name?: string;
  price_incl_tax?: string;
  list_id_values?: string;
}

export interface ADMIN_PRODUCTS_WITH_ID_PATCH_TYPE {
  is_published?: boolean;
  publication_date?: string;
  available_for_purchase?: string;
  meta_title?: string;
  meta_description?: string;
  seo_title?: string;
  seo_description?: string;
  name: string;
  description?: string;
}

export interface ADMIN_SETTINGS_PATCH_TYPE {
  logo?: any | null;
  line1: string;
  line2?: string;
  ward?: string;
  district?: string;
  province?: string;
  country?: "VN";
  postcode?: string;
  company_name?: string;
  store_name?: string;
  store_description?: string;
  store_website?: string;
  hotline_1?: string;
  hotline_2?: string;
  tax_identification_number?: string;
  currency?: "VND";
  weight_unit?: string;
  invoice_qr_code?: any | null;
  invoice_notes?: string;
  bank_account_info?: string;
}

export interface ADMIN_USERS_ADDRESSES_WITH_ID_PATCH_TYPE {
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
}

export interface ADMIN_USERS_WITH_ID_PATCH_TYPE {
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

export interface ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_TYPE {
  line1: string;
  line2?: string;
  district?: string;
  ward?: string;
  province?: string;
  postcode?: string;
  country?: "VN";
  phone_number?: string;
}

export interface ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_TYPE {
  unit_quantity?: number;
}

export interface ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_TYPE {
  status?: "Draft" | "Confirmed";
  shipping_incl_tax?: string;
  shipping_excl_tax?: string;
  amount?: string;
  amount_incl_tax?: string;
  notes?: string;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_TYPE {
  discount_type?: "Percentage" | "Absolute";
  discount_amount?: string;
  quantity?: number;
  offer_description?: string;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_WITH_ID_PATCH_TYPE {
  expiration_date?: string;
  notes?: string;
  quantity?: number;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_WITH_ID_PATCH_TYPE {
  quantity?: number;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_TYPE {
  status?: "Draft";
  surcharge?: string;
  notes?: string;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_TYPE {
  status?: "Draft";
  surcharge?: string;
  notes?: string;
}

export interface ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_PATCH_TYPE {
  status?: "Draft";
  notes?: string;
}

export interface ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_TYPE {
  low_stock_threshold?: number | null;
  price?: string;
  price_incl_tax?: string;
}

export interface ADMIN_WAREHOUSES_WITH_ID_PATCH_TYPE {
  name: string;
  manager?: number | null;
}
