const PREFIX = "api/v1";
const PREFIX_V2 = "api/v2";

const generatePathname = (
  data: string[],
  prefix: typeof PREFIX | typeof PREFIX_V2 = PREFIX
) => {
  const arr = [prefix as string].concat(data);
  return `/${arr.join("/")}/`;
};

const generatePathnameWithAdmin = (
  data: string[],
  prefix: typeof PREFIX | typeof PREFIX_V2 = PREFIX
) => {
  const arr = [prefix, admin].concat(data);
  return `/${arr.join("/")}/`;
};

const me = "me";
const cash = "cash";
const units = "units";
const users = "users";
const notes = "notes";
const types = "types";
const login = "login";
const admin = "admin";
const lines = "lines";
const items = "items";
const images = "images";
const drafts = "drafts";
const values = "values";
const orders = "orders";
const records = "records";
const revenue = "revenue";
const choices = "choices";
const options = "options";
const reports = "reports";
const vouchers = "vouchers";
const shippers = "shippers";
const products = "products";
const variants = "variants";
const settings = "settings";
const invoices = "invoices";
const partners = "partners";
const discounts = "discounts";
const out_notes = "out-notes";
const addresses = "addresses";
const customers = "customers";
const divisions = "divisions";
const quantities = "quantities";
const categories = "categories";
const attributes = "attributes";
const warehouse = "warehouse";
const warehouses = "warehouses";
const permissions = "permissions";
const net_revenue = "net-revenue";
const debt_records = "debt-records";
const transactions = "transactions";
const verify_token = "verify-token";
const refresh_token = "refresh-token";
const return_orders = "return-orders";
const receipt_orders = "receipt-orders";
const purchase_orders = "purchase-orders";
const payment_methods = "payment-methods";
const change_password = "change-password";
const shipping_methods = "shipping-methods";
const country_divisions = "country-divisions";
const convert_divisions = "convert-divisions";
const purchase_channels = "purchase-channels";
const billing_addresses = "billing-addresses";
const variant_attributes = "variant-attributes";
const shipping_addresses = "shipping-addresses";
const product_attributes = "product-attributes";
const product_categories = "product-categories";
const discounted_variants = "discounted-variants";
const general_net_revenue = "general-net-revenue";
const discounted_products = "discounted-products";
const discounted_categories = "discounted-categories";
const top_product_by_quantity = "top-product-by-quantity";
const top_product_by_profit = "top-product-by-profit";
const top_product_by_ros = "top-product-by-ros";
const top_product_by_net_revenue = "top-product-by-net-revenue";
const top_customer_by_debt_amount = "top-customer-by-debt-amount";
const top_customer_by_net_revenue = "top-customer-by-net-revenue";

const top_partner_by_debt_amount = "top-partner-by-debt-amount";
const top_partner_by_receipt_amount = "top-partner-by-receipt-amount";

const top_staff_by_net_revenue = "top-staff-by-net-revenue";
const staff_with_revenue = "staff-with-revenue";
const product_with_revenue = "product-with-revenue";
const customer_with_revenue = "customer-with-revenue";
const customer_with_debt_amount = "customer-with-debt-amount";

const product_with_io_inventory = "product-with-io-inventory";

const partner_with_debt_amount = "partner-with-debt-amount";
const partner_with_purchase_amount = "partner-with-purchase-amount";

const export_files = "export-files";

// NO AUTHORIZE

export const LOGIN = generatePathname([login]);
export const CHOICE = generatePathname([choices]);
export const PUBLIC_SETTING = generatePathname([settings]);
export const VERIFY_TOKEN = generatePathname([verify_token]);
export const REFRESH_TOKEN = generatePathname([refresh_token]);
export const CHANGE_PASSWORD = generatePathname([change_password]);

export const CHOICE_COUNTRY_DIVISION = generatePathname([choices, country_divisions]);
export const CHOICE_CONVERT_DIVISION = generatePathname([choices, convert_divisions]);

// AUTHORIZE

export const ME = generatePathnameWithAdmin([me]);
export const USER = generatePathnameWithAdmin([users]);
export const SETTING = generatePathnameWithAdmin([settings]);
export const PRODUCT = generatePathnameWithAdmin([products]);
export const CUSTOMER = generatePathnameWithAdmin([customers]);
export const PERMISSION = generatePathnameWithAdmin([permissions]);
export const ME_PERMISSION = generatePathnameWithAdmin([me, permissions]);
export const PRODUCT_TYPE = generatePathnameWithAdmin([products, types]);
export const USER_ADDRESS = generatePathnameWithAdmin([users, addresses]);

export const CUSTOMER_TYPE = generatePathnameWithAdmin([customers, types]);
export const CUSTOMER_DRAFT = generatePathnameWithAdmin([customers, drafts]);

export const CUSTOMER_ADDRESS = generatePathnameWithAdmin([customers, addresses]);

