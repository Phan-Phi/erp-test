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
  setLocale,
} from "yup";
import { TransformFunction } from "yup/lib/types";

import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { MixedSchema } from "yup/lib/mixed";

setLocale({
  string: {
    min: (params) => {
      return `Trường này ít nhất ${params.min} kí tự`;
    },
    email: () => {
      return "Không đúng định dạng email";
    },
  },
  mixed: {
    required(params) {
      return "Trường này không được bỏ trống";
    },
  },
});

function transformDecimal(value: any): TransformFunction<StringSchema> {
  return value === "" ? "0" : value;
}

function transformProvinceDistrictWard(value: any): TransformFunction<StringSchema> {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function transformArrayToString(value: any): TransformFunction<StringSchema> {
  if (Array.isArray(value)) {
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
    if (!value) return true;

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

const testConfirmPassword = {
  test(value: any, context: TestContext) {
    const { parent } = context;

    const password: string = parent.password ?? "";

    if (value !== password) return false;

    return true;
  },
  message: "Mật khẩu xác nhận không trùng khớp",
};

const testEmptyString = {
  test(value: any, context: TestContext) {
    if (value == "") return false;
    return true;
  },
  message: "Trường này không được để trống",
};
export const ADMIN_EXPORT_FILES_POST_SHAPE = {
  type: mixed().nullable().notRequired().test(testEmptyString),
  file_ext: mixed()
    .notRequired()
    .oneOf(["", ".csv", ".xlsx"])
    .transform(transformArrayToString),
  field_options: array(
    string()
      .required()
      .oneOf([
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
  )
    .required()
    .default([]),
  date_start: mixed().nullable().test(testFormatDate),
  date_end: mixed().nullable().test(testFormatDate).test(testCompareDate("date_start")),
  customer: string().nullable().notRequired(),
};

export const ADMIN_EXPORT_FILES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_EXPORT_FILES_POST_SHAPE
);

export const ADMIN_EXPORT_FILES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_EXPORT_FILES_POST_YUP_SCHEMA
);

export type ADMIN_EXPORT_FILES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_EXPORT_FILES_POST_YUP_SCHEMA
>;

export const CHANGE_PASSWORD_POST_SHAPE = {
  password: string().required().min(8).max(128),
  confirm_password: string().required().min(1).test(testConfirmPassword),
};

export const CHANGE_PASSWORD_POST_YUP_SCHEMA = object({}).shape(
  CHANGE_PASSWORD_POST_SHAPE
);

export const CHANGE_PASSWORD_POST_YUP_RESOLVER = yupResolver(
  CHANGE_PASSWORD_POST_YUP_SCHEMA
);

export type CHANGE_PASSWORD_POST_YUP_SCHEMA_TYPE = InferType<
  typeof CHANGE_PASSWORD_POST_YUP_SCHEMA
>;

export const LOGIN_POST_SHAPE = {
  username: string().required().min(1).max(255),
  password: string().required().min(1).max(128),
};

export const LOGIN_POST_YUP_SCHEMA = object({}).shape(LOGIN_POST_SHAPE);

export const LOGIN_POST_YUP_RESOLVER = yupResolver(LOGIN_POST_YUP_SCHEMA);

export type LOGIN_POST_YUP_SCHEMA_TYPE = InferType<typeof LOGIN_POST_YUP_SCHEMA>;

export const REFRESH_TOKEN_POST_SHAPE = {
  refresh_token: string().required().min(1),
  csrf_token: string().required().min(1),
};

export const REFRESH_TOKEN_POST_YUP_SCHEMA = object({}).shape(REFRESH_TOKEN_POST_SHAPE);

export const REFRESH_TOKEN_POST_YUP_RESOLVER = yupResolver(REFRESH_TOKEN_POST_YUP_SCHEMA);

export type REFRESH_TOKEN_POST_YUP_SCHEMA_TYPE = InferType<
  typeof REFRESH_TOKEN_POST_YUP_SCHEMA
>;

export const VERIFY_TOKEN_POST_SHAPE = {
  token: string().required().min(1),
};

export const VERIFY_TOKEN_POST_YUP_SCHEMA = object({}).shape(VERIFY_TOKEN_POST_SHAPE);

export const VERIFY_TOKEN_POST_YUP_RESOLVER = yupResolver(VERIFY_TOKEN_POST_YUP_SCHEMA);

export type VERIFY_TOKEN_POST_YUP_SCHEMA_TYPE = InferType<
  typeof VERIFY_TOKEN_POST_YUP_SCHEMA
>;

export const ADMIN_CASH_PAYMENT_METHODS_POST_SHAPE = {
  name: string().required().min(1).max(255),
  description: string().notRequired(),
};

export const ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_CASH_PAYMENT_METHODS_POST_SHAPE
);

export const ADMIN_CASH_PAYMENT_METHODS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA
);

export type ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA
>;

export const ADMIN_CASH_TRANSACTIONS_POST_SHAPE = {
  status: mixed()
    .notRequired()
    .oneOf(["", "Draft", "Confirmed"])
    .transform(transformArrayToString),
  source_type: mixed()
    .notRequired()
    .oneOf(["", "stock.receiptorder", "stock.stockoutnote", "order.invoice"])
    .transform(transformArrayToString),
  target_type: mixed()
    .notRequired()
    .oneOf(["", "partner.partner", "customer.customer"])
    .transform(transformArrayToString),
  flow_type: mixed()
    .notRequired()
    .oneOf(["", "Cash_out", "Cash_in"])
    .transform(transformArrayToString),
  notes: string().notRequired(),
  address: string().notRequired(),
  amount: string().required().transform(transformDecimal),
  source_id: mixed().notRequired().nullable().transform(transformObjectToId),
  target_id: mixed().notRequired().nullable().transform(transformObjectToId),
  target_name: string().notRequired().max(255),
  affect_creditor: boolean().notRequired(),
  type: mixed().notRequired().nullable().transform(transformObjectToId),
  payment_method: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_CASH_TRANSACTIONS_POST_SHAPE
);

export const ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA
);

