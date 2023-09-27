const EMPTY_LIST = ["username"];
const NULL_LIST = [];
const UNDEFINED_LIST = [];

const MIXED_LIST = [
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

// "discount_type",
// "file_ext",
// "status",
// "source_type",
// "target_type",
// "flow_type",
// "gender",
// "input_type",

const PHONE_NUMBER_KEY_REG = /phone/g;
const NAME_KEY_REG = /name/g;

const DESCRIPTION_KEY_REG = /(description|note|alt|title|contact_info)/g;
const ADDRESS_KEY_REG = /(address|line)/g;
const PROVINCE_DISTRICT_WARD_LIST = ["province", "district", "ward"];

module.exports = {
  PHONE_NUMBER_KEY_REG,
  NAME_KEY_REG,
  ADDRESS_KEY_REG,
  DESCRIPTION_KEY_REG,
  PROVINCE_DISTRICT_WARD_LIST,
  EMPTY_LIST,
  NULL_LIST,
  MIXED_LIST,
  UNDEFINED_LIST,
};