export const USER_PERMISSION = generatePathnameWithAdmin([users, permissions]);
export const PRODUCT_VARIANT = generatePathnameWithAdmin([products, variants]);
export const PRODUCT_CATEGORY = generatePathnameWithAdmin([products, categories]);
export const PRODUCT_ATTRIBUTE = generatePathnameWithAdmin([products, attributes]);
export const INVALID_CUSTOMER_DRAFT = generatePathnameWithAdmin([customers, drafts]);
export const CUSTOMER_DRAFT_ADDRESS = generatePathnameWithAdmin([
  customers,
  drafts,
  addresses,
]);
export const PRODUCT_ATTRIBUTE_OPTION = generatePathnameWithAdmin([
  products,
  attributes,
  options,
]);

export const PRODUCT_TYPE_PRODUCT_ATTRIBUTE = generatePathnameWithAdmin([
  products,
  types,
  product_attributes,
]);
export const PRODUCT_TYPE_PRODUCT_ATTRIBUTE_VALUE = generatePathnameWithAdmin([
  products,
  types,
  product_attributes,
  values,
]);
export const PRODUCT_TYPE_VARIANT_ATTRIBUTE = generatePathnameWithAdmin([
  products,
  types,
  variant_attributes,
]);
export const PRODUCT_TYPE_VARIANT_ATTRIBUTE_VALUE = generatePathnameWithAdmin([
  products,
  types,
  variant_attributes,
  values,
]);
export const PRODUCT_PRODUCT_CATEGORY = generatePathnameWithAdmin([
  products,
  product_categories,
]);
export const PRODUCT_IMAGE = generatePathnameWithAdmin([products, images]);
export const PRODUCT_VARIANT_IMAGE = generatePathnameWithAdmin([
  products,
  variants,
  images,
]);

export const PRODUCT_VARIANT_UNIT = generatePathnameWithAdmin([
  products,
  variants,
  units,
]);
export const WAREHOUSE = generatePathnameWithAdmin([warehouses]);
export const WAREHOUSE_RECORD = generatePathnameWithAdmin([warehouses, records]);
export const WAREHOUSE_ADDRESS = generatePathnameWithAdmin([warehouses, addresses]);
export const PARTNER = generatePathnameWithAdmin([partners]);

export const PARTNER_ADDRESS = generatePathnameWithAdmin([partners, addresses]);
export const PARTNER_ITEM = generatePathnameWithAdmin([partners, items]);
export const WAREHOUSE_OUT_NOTE = generatePathnameWithAdmin([warehouses, out_notes]);
export const WAREHOUSE_OUT_NOTE_LINE = generatePathnameWithAdmin([
  warehouses,
  out_notes,
  lines,
]);
export const WAREHOUSE_PURCHASE_ORDER = generatePathnameWithAdmin([
  warehouses,
  purchase_orders,
]);

export const WAREHOUSE_PURCHASE_ORDER_LINE = generatePathnameWithAdmin([
  warehouses,
  purchase_orders,
  lines,
]);
export const WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER = generatePathnameWithAdmin([
  warehouses,
  purchase_orders,
  receipt_orders,
]);
export const WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_QUANTITY = generatePathnameWithAdmin([
  warehouses,
  purchase_orders,
  receipt_orders,
  quantities,
]);
export const WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER =
  generatePathnameWithAdmin([warehouses, purchase_orders, receipt_orders, return_orders]);
export const WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER_QUANTITY =
  generatePathnameWithAdmin([
    warehouses,
    purchase_orders,
    receipt_orders,
    return_orders,
    quantities,
  ]);
export const CASH = generatePathnameWithAdmin([cash]);
export const CASH_DEBT_RECORD = generatePathnameWithAdmin([cash, debt_records]);
export const CASH_TRANSACTION = generatePathnameWithAdmin([cash, transactions]);
export const CASH_PAYMENT_METHOD = generatePathnameWithAdmin([cash, payment_methods]);
export const CASH_TRANSACTION_TYPE = generatePathnameWithAdmin([
  cash,
  transactions,
  types,
]);

export const ORDER = generatePathnameWithAdmin([orders]);
export const ORDER_SHIPPER = generatePathnameWithAdmin([orders, shippers]);
export const ORDER_SHIPPING_METHOD = generatePathnameWithAdmin([
  orders,
  shipping_methods,
]);
export const ORDER_PURCHASE_CHANNEL = generatePathnameWithAdmin([
  orders,
  purchase_channels,
]);
export const ORDER_BILLING_ADDRESS = generatePathnameWithAdmin([
  orders,
  billing_addresses,
]);
export const ORDER_SHIPPING_ADDRESS = generatePathnameWithAdmin([
  orders,
  shipping_addresses,
]);
export const ORDER_NOTE = generatePathnameWithAdmin([orders, notes]);
export const ORDER_LINE = generatePathnameWithAdmin([orders, lines]);
export const ORDER_INVOICE = generatePathnameWithAdmin([orders, invoices]);
export const ORDER_INVOICE_QUANTITY = generatePathnameWithAdmin([
  orders,
  invoices,
  quantities,
]);