export type ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA
>;

export const ADMIN_CASH_TRANSACTIONS_TYPES_POST_SHAPE = {
  name: string().required().min(1).max(100),
  is_business_activity: boolean().notRequired(),
  description: string().notRequired(),
};

export const ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_CASH_TRANSACTIONS_TYPES_POST_SHAPE
);

export const ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA
);

export type ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_POST_SHAPE = {
  avatar: mixed().nullable().notRequired(),
  email: string().nullable().notRequired().max(254).email(),
  main_phone_number: string().notRequired().test(testPhoneNumber),
  first_name: string().notRequired().max(128),
  last_name: string().notRequired().max(128),
  note: string().notRequired(),
  birthday: mixed().nullable().test(testFormatDate),
  gender: mixed()
    .notRequired()
    .oneOf(["", "Male", "Female", "Other"])
    .transform(transformArrayToString),
  facebook: string().notRequired().max(200).url(),
  tax_identification_number: string().nullable().notRequired().max(20),
  company_name: string().notRequired().max(255),
  in_business: boolean().notRequired(),
  type: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_CUSTOMERS_DRAFTS_POST_SHAPE
);

export const ADMIN_CUSTOMERS_DRAFTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_SHAPE = {
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().test(testPhoneNumber),
  notes: string().notRequired(),
  is_default_for_shipping: boolean().notRequired(),
  is_default_for_shipping_ecom: boolean().notRequired(),
  is_default_for_billing: boolean().notRequired(),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  user: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_SHAPE
);

export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_SHAPE = {
  token: string().required().min(1),
};

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_SHAPE
);

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_SHAPE = {
  token: string().required().min(1),
};

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_SHAPE
);

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_TYPES_POST_SHAPE = {
  name: string().required().min(1).max(255),
  description: string().notRequired(),
  parent: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_CUSTOMERS_TYPES_POST_SHAPE
);

export const ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_POST_SHAPE = {
  name: string().required().min(1).max(255),
  date_start: mixed().nullable().test(testFormatDate),
  date_end: mixed().nullable().test(testFormatDate).test(testCompareDate("date_start")),
};

export const ADMIN_DISCOUNTS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_DISCOUNTS_POST_SHAPE
);

export const ADMIN_DISCOUNTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_POST_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_POST_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_SHAPE = {
  category: mixed().notRequired().nullable().transform(transformObjectToId),
  discount_type: mixed()
    .notRequired()
    .oneOf(["", "Percentage", "Absolute"])
    .transform(transformArrayToString),
  discount_amount: string().notRequired().transform(transformDecimal),
  usage_limit: number().nullable().notRequired().max(2147483647),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  sale: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_SHAPE
);

