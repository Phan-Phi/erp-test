import { parseJSON, isValid, compareAsc } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  StringSchema,
  TestContext,
  object,
  string,
  number,
  mixed,
  array,
  TestConfig,
  boolean,
  NumberSchema,
  InferType,
} from "yup";
import { TransformFunction } from "yup/lib/types";

import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { MixedSchema } from "yup/lib/mixed";

function transformDecimal(value: any): TransformFunction<StringSchema> {
  return value === "" ? "0" : value;
}

function transformProvinceDistrictWard(value: any): TransformFunction<StringSchema> {
  if (!string().isType(value) && Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function transformObjectToId(value: any): TransformFunction<MixedSchema> {
  if (mixed().isType(value) && value != null && typeof value === "object") {
    return value.id;
  }

  return value;
}

const testPhoneNumber = {
  message: "Số điện thoại không hợp lệ",
  test(value: any) {
    if (!value) return false;

    const phoneNumber = parsePhoneNumber(value);

    if (!phoneNumber) return false;

    if (phoneNumber.country !== "VN") return false;

    if (!isValidPhoneNumber(phoneNumber.number)) return false;

    return true;
  },
};

const whenRequired = {
  is: true,
  then: (schema: StringSchema) => {
    return schema.required();
  },
};

const testFormat = (key: string, errMessage?: string): TestConfig => {
  return {
    message: "Không đúng định dạng",
    test: (value: any, context: TestContext) => {
      const { parent, createError } = context;
      const comparedPrice = parent[key] as string;
      const parsedComparedPrice = parseFloat(comparedPrice);
      const parsedPriceIncludeTax = parseFloat(value);
      if (isNaN(parsedComparedPrice) || isNaN(parsedPriceIncludeTax)) {
        if (errMessage)
          return createError({
            message: errMessage,
          });

        return false;
      }
      return true;
    },
  };
};

const testCompareValue = (key: string, errMessage?: string): TestConfig => {
  return {
    message: "Giá có thuế phải lớn hơn hoặc bằng giá chưa thuế",
    test: (value: any, context: TestContext) => {
      const { parent, createError } = context;

      const comparedPrice = parent[key] as string;

      const parsedComparedPrice = parseFloat(comparedPrice);
      const parsedPriceIncludeTax = parseFloat(value);

      if (parsedPriceIncludeTax < parsedComparedPrice) {
        if (errMessage)
          return createError({
            message: errMessage,
          });

        return false;
      }

      return true;
    },
  };
};

const testFormatDate: TestConfig = {
  test(value: any, context: TestContext) {
    const date = parseJSON(new Date(value));

    if (!isValid(date)) return false;

    return true;
  },
  message: "Không đúng định dạng",
};

const testCompareDate = (key: string, errMessage?: string): TestConfig => {
  return {
    test(value: any, context: TestContext) {
      const { parent, createError } = context;

      const dateStart = parseJSON(parent[key] ?? "");
      const dateEnd = value;

      if (dateEnd == null) return true;

      if (compareAsc(parseJSON(dateEnd).getTime(), parseJSON(dateStart).getTime()) >= 0) {
        return true;
      } else {
        return createError({
          message: "Ngày kết thúc phải sau ngày bắt đầu",
        });
      }
    },
    message: "Ngày kết thúc phải sau ngày bắt đầu",
  };
};
export const ADMIN_EXPORT_FILES_POST_YUP_SCHEMA = object({}).shape({
  type: string().required().oneOf(["Invoice_quantity", "Transaction", "Debt_record"]),
  file_ext: string().required().oneOf([".csv", ".xlsx"]),
  field_options: array()
    .notRequired()
    .of(
      string().oneOf([
        "Order_sid",
        "Order_status",
        "Order_channel_name",
        "Order_shipping_method_name",
        "Order_customer_notes",
        "Order_owner_name",
        "Order_owner_phone_number",
        "Order_owner_email",
        "Invoice_sid",
        "Invoice_date_created",
        "Invoice_status",
        "Order_receiver_name",
        "Order_receiver_phone_number",
        "Order_receiver_email",
        "Shipping_address_address",
        "Billing_address_address",
        "Invoice_quantity_amount_before_discounts",
        "Invoice_quantity_amount_before_discounts_incl_tax",
        "Invoice_amount_before_discounts",
        "Invoice_amount_before_discounts_incl_tax",
        "Invoice_discount_amount",
        "Invoice_discount_amount_incl_tax",
        "Invoice_surcharge",
        "Invoice_shipping_incl_tax",
        "Invoice_shipping_excl_tax",
        "Invoice_cod",
        "Invoice_shipping_status",
        "Invoice_shipping_name",
        "Invoice_owner_name",
        "Invoice_owner_phone_number",
        "Invoice_owner_email",
        "Line_variant_sku",
        "Variant_editable_sku",
        "Line_variant_name",
        "Line_variant_unit",
        "Invoice_quantity_unit_quantity",
        "Line_variant_unit_price_excl_tax",
        "Line_variant_unit_price_incl_tax",
        "Invoice_quantity_amount",
        "Invoice_quantity_amount_incl_tax",
        "Line_variant_unit_weight",
        "Invoice_quantity_weight",
        "Invoice_quantity_warehouse_name",
        "Line_variant_unit_price_before_discounts_excl_tax",
        "Line_variant_unit_price_before_discounts_incl_tax",
        "Invoice_amount",
        "Invoice_amount_incl_tax",
        "Invoice_base_amount",
        "Invoice_base_amount_incl_tax",
        "Invoice_merge_profit_amount",
        "Invoice_merge_profit_amount_incl_tax",
        "Transaction_sid",
        "Transaction_owner_name",
        "Transaction_owner_email",
        "Transaction_owner_phone_number",
        "Transaction_status",
        "Transaction_notes",
        "Transaction_address",
        "Transaction_date_created",
        "Transaction_directed_amount",
        "Transaction_target_name",
        "Transaction_payment_method_name",
        "Transaction_affect_creditor",
        "Type_name",
        "Source_sid",
      ])
    ),
  date_start: string()
    .default("2023-09-10T19:44:15.070394+07:00")
    .nullable()
    .test(testFormatDate)
    .notRequired(),
  date_end: string()
    .default("2023-09-11T19:44:15.071185+07:00")
    .nullable()
    .test(testFormatDate)
    .test(testCompareDate("date_start"))
    .notRequired(),
  customer: string().nullable().notRequired(),
});

export const ADMIN_EXPORT_FILES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_EXPORT_FILES_POST_YUP_SCHEMA
);

export type ADMIN_EXPORT_FILES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_EXPORT_FILES_POST_YUP_SCHEMA
>;

export const CHANGE_PASSWORD_POST_YUP_SCHEMA = object({}).shape({
  password: string().required().min(8).max(128),
  confirm_password: string().required().min(1),
});

export const CHANGE_PASSWORD_POST_YUP_RESOLVER = yupResolver(
  CHANGE_PASSWORD_POST_YUP_SCHEMA
);

export type CHANGE_PASSWORD_POST_YUP_SCHEMA_TYPE = InferType<
  typeof CHANGE_PASSWORD_POST_YUP_SCHEMA
>;

export const LOGIN_POST_YUP_SCHEMA = object({}).shape({
  username: string().required().min(1).max(255),
  password: string().required().min(1).max(128),
});

export const LOGIN_POST_YUP_RESOLVER = yupResolver(LOGIN_POST_YUP_SCHEMA);

export type LOGIN_POST_YUP_SCHEMA_TYPE = InferType<typeof LOGIN_POST_YUP_SCHEMA>;

export const REFRESH_TOKEN_POST_YUP_SCHEMA = object({}).shape({
  refresh_token: string().required().min(1),
  csrf_token: string().required().min(1),
});

export const REFRESH_TOKEN_POST_YUP_RESOLVER = yupResolver(REFRESH_TOKEN_POST_YUP_SCHEMA);

export type REFRESH_TOKEN_POST_YUP_SCHEMA_TYPE = InferType<
  typeof REFRESH_TOKEN_POST_YUP_SCHEMA
>;

export const VERIFY_TOKEN_POST_YUP_SCHEMA = object({}).shape({
  token: string().required().min(1),
});

export const VERIFY_TOKEN_POST_YUP_RESOLVER = yupResolver(VERIFY_TOKEN_POST_YUP_SCHEMA);

export type VERIFY_TOKEN_POST_YUP_SCHEMA_TYPE = InferType<
  typeof VERIFY_TOKEN_POST_YUP_SCHEMA
>;

export const ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA = object({}).shape({
  name: string().required().min(1).max(255),
  description: string().notRequired(),
});

export const ADMIN_CASH_PAYMENT_METHODS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA
);