export const DISCOUNT = generatePathnameWithAdmin([discounts]);
export const DISCOUNT_DISCOUNTED_CATEGORY = generatePathnameWithAdmin([
  discounts,
  discounted_categories,
]);
export const DISCOUNT_DISCOUNTED_PRODUCT = generatePathnameWithAdmin([
  discounts,
  discounted_products,
]);
export const DISCOUNT_DISCOUNTED_VARIANT = generatePathnameWithAdmin([
  discounts,
  discounted_variants,
]);
export const DISCOUNT_VOUCHER = generatePathnameWithAdmin([discounts, vouchers]);
export const DISCOUNT_VOUCHER_DISCOUNTED_CATEGORY = generatePathnameWithAdmin([
  discounts,
  vouchers,
  discounted_categories,
]);
export const DISCOUNT_VOUCHER_DISCOUNTED_PRODUCT = generatePathnameWithAdmin([
  discounts,
  vouchers,
  discounted_products,
]);
export const DISCOUNT_VOUCHER_DISCOUNTED_VARIANT = generatePathnameWithAdmin([
  discounts,
  vouchers,
  discounted_variants,
]);
export const REPORT_GENERAL_NET_REVENUE = generatePathnameWithAdmin([
  reports,
  general_net_revenue,
]);
export const REPORT_NET_REVENUE = generatePathnameWithAdmin([reports, net_revenue]);
export const REPORT_TOP_PRODUCT_BY_NET_REVENUE = generatePathnameWithAdmin([
  reports,
  top_product_by_net_revenue,
]);

export const REPORT_TOP_PRODUCT_BY_QUANTITY = generatePathnameWithAdmin([
  reports,
  top_product_by_quantity,
]);

export const REPORT_TOP_PRODUCT_BY_PROFIT = generatePathnameWithAdmin([
  reports,
  top_product_by_profit,
]);

export const REPORT_TOP_PRODUCT_BY_ROS = generatePathnameWithAdmin([
  reports,
  top_product_by_ros,
]);

export const REPORT_TOP_CUSTOMER_BY_DEBT_AMOUNT = generatePathnameWithAdmin([
  reports,
  top_customer_by_debt_amount,
]);

export const REPORT_TOP_CUSTOMER_BY_NET_REVENUE = generatePathnameWithAdmin([
  reports,
  top_customer_by_net_revenue,
]);

export const REPORT_TOP_PARTNER_BY_DEBT_AMOUNT = generatePathnameWithAdmin([
  reports,
  top_partner_by_debt_amount,
]);

export const REPORT_TOP_PARTNER_BY_RECEIPT_AMOUNT = generatePathnameWithAdmin([
  reports,
  top_partner_by_receipt_amount,
]);

export const REPORT_TOP_STAFF_BY_NET_REVENUE = generatePathnameWithAdmin([
  reports,
  top_staff_by_net_revenue,
]);

export const REPORT_STAFF_WITH_REVENUE = generatePathnameWithAdmin([
  reports,
  staff_with_revenue,
]);

export const REPORT_PRODUCT_WITH_REVENUE = generatePathnameWithAdmin([
  reports,
  product_with_revenue,
]);

export const REPORT_CUSTOMER_WITH_REVENUE = generatePathnameWithAdmin([
  reports,
  customer_with_revenue,
]);

export const REPORT_CUSTOMER_WITH_DEBT_AMOUNT = generatePathnameWithAdmin([
  reports,
  customer_with_debt_amount,
]);

export const REPORT_PRODUCT_WITH_IO_INVENTORY = generatePathnameWithAdmin([
  reports,
  product_with_io_inventory,
]);

export const REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE = generatePathnameWithAdmin([
  reports,
  product_with_io_inventory,
  warehouse,
]);

export const REPORT_CASH = generatePathnameWithAdmin([reports, cash]);

export const REPORT_REVENUE = generatePathnameWithAdmin([reports, revenue]);

export const REPORT_PARTNER_WITH_DEBT_AMOUNT = generatePathnameWithAdmin([
  reports,
  partner_with_debt_amount,
]);

export const REPORT_PARTNER_WITH_PURCHASE_AMOUNT = generatePathnameWithAdmin([
  reports,
  partner_with_purchase_amount,
]);

export const WARD = generatePathname([choices, country_divisions]);
export const PROVINCE = generatePathname([choices, country_divisions]);
export const DISTRICT = generatePathname([choices, country_divisions]);

export const EXPORT_FILE = generatePathnameWithAdmin([export_files], PREFIX_V2);