export const ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_VOUCHERS_POST_SHAPE = {
  type: mixed().nullable().notRequired().test(testEmptyString),
  name: string().required().min(1).max(255),
  code: string().required().min(1).max(255),
  description: string().notRequired(),
  usage_limit: number().nullable().notRequired().max(2147483647),
  date_start: mixed().nullable().test(testFormatDate),
  date_end: mixed().nullable().test(testFormatDate).test(testCompareDate("date_start")),
  apply_once_per_order: boolean().notRequired(),
  apply_once_per_customer: boolean().notRequired(),
  discount_type: mixed()
    .notRequired()
    .oneOf(["", "Percentage", "Absolute"])
    .transform(transformArrayToString),
  discount_amount: string().notRequired().transform(transformDecimal),
  min_spent_amount: string().notRequired().transform(transformDecimal),
  min_checkout_items_quantity: number().notRequired().max(2147483647),
};

export const ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_DISCOUNTS_VOUCHERS_POST_SHAPE
);

export const ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_SHAPE = {
  category: mixed().notRequired().nullable().transform(transformObjectToId),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  voucher: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA = object(
  {}
).shape(ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_SHAPE);

export const ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_POST_SHAPE = {
  receiver: mixed().notRequired().nullable().transform(transformObjectToId),
  receiver_name: string().notRequired().max(256),
  receiver_email: string().notRequired().max(254).email(),
  receiver_phone_number: string().notRequired().test(testPhoneNumber),
  status: mixed().notRequired().oneOf(["", "Draft"]).transform(transformArrayToString),
  customer_notes: string().notRequired(),
  channel: mixed().notRequired().nullable().transform(transformObjectToId),
  shipping_method: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_ORDERS_POST_YUP_SCHEMA = object({}).shape(ADMIN_ORDERS_POST_SHAPE);

export const ADMIN_ORDERS_POST_YUP_RESOLVER = yupResolver(ADMIN_ORDERS_POST_YUP_SCHEMA);

export type ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_BILLING_ADDRESSES_POST_SHAPE = {
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().test(testPhoneNumber),
  notes: string().notRequired(),
};

export const ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_BILLING_ADDRESSES_POST_SHAPE
);

export const ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_BILLING_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_INVOICES_POST_SHAPE = {
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  status: mixed().notRequired().oneOf(["", "Draft"]).transform(transformArrayToString),
  shipping_status: mixed()
    .notRequired()
    .oneOf(["", "Pending"])
    .transform(transformArrayToString),
  cod: boolean().notRequired(),
  shipping_incl_tax: string()
    .notRequired()
    .transform(transformDecimal)
    .when("shipping_excl_tax", whenRequired)
    .test(testFormat("shipping_excl_tax"))
    .test(testCompareValue("shipping_excl_tax")),
  shipping_excl_tax: string().notRequired().transform(transformDecimal),
  surcharge: string().notRequired().transform(transformDecimal),
  shipper: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_INVOICES_POST_SHAPE
);

export const ADMIN_ORDERS_INVOICES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_INVOICES_QUANTITIES_POST_SHAPE = {
  line: mixed().notRequired().nullable().transform(transformObjectToId),
  invoice: mixed().notRequired().nullable().transform(transformObjectToId),
  unit_quantity: number().notRequired().max(2147483647),
  record: mixed().notRequired().nullable().transform(transformObjectToId),
  warehouse: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_INVOICES_QUANTITIES_POST_SHAPE
);

export const ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_LINES_POST_SHAPE = {
  discount_type: mixed()
    .notRequired()
    .oneOf(["", "Percentage", "Absolute"])
    .transform(transformArrayToString),
  discount_amount: string().notRequired().transform(transformDecimal),
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  unit: string().notRequired().max(128),
  unit_quantity: number().notRequired().min(1).max(2147483647),
};

export const ADMIN_ORDERS_LINES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_LINES_POST_SHAPE
);

export const ADMIN_ORDERS_LINES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_LINES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_LINES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_LINES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_PURCHASE_CHANNELS_POST_SHAPE = {
  name: string().required().min(1).max(255),
  description: string().notRequired(),
};

export const ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_PURCHASE_CHANNELS_POST_SHAPE
);

export const ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_SHIPPERS_POST_SHAPE = {
  user: mixed().notRequired().nullable().transform(transformObjectToId),
  name: string().required().min(1).max(128),
};

export const ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_SHIPPERS_POST_SHAPE
);

export const ADMIN_ORDERS_SHIPPERS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_SHAPE = {
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().test(testPhoneNumber),
  notes: string().notRequired(),
};