export type ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA
>;

export const ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA = object({}).shape({
  status: string().default("Draft").notRequired().oneOf(["Draft", "Confirmed"]),
  source_type: string()
    .nullable()
    .notRequired()
    .oneOf(["stock.receiptorder", "stock.stockoutnote", "order.invoice"]),
  target_type: string()
    .nullable()
    .notRequired()
    .oneOf(["partner.partner", "customer.customer"]),
  flow_type: string().notRequired().oneOf(["Cash_out", "Cash_in"]),
  notes: string().notRequired(),
  address: string().notRequired(),
  amount: string().transform(transformDecimal).required(),
  source_id: mixed().notRequired().nullable().transform(transformObjectToId),
  target_id: mixed().notRequired().nullable().transform(transformObjectToId),
  target_name: string().notRequired().max(255),
  affect_creditor: boolean().notRequired(),
  type: mixed().notRequired().nullable().transform(transformObjectToId),
  payment_method: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA
);

export type ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA
>;

export const ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA = object({}).shape({
  name: string().required().min(1).max(100),
  is_business_activity: boolean().notRequired(),
  description: string().notRequired(),
});

export const ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA
);

export type ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA = object({}).shape({
  avatar: mixed().nullable().notRequired(),
  email: string().email().nullable().notRequired().max(254),
  main_phone_number: string().nullable().notRequired().max(128).test(testPhoneNumber),
  first_name: string().notRequired().max(128),
  last_name: string().notRequired().max(128),
  note: string().notRequired(),
  birthday: string().nullable().test(testFormatDate).nullable().notRequired(),
  gender: string().notRequired().oneOf(["Male", "Female", "Other"]),
  facebook: string().url().notRequired().max(200),
  tax_identification_number: string().nullable().notRequired().max(20),
  company_name: string().notRequired().max(255),
  in_business: boolean().notRequired(),
  type: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_CUSTOMERS_DRAFTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA = object({}).shape({
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().max(128).test(testPhoneNumber),
  notes: string().notRequired(),
  is_default_for_shipping: boolean().notRequired(),
  is_default_for_shipping_ecom: boolean().notRequired(),
  is_default_for_billing: boolean().notRequired(),
  country: string().notRequired().oneOf(["VN"]),
  user: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_SCHEMA = object({}).shape({
  token: string().required().min(1),
});

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_SCHEMA = object({}).shape({
  token: string().required().min(1),
});

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA = object({}).shape({
  name: string().required().min(1).max(255),
  description: string().notRequired(),
  parent: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_POST_YUP_SCHEMA = object({}).shape({
  name: string().required().min(1).max(255),
  date_start: string().nullable().test(testFormatDate).notRequired(),
  date_end: string()
    .nullable()
    .test(testFormatDate)
    .test(testCompareDate("date_start"))
    .nullable()
    .notRequired(),
});

export const ADMIN_DISCOUNTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_POST_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_POST_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA = object({}).shape({
  category: mixed().notRequired().nullable().transform(transformObjectToId),
  discount_type: string().notRequired().oneOf(["Percentage", "Absolute"]),
  discount_amount: string().transform(transformDecimal).notRequired(),
  usage_limit: number().nullable().notRequired().max(2147483647),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  sale: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA = object({}).shape({
  type: string()
    .notRequired()
    .oneOf(["Entire_order", "Shipping", "Specific_product_variant"]),
  name: string().required().min(1).max(255),
  code: string().required().min(1).max(255),
  description: string().notRequired(),
  usage_limit: number().nullable().notRequired().max(2147483647),
  date_start: string().nullable().test(testFormatDate).notRequired(),
  date_end: string()
    .nullable()
    .test(testFormatDate)
    .test(testCompareDate("date_start"))
    .nullable()
    .notRequired(),
  apply_once_per_order: boolean().notRequired(),
  apply_once_per_customer: boolean().notRequired(),
  discount_type: string().notRequired().oneOf(["Percentage", "Absolute"]),
  discount_amount: string().transform(transformDecimal).notRequired(),
  min_spent_amount: string().transform(transformDecimal).notRequired(),
  min_checkout_items_quantity: number().notRequired().max(2147483647),
});

export const ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA = object(
  {}
).shape({
  category: mixed().notRequired().nullable().transform(transformObjectToId),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  voucher: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_POST_YUP_SCHEMA = object({}).shape({
  receiver: mixed().notRequired().nullable().transform(transformObjectToId),
  receiver_name: string().notRequired().max(256),
  receiver_email: string().email().notRequired().max(254),
  receiver_phone_number: string().nullable().notRequired().max(128).test(testPhoneNumber),
  status: string().default("Draft").notRequired().oneOf(["Draft"]),
  customer_notes: string().notRequired(),
  channel: mixed().notRequired().nullable().transform(transformObjectToId),
  shipping_method: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_ORDERS_POST_YUP_RESOLVER = yupResolver(ADMIN_ORDERS_POST_YUP_SCHEMA);

export type ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_SCHEMA = object({}).shape({
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  country: string().notRequired().oneOf(["VN"]),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().max(128).test(testPhoneNumber),
  notes: string().notRequired(),
});

export const ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA = object({}).shape({
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  status: string().default("Draft").notRequired().oneOf(["Draft"]),
  shipping_status: string().default("Pending").notRequired().oneOf(["Pending"]),
  cod: boolean().notRequired(),
  shipping_incl_tax: string()
    .transform(transformDecimal)
    .notRequired()
    .when("shipping_excl_tax", whenRequired)
    .test(testFormat("shipping_excl_tax"))
    .test(testCompareValue("shipping_excl_tax")),
  shipping_excl_tax: string().transform(transformDecimal).notRequired(),
  surcharge: string().transform(transformDecimal).notRequired(),
  shipper: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_ORDERS_INVOICES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_SCHEMA = object({}).shape({
  line: mixed().notRequired().nullable().transform(transformObjectToId),
  invoice: mixed().notRequired().nullable().transform(transformObjectToId),
  unit_quantity: number().notRequired().max(2147483647),
  record: mixed().notRequired().nullable().transform(transformObjectToId),
  warehouse: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_LINES_POST_YUP_SCHEMA = object({}).shape({
  discount_type: string().notRequired().oneOf(["Percentage", "Absolute"]),
  discount_amount: string().transform(transformDecimal).notRequired(),
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  unit: string().notRequired().max(128),
  unit_quantity: number().notRequired().min(1).max(2147483647),
});

export const ADMIN_ORDERS_LINES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_LINES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_LINES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_LINES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA = object({}).shape({
  name: string().required().min(1).max(255),
  description: string().notRequired(),
});

export const ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA = object({}).shape({
  user: mixed().notRequired().nullable().transform(transformObjectToId),
  name: string().required().min(1).max(128),
});

export const ADMIN_ORDERS_SHIPPERS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_SCHEMA = object({}).shape({
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  country: string().notRequired().oneOf(["VN"]),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().max(128).test(testPhoneNumber),
  notes: string().notRequired(),
});

export const ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA = object({}).shape({
  name: string().required().min(1).max(128),
  type: string().required().oneOf(["Price", "Weight"]),
  price: string().transform(transformDecimal).notRequired(),
  price_incl_tax: string()
    .transform(transformDecimal)
    .notRequired()
    .when("price", whenRequired)
    .test(testFormat("price"))
    .test(testCompareValue("price")),
  minimum_order_price: string().transform(transformDecimal).notRequired(),
  maximum_order_price: string().transform(transformDecimal).nullable().notRequired(),
  minimum_order_weight: number().notRequired(),
  maximum_order_weight: number()
    .nullable()
    .notRequired()
    .test(testFormat("minimum_order_weight"))
    .test(
      testCompareValue(
        "minimum_order_weight",
        "Kh\u1ED1i l\u01B0\u1EE3ng t\u1ED1i \u0111a ph\u1EA3i l\u1EDBn h\u01A1n ho\u1EB7c b\u1EB1ng kh\u1ED1i l\u01B0\u1EE3ng t\u1ED1i thi\u1EC3u"
      )
    ),
});

export const ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA
>;

export const ADMIN_PARTNERS_POST_YUP_SCHEMA = object({}).shape({
  max_debt: string().transform(transformDecimal).notRequired(),
  name: string().required().min(1).max(255),
  tax_identification_number: string().nullable().notRequired().max(20),
  notes: string().notRequired(),
  email: string().email().notRequired().max(254),
  contact_info: string().notRequired(),
});

export const ADMIN_PARTNERS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PARTNERS_POST_YUP_SCHEMA
);

export type ADMIN_PARTNERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PARTNERS_POST_YUP_SCHEMA
>;

export const ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA = object({}).shape({
  phone_number: string().notRequired().max(128).test(testPhoneNumber),
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  country: string().notRequired().oneOf(["VN"]),
  partner: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_PARTNERS_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_PARTNERS_ITEMS_POST_YUP_SCHEMA = object({}).shape({
  partner_sku: string().required().min(1).max(255),
  price: string().transform(transformDecimal).notRequired(),
  price_incl_tax: string()
    .transform(transformDecimal)
    .notRequired()
    .when("price", whenRequired)
    .test(testFormat("price"))
    .test(testCompareValue("price")),
  partner: mixed().notRequired().nullable().transform(transformObjectToId),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_PARTNERS_ITEMS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PARTNERS_ITEMS_POST_YUP_SCHEMA
);

export type ADMIN_PARTNERS_ITEMS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PARTNERS_ITEMS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_POST_YUP_SCHEMA = object({}).shape({
  is_published: boolean().notRequired(),
  publication_date: string()
    .default("2023-09-11T19:44:04.873118+07:00")
    .nullable()
    .test(testFormatDate)
    .notRequired(),
  available_for_purchase: string()
    .default("2023-09-11T19:44:04.873868+07:00")
    .nullable()
    .test(testFormatDate)
    .notRequired(),
  product_class: mixed().notRequired().nullable().transform(transformObjectToId),
  meta_title: string().notRequired().max(255),
  meta_description: string().notRequired(),
  seo_title: string().notRequired().max(70),
  seo_description: string().notRequired().max(300),
  name: string().required().min(1).max(250),
  description: string().notRequired(),
});

export const ADMIN_PRODUCTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_SCHEMA = object({}).shape({
  input_type: string().required().oneOf(["Option", "Multi_option"]),
  name: string().required().min(1).max(255),
  is_variant_only: boolean().notRequired(),
});

export const ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_SCHEMA = object({}).shape({
  name: string().required().min(1).max(250),
  value: string().required().min(1).max(100),
  attribute: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_CATEGORIES_POST_YUP_SCHEMA = object({}).shape({
  parent: mixed().notRequired().nullable().transform(transformObjectToId),
  name: string().required().min(1).max(250),
  description: string().notRequired(),
  image: mixed().nullable().notRequired(),
  image_alt: string().notRequired().max(128),
});

export const ADMIN_PRODUCTS_CATEGORIES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_CATEGORIES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_CATEGORIES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_CATEGORIES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_IMAGES_POST_YUP_SCHEMA = object({}).shape({
  image: mixed().required(),
  sort_order: number().nullable().notRequired().max(2147483647),
  alt: string().notRequired().max(128),
  product: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_PRODUCTS_IMAGES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_IMAGES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_IMAGES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_IMAGES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_SCHEMA = object({}).shape({
  category: mixed().notRequired().nullable().transform(transformObjectToId),
  product: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_SCHEMA = object({}).shape({
  ranking: mixed().notRequired().nullable().transform(transformObjectToId),
  primary: mixed().notRequired().nullable().transform(transformObjectToId),
  recommendation: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA = object({}).shape({
  name: string().required().min(1).max(250),
  tax_rate: string().transform(transformDecimal).notRequired(),
  has_variants: boolean().notRequired(),
});

export const ADMIN_PRODUCTS_TYPES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_SCHEMA = object({}).shape({
  attribute: mixed().notRequired().nullable().transform(transformObjectToId),
  product_class: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_SCHEMA = object({}).shape({
  attribute: mixed().notRequired().nullable().transform(transformObjectToId),
  product_class: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA = object({}).shape({
  track_inventory: boolean().notRequired(),
  is_default: boolean().notRequired(),
  product: mixed().notRequired().nullable().transform(transformObjectToId),
  editable_sku: string().notRequired().min(1).max(255),
  unit: string().required().min(1).max(100),
  weight: number().notRequired(),
  bar_code: string().notRequired().max(100),
  name: string().notRequired().max(255),
  price_incl_tax: string().transform(transformDecimal).notRequired(),
  list_id_values: string().notRequired().min(1),
});

export const ADMIN_PRODUCTS_VARIANTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_SCHEMA = object({}).shape({
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  image: number().required(),
});

export const ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA = object({}).shape({
  editable_sku: string().notRequired().min(1).max(255),
  unit: string().required().min(1).max(100),
  multiply: number().notRequired().min(1).max(2147483647),
  weight: number().notRequired(),
  bar_code: string().notRequired().max(100),
  price_incl_tax: string().transform(transformDecimal).notRequired(),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA
>;

export const ADMIN_USERS_POST_YUP_SCHEMA = object({}).shape({
  avatar: mixed().nullable().notRequired(),
  username: string().nullable().notRequired().max(255),
  email: string().email().nullable().notRequired().max(254),
  main_phone_number: string().nullable().notRequired().max(128).test(testPhoneNumber),
  first_name: string().notRequired().max(128),
  last_name: string().notRequired().max(128),
  note: string().notRequired(),
  birthday: string().nullable().test(testFormatDate).nullable().notRequired(),
  gender: string().notRequired().oneOf(["Male", "Female", "Other"]),
  facebook: string().url().notRequired().max(200),
  is_staff: boolean().notRequired(),
  is_active: boolean().notRequired(),
});

export const ADMIN_USERS_POST_YUP_RESOLVER = yupResolver(ADMIN_USERS_POST_YUP_SCHEMA);

export type ADMIN_USERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_POST_YUP_SCHEMA
>;

export const ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA = object({}).shape({
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().max(128).test(testPhoneNumber),
  notes: string().notRequired(),
  is_default_for_shipping: boolean().notRequired(),
  is_default_for_billing: boolean().notRequired(),
  country: string().notRequired().oneOf(["VN"]),
  user: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_USERS_PERMISSIONS_POST_YUP_SCHEMA = object({}).shape({
  user: mixed().notRequired().nullable().transform(transformObjectToId),
  permission: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_USERS_PERMISSIONS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_USERS_PERMISSIONS_POST_YUP_SCHEMA
);

export type ADMIN_USERS_PERMISSIONS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_PERMISSIONS_POST_YUP_SCHEMA
>;

export const ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_SCHEMA = object({}).shape({
  token: string().required().min(1),
});

export const ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_RESOLVER = yupResolver(
  ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_SCHEMA
);

export type ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_POST_YUP_SCHEMA = object({}).shape({
  name: string().required().min(1).max(255),
  manager: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_WAREHOUSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA = object({}).shape({
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  country: string().notRequired().oneOf(["VN"]),
  warehouse: mixed().notRequired().nullable().transform(transformObjectToId),
  phone_number: string().notRequired().max(128).test(testPhoneNumber),
});

export const ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA = object({}).shape({
  status: string().default("Draft").notRequired().oneOf(["Draft", "Confirmed"]),
  shipping_incl_tax: string()
    .transform(transformDecimal)
    .notRequired()
    .when("shipping_excl_tax", whenRequired)
    .test(testFormat("shipping_excl_tax"))
    .test(testCompareValue("shipping_excl_tax")),
  shipping_excl_tax: string().transform(transformDecimal).notRequired(),
  amount: string().transform(transformDecimal).notRequired(),
  amount_incl_tax: string()
    .transform(transformDecimal)
    .notRequired()
    .when("amount", whenRequired)
    .test(testFormat("amount"))
    .test(testCompareValue("amount")),
  notes: string().notRequired(),
  warehouse: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA = object({}).shape({
  unit: string().nullable().notRequired().min(1),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  record: mixed().notRequired().nullable().transform(transformObjectToId),
  stock_out_note: mixed().notRequired().nullable().transform(transformObjectToId),
  unit_quantity: number().notRequired().min(1).max(2147483647),
});

export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA = object({}).shape({
  status: string().default("Draft").notRequired().oneOf(["Draft"]),
  notes: string().notRequired(),
  warehouse: mixed().notRequired().nullable().transform(transformObjectToId),
  partner: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_SCHEMA = object({}).shape({
  discount_type: string().notRequired().oneOf(["Percentage", "Absolute"]),
  discount_amount: string().transform(transformDecimal).notRequired(),
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  quantity: number().notRequired().min(1).max(2147483647),
  offer_description: string().notRequired(),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
});

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_SCHEMA = object(
  {}
).shape({
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  status: string().default("Draft").notRequired().oneOf(["Draft"]),
  surcharge: string().transform(transformDecimal).notRequired(),
  notes: string().notRequired(),
});

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_RESOLVER =
  yupResolver(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_SCHEMA);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_SCHEMA_TYPE =
  InferType<typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_SCHEMA>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_SCHEMA =
  object({}).shape({
    order: mixed().notRequired().nullable().transform(transformObjectToId),
    line: mixed().notRequired().nullable().transform(transformObjectToId),
    expiration_date: string().nullable().test(testFormatDate).notRequired(),
    notes: string().notRequired(),
    quantity: number().notRequired().min(1).max(2147483647),
  });

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_RESOLVER =
  yupResolver(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_SCHEMA);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_SCHEMA
  >;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA =
  object({}).shape({
    order: mixed().notRequired().nullable().transform(transformObjectToId),
    status: string().default("Draft").notRequired().oneOf(["Draft"]),
    surcharge: string().transform(transformDecimal).notRequired(),
    notes: string().notRequired(),
  });

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_RESOLVER =
  yupResolver(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA
  );

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA
  >;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_SCHEMA =
  object({}).shape({
    order: mixed().notRequired().nullable().transform(transformObjectToId),
    receipt_order_quantity: number().required(),
    quantity: number().notRequired().min(1).max(2147483647),
  });

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_RESOLVER =
  yupResolver(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_SCHEMA
  );

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_SCHEMA
  >;
