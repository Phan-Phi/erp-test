const STRING_EXCLUDE_KEY = [
  "token",
  "csrf_token",
  "password",
  "confirm_password",
  "refresh_token",
  "list_id_values",
];

// "district",
// "province",
// "ward",

const OUT = [
  "ranking",
  "sort_order",
  "min_checkout_items_quantity",
  "low_stock_threshold",
  "usage_limit",
  "unit_quantity",
  "multiply",
  "quantity",
];

const NUMBER_EXCLUDE_KEY = [
  "primary",
  "attribute",
  "product_class",
  "order",
  "user",
  "line",
  "variant",
  "partner",
  "ranking",
  "product",
  "category",
  "warehouse",
  "recommendation",
  "channel",
  "source_id",
  "target_id",
  "payment_method",
  "type",
  "sale",
  "parent",
  "invoice",
  "stock_out_note",
  "record",
  "receiver",
  "voucher",
  "shipping_method",
  "shipper",
  "permission",
  "sales_in_charge",
];

// sales_in_charge

const TRANSFORM_NUMBER_TO_MIXED_TYPE_LIST = [
  "primary",
  "attribute",
  "product_class",
  "order",
  "user",
  "line",
  "variant",
  "partner",
  "ranking",
  "product",
  "category",
  "warehouse",
  "recommendation",
  "channel",
  "source_id",
  "target_id",
  "payment_method",
  "type",
  "sale",
  "parent",
  "invoice",
  "stock_out_note",
  "record",
  "receiver",
  "voucher",
  "shipping_method",
  "shipper",
  "permission",
  "sales_in_charge",
  "manager",
];

const PHONE_NUMBER_KEY_REG = /phone/g;
const NAME_KEY_REG = /name/g;
const NAME_LIST = [
  "first_name",
  "last_name",
  "name",
  "target_name",
  "company_name",
  "unit",
  "value",
  "receiver_name",
  "username",
];

const DESCRIPTION_KEY_REG = /(description|note|alt|)/g;
const DESCRIPTION_LIST = [
  "description",
  "note",
  "notes",
  "image_alt",
  "alt",
  "seo_title",
  "seo_description",
  "meta_title",
  "meta_description",
  "offer_description",
  "customer_notes",
  "contact_info",
];

const ADDRESS_KEY_REG = /(address|line)/g;
const ADDRESS_LIST = ["address", "line1", "line2"];

const PROVINCE_DISTRICT_WARD_LIST = ["province", "district", "ward"];

module.exports = {
  NUMBER_EXCLUDE_KEY,
  STRING_EXCLUDE_KEY,
  PHONE_NUMBER_KEY_REG,
  NAME_KEY_REG,
  ADDRESS_KEY_REG,
  DESCRIPTION_KEY_REG,
  NAME_LIST,
  DESCRIPTION_LIST,
  ADDRESS_LIST,
  PROVINCE_DISTRICT_WARD_LIST,
  TRANSFORM_NUMBER_TO_MIXED_TYPE_LIST,
};