export const ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_SHAPE
);

export const ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_ORDERS_SHIPPING_METHODS_POST_SHAPE = {
  name: string().required().min(1).max(128),
  type: mixed().nullable().notRequired().test(testEmptyString),
  price: string().notRequired().transform(transformDecimal),
  price_incl_tax: string()
    .notRequired()
    .transform(transformDecimal)
    .when("price", whenRequired)
    .test(testFormat("price"))
    .test(testCompareValue("price")),
  minimum_order_price: string().notRequired().transform(transformDecimal),
  maximum_order_price: string().nullable().notRequired().transform(transformDecimal),
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
};

export const ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_SHIPPING_METHODS_POST_SHAPE
);

export const ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA
);

export type ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA
>;

export const ADMIN_PARTNERS_POST_SHAPE = {
  max_debt: string().notRequired().transform(transformDecimal),
  name: string().required().min(1).max(255),
  tax_identification_number: string().nullable().notRequired().max(20),
  notes: string().notRequired(),
  email: string().notRequired().max(254).email(),
  contact_info: string().notRequired(),
};

export const ADMIN_PARTNERS_POST_YUP_SCHEMA = object({}).shape(ADMIN_PARTNERS_POST_SHAPE);

export const ADMIN_PARTNERS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PARTNERS_POST_YUP_SCHEMA
);

export type ADMIN_PARTNERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PARTNERS_POST_YUP_SCHEMA
>;

export const ADMIN_PARTNERS_ADDRESSES_POST_SHAPE = {
  phone_number: string().notRequired().test(testPhoneNumber),
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  partner: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PARTNERS_ADDRESSES_POST_SHAPE
);

export const ADMIN_PARTNERS_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_PARTNERS_ITEMS_POST_SHAPE = {
  partner_sku: string().required().min(1).max(255),
  price: string().notRequired().transform(transformDecimal),
  price_incl_tax: string()
    .notRequired()
    .transform(transformDecimal)
    .when("price", whenRequired)
    .test(testFormat("price"))
    .test(testCompareValue("price")),
  partner: mixed().notRequired().nullable().transform(transformObjectToId),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_PARTNERS_ITEMS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PARTNERS_ITEMS_POST_SHAPE
);

export const ADMIN_PARTNERS_ITEMS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PARTNERS_ITEMS_POST_YUP_SCHEMA
);

export type ADMIN_PARTNERS_ITEMS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PARTNERS_ITEMS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_POST_SHAPE = {
  product_class: mixed().notRequired().nullable().transform(transformObjectToId),
  publication_date: mixed().nullable().test(testFormatDate),
  is_published: boolean().notRequired(),
  meta_title: string().notRequired().max(255),
  meta_description: string().notRequired(),
  seo_title: string().notRequired().max(70),
  seo_description: string().notRequired().max(300),
  name: string().required().min(1).max(250),
  description: string().notRequired(),
  available_for_purchase: mixed().nullable().test(testFormatDate),
};

export const ADMIN_PRODUCTS_POST_YUP_SCHEMA = object({}).shape(ADMIN_PRODUCTS_POST_SHAPE);

export const ADMIN_PRODUCTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_ATTRIBUTES_POST_SHAPE = {
  input_type: mixed()
    .notRequired()
    .oneOf(["", "Option", "Multi_option"])
    .transform(transformArrayToString),
  name: string().required().min(1).max(255),
  is_variant_only: boolean().notRequired(),
};

export const ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_ATTRIBUTES_POST_SHAPE
);

export const ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_ATTRIBUTES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_SHAPE = {
  name: string().required().min(1).max(250),
  value: string().required().min(1).max(100),
  attribute: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_SHAPE
);

export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_CATEGORIES_POST_SHAPE = {
  parent: mixed().notRequired().nullable().transform(transformObjectToId),
  name: string().required().min(1).max(250),
  description: string().notRequired(),
  image: mixed().nullable().notRequired(),
  image_alt: string().notRequired().max(128),
};

export const ADMIN_PRODUCTS_CATEGORIES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_CATEGORIES_POST_SHAPE
);

export const ADMIN_PRODUCTS_CATEGORIES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_CATEGORIES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_CATEGORIES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_CATEGORIES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_IMAGES_POST_SHAPE = {
  image: mixed().notRequired(),
  sort_order: number().nullable().notRequired().max(2147483647),
  alt: string().notRequired().max(128),
  product: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_PRODUCTS_IMAGES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_IMAGES_POST_SHAPE
);

export const ADMIN_PRODUCTS_IMAGES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_IMAGES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_IMAGES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_IMAGES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_SHAPE = {
  category: mixed().notRequired().nullable().transform(transformObjectToId),
  product: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_SHAPE
);

export const ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_RECOMMENDATIONS_POST_SHAPE = {
  ranking: mixed().notRequired().nullable().transform(transformObjectToId),
  primary: mixed().notRequired().nullable().transform(transformObjectToId),
  recommendation: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_RECOMMENDATIONS_POST_SHAPE
);

export const ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_RECOMMENDATIONS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_TYPES_POST_SHAPE = {
  name: string().required().min(1).max(250),
  tax_rate: string().notRequired().transform(transformDecimal),
  has_variants: boolean().notRequired(),
};

export const ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_TYPES_POST_SHAPE
);

export const ADMIN_PRODUCTS_TYPES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_SHAPE = {
  attribute: mixed().notRequired().nullable().transform(transformObjectToId),
  product_class: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_SHAPE
);

export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_SHAPE = {
  attribute: mixed().notRequired().nullable().transform(transformObjectToId),
  product_class: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_SHAPE
);

export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_VARIANTS_POST_SHAPE = {
  track_inventory: boolean().notRequired(),
  is_default: boolean().notRequired(),
  product: mixed().notRequired().nullable().transform(transformObjectToId),
  editable_sku: string().notRequired().min(1).max(255),
  unit: string().required().min(1).max(100),
  weight: number().notRequired(),
  bar_code: string().notRequired().max(100),
  name: string().notRequired().max(255),
  price_incl_tax: string().notRequired().transform(transformDecimal),
  list_id_values: string().notRequired().min(1),
};

export const ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_VARIANTS_POST_SHAPE
);

export const ADMIN_PRODUCTS_VARIANTS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_SHAPE = {
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  image: number().required(),
};

export const ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_SHAPE
);

export const ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_VARIANTS_UNITS_POST_SHAPE = {
  editable_sku: string().notRequired().min(1).max(255),
  unit: string().required().min(1).max(100),
  multiply: number().notRequired().min(1).max(2147483647),
  weight: number().notRequired(),
  bar_code: string().notRequired().max(100),
  price_incl_tax: string().notRequired().transform(transformDecimal),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_VARIANTS_UNITS_POST_SHAPE
);

export const ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA
>;

export const ADMIN_USERS_POST_SHAPE = {
  avatar: mixed().nullable().notRequired(),
  username: string().nullable().notRequired().max(255),
  email: string().nullable().notRequired().max(254).email(),
  main_phone_number: string().notRequired().test(testPhoneNumber),
  first_name: string().notRequired().max(128),
  last_name: string().notRequired().max(128),
  note: string().notRequired(),
  birthday: mixed().nullable().test(testFormatDate),
  gender: mixed()
    .notRequired()
    .oneOf(["", "Male", "Female", "Other"])
    .transform(transformArrayToString),
  facebook: string().notRequired().max(200).url(),
  is_staff: boolean().notRequired(),
  is_active: boolean().notRequired(),
};

export const ADMIN_USERS_POST_YUP_SCHEMA = object({}).shape(ADMIN_USERS_POST_SHAPE);

export const ADMIN_USERS_POST_YUP_RESOLVER = yupResolver(ADMIN_USERS_POST_YUP_SCHEMA);

export type ADMIN_USERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_POST_YUP_SCHEMA
>;

export const ADMIN_USERS_ADDRESSES_POST_SHAPE = {
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().test(testPhoneNumber),
  notes: string().notRequired(),
  is_default_for_shipping: boolean().notRequired(),
  is_default_for_billing: boolean().notRequired(),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  user: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_USERS_ADDRESSES_POST_SHAPE
);

export const ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_USERS_PERMISSIONS_POST_SHAPE = {
  user: mixed().notRequired().nullable().transform(transformObjectToId),
  permission: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_USERS_PERMISSIONS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_USERS_PERMISSIONS_POST_SHAPE
);

export const ADMIN_USERS_PERMISSIONS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_USERS_PERMISSIONS_POST_YUP_SCHEMA
);

export type ADMIN_USERS_PERMISSIONS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_PERMISSIONS_POST_YUP_SCHEMA
>;

export const ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_SHAPE = {
  token: string().required().min(1),
};

export const ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_SHAPE
);

export const ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_RESOLVER = yupResolver(
  ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_SCHEMA
);

export type ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_POST_SHAPE = {
  name: string().required().min(1).max(255),
  manager: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_WAREHOUSES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_POST_SHAPE
);

export const ADMIN_WAREHOUSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_ADDRESSES_POST_SHAPE = {
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  warehouse: mixed().notRequired().nullable().transform(transformObjectToId),
  phone_number: string().notRequired().test(testPhoneNumber),
};

export const ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_ADDRESSES_POST_SHAPE
);

export const ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_OUT_NOTES_POST_SHAPE = {
  status: mixed()
    .notRequired()
    .oneOf(["", "Draft", "Confirmed"])
    .transform(transformArrayToString),
  direction: mixed()
    .notRequired()
    .oneOf(["", "in", "out"])
    .transform(transformArrayToString),
  reason: mixed()
    .notRequired()
    .oneOf([
      "",
      "customer_return",
      "partner_return",
      "ecommerce_return",
      "storage_miss_match",
      "product_expiration",
      "other",
    ])
    .transform(transformArrayToString),
  shipping_incl_tax: string()
    .notRequired()
    .transform(transformDecimal)
    .when("shipping_excl_tax", whenRequired)
    .test(testFormat("shipping_excl_tax"))
    .test(testCompareValue("shipping_excl_tax")),
  shipping_excl_tax: string().notRequired().transform(transformDecimal),
  amount: string().notRequired().transform(transformDecimal),
  amount_incl_tax: string()
    .notRequired()
    .transform(transformDecimal)
    .when("amount", whenRequired)
    .test(testFormat("amount"))
    .test(testCompareValue("amount")),
  notes: string().notRequired(),
  warehouse: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_OUT_NOTES_POST_SHAPE
);

export const ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_SHAPE = {
  unit: string().nullable().notRequired().min(1),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
  record: mixed().notRequired().nullable().transform(transformObjectToId),
  stock_out_note: mixed().notRequired().nullable().transform(transformObjectToId),
  unit_quantity: number().notRequired().min(1).max(2147483647),
};

export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_SHAPE
);

export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_SHAPE = {
  status: mixed().notRequired().oneOf(["", "Draft"]).transform(transformArrayToString),
  notes: string().notRequired(),
  warehouse: mixed().notRequired().nullable().transform(transformObjectToId),
  partner: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_SHAPE
);

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_SHAPE = {
  discount_type: mixed()
    .notRequired()
    .oneOf(["", "Percentage", "Absolute"])
    .transform(transformArrayToString),
  discount_amount: string().notRequired().transform(transformDecimal),
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  quantity: number().notRequired().min(1).max(2147483647),
  offer_description: string().notRequired(),
  variant: mixed().notRequired().nullable().transform(transformObjectToId),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_SHAPE
);

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_SHAPE = {
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  status: mixed().notRequired().oneOf(["", "Draft"]).transform(transformArrayToString),
  surcharge: string().notRequired().transform(transformDecimal),
  notes: string().notRequired(),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_SCHEMA = object(
  {}
).shape(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_SHAPE);

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_RESOLVER =
  yupResolver(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_SCHEMA);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_SCHEMA_TYPE =
  InferType<typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_SCHEMA>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_SHAPE = {
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  line: mixed().notRequired().nullable().transform(transformObjectToId),
  expiration_date: mixed().nullable().test(testFormatDate),
  notes: string().notRequired(),
  quantity: number().notRequired().min(1).max(2147483647),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_SCHEMA =
  object({}).shape(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_SHAPE);

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_RESOLVER =
  yupResolver(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_SCHEMA);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_YUP_SCHEMA
  >;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_SHAPE = {
  order: mixed().notRequired().nullable().transform(transformObjectToId),
  status: mixed().notRequired().oneOf(["", "Draft"]).transform(transformArrayToString),
  surcharge: string().notRequired().transform(transformDecimal),
  notes: string().notRequired(),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA =
  object({}).shape(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_SHAPE
  );

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_RESOLVER =
  yupResolver(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA
  );

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA
  >;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_SHAPE =
  {
    order: mixed().notRequired().nullable().transform(transformObjectToId),
    receipt_order_quantity: number().required(),
    quantity: number().notRequired().min(1).max(2147483647),
  };

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_SCHEMA =
  object({}).shape(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_SHAPE
  );

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_RESOLVER =
  yupResolver(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_SCHEMA
  );

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_YUP_SCHEMA
  >;
