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
export const ADMIN_CASH_PAYMENT_METHODS_WITH_ID_PATCH_SHAPE = {
  name: string().required().min(1).max(255),
  description: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_CASH_PAYMENT_METHODS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_CASH_PAYMENT_METHODS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_CASH_PAYMENT_METHODS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_CASH_PAYMENT_METHODS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_CASH_PAYMENT_METHODS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CASH_PAYMENT_METHODS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_CASH_TRANSACTIONS_TYPES_WITH_ID_PATCH_SHAPE = {
  name: string().required().min(1).max(100),
  is_business_activity: boolean().notRequired(),
  description: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_CASH_TRANSACTIONS_TYPES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_CASH_TRANSACTIONS_TYPES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_CASH_TRANSACTIONS_TYPES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_CASH_TRANSACTIONS_TYPES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_CASH_TRANSACTIONS_TYPES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CASH_TRANSACTIONS_TYPES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_CASH_TRANSACTIONS_WITH_ID_PATCH_SHAPE = {
  status: mixed()
    .notRequired()
    .oneOf(["", "Draft", "Confirmed"])
    .transform(transformArrayToString),
  flow_type: mixed()
    .notRequired()
    .oneOf(["", "Cash_out", "Cash_in"])
    .transform(transformArrayToString),
  notes: string().notRequired(),
  address: string().notRequired(),
  amount: string().required().transform(transformDecimal),
  affect_creditor: boolean().notRequired(),
  type: mixed().notRequired().nullable().transform(transformObjectToId),
  payment_method: mixed().notRequired().nullable().transform(transformObjectToId),
  id: mixed().required(),
};

export const ADMIN_CASH_TRANSACTIONS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_CASH_TRANSACTIONS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_CASH_TRANSACTIONS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_CASH_TRANSACTIONS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_CASH_TRANSACTIONS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CASH_TRANSACTIONS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_SHAPE = {
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
  id: mixed().required(),
};

export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_SHAPE = {
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
  id: mixed().required(),
};

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_SHAPE = {
  name: string().required().min(1).max(255),
  description: string().notRequired(),
  parent: mixed().notRequired().nullable().transform(transformObjectToId),
  id: mixed().required(),
};

export const ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_CUSTOMERS_WITH_ID_PATCH_SHAPE = {
  sales_in_charge: mixed().notRequired().nullable().transform(transformObjectToId),
  max_debt: string().notRequired().transform(transformDecimal),
  id: mixed().required(),
};

export const ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_CUSTOMERS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_VOUCHERS_WITH_ID_PATCH_SHAPE = {
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
  id: mixed().required(),
};

export const ADMIN_DISCOUNTS_VOUCHERS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_DISCOUNTS_VOUCHERS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_DISCOUNTS_VOUCHERS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_VOUCHERS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_VOUCHERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_VOUCHERS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_DISCOUNTS_WITH_ID_PATCH_SHAPE = {
  name: string().required().min(1).max(255),
  date_start: mixed().nullable().test(testFormatDate),
  date_end: mixed().nullable().test(testFormatDate).test(testCompareDate("date_start")),
  id: mixed().required(),
};

export const ADMIN_DISCOUNTS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_DISCOUNTS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_DISCOUNTS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_DISCOUNTS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_DISCOUNTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_DISCOUNTS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_ORDERS_BILLING_ADDRESSES_WITH_ID_PATCH_SHAPE = {
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().test(testPhoneNumber),
  notes: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_ORDERS_BILLING_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_BILLING_ADDRESSES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_ORDERS_BILLING_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_BILLING_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_ORDERS_BILLING_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_BILLING_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_ORDERS_INVOICES_QUANTITIES_WITH_ID_PATCH_SHAPE = {
  unit_quantity: number().notRequired().max(2147483647),
  id: mixed().required(),
};

export const ADMIN_ORDERS_INVOICES_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_INVOICES_QUANTITIES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_ORDERS_INVOICES_QUANTITIES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_INVOICES_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_ORDERS_INVOICES_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_INVOICES_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_SHAPE = {
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
  id: mixed().required(),
};

export const ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_ORDERS_LINES_WITH_ID_PATCH_SHAPE = {
  discount_type: mixed()
    .notRequired()
    .oneOf(["", "Percentage", "Absolute"])
    .transform(transformArrayToString),
  discount_amount: string().notRequired().transform(transformDecimal),
  unit_quantity: number().notRequired().min(1).max(2147483647),
  id: mixed().required(),
};

export const ADMIN_ORDERS_LINES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_LINES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_ORDERS_LINES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_LINES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_ORDERS_LINES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_LINES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_ORDERS_PURCHASE_CHANNELS_WITH_ID_PATCH_SHAPE = {
  name: string().required().min(1).max(255),
  description: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_ORDERS_PURCHASE_CHANNELS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_PURCHASE_CHANNELS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_ORDERS_PURCHASE_CHANNELS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_PURCHASE_CHANNELS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_ORDERS_PURCHASE_CHANNELS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_PURCHASE_CHANNELS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_SHAPE = {
  user: mixed().notRequired().nullable().transform(transformObjectToId),
  name: string().required().min(1).max(128),
  id: mixed().required(),
};

export const ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_ORDERS_SHIPPING_ADDRESSES_WITH_ID_PATCH_SHAPE = {
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  postcode: string().notRequired().max(64),
  phone_number: string().notRequired().test(testPhoneNumber),
  notes: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_ORDERS_SHIPPING_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_SHIPPING_ADDRESSES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_ORDERS_SHIPPING_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_SHIPPING_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_ORDERS_SHIPPING_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_SHIPPING_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_ORDERS_SHIPPING_METHODS_WITH_ID_PATCH_SHAPE = {
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
  id: mixed().required(),
};

export const ADMIN_ORDERS_SHIPPING_METHODS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_SHIPPING_METHODS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_ORDERS_SHIPPING_METHODS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_SHIPPING_METHODS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_ORDERS_SHIPPING_METHODS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_SHIPPING_METHODS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_ORDERS_WITH_ID_PATCH_SHAPE = {
  receiver: mixed().notRequired().nullable().transform(transformObjectToId),
  receiver_name: string().notRequired().max(256),
  receiver_email: string().notRequired().max(254).email(),
  receiver_phone_number: string().notRequired().test(testPhoneNumber),
  status: mixed().notRequired().oneOf(["", "Draft"]).transform(transformArrayToString),
  customer_notes: string().notRequired(),
  channel: mixed().notRequired().nullable().transform(transformObjectToId),
  shipping_method: mixed().notRequired().nullable().transform(transformObjectToId),
  id: mixed().required(),
};

export const ADMIN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_ORDERS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_ORDERS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PARTNERS_ADDRESSES_WITH_ID_PATCH_SHAPE = {
  phone_number: string().notRequired().test(testPhoneNumber),
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  id: mixed().required(),
};

export const ADMIN_PARTNERS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PARTNERS_ADDRESSES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PARTNERS_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PARTNERS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PARTNERS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PARTNERS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_SHAPE = {
  partner_sku: string().required().min(1).max(255),
  price: string().notRequired().transform(transformDecimal),
  price_incl_tax: string()
    .notRequired()
    .transform(transformDecimal)
    .when("price", whenRequired)
    .test(testFormat("price"))
    .test(testCompareValue("price")),
  id: mixed().required(),
};

export const ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PARTNERS_WITH_ID_PATCH_SHAPE = {
  max_debt: string().notRequired().transform(transformDecimal),
  name: string().required().min(1).max(255),
  tax_identification_number: string().nullable().notRequired().max(20),
  notes: string().notRequired(),
  email: string().notRequired().max(254).email(),
  contact_info: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PARTNERS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PARTNERS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_PATCH_SHAPE = {
  name: string().required().min(1).max(250),
  value: string().required().min(1).max(100),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_PATCH_YUP_SCHEMA = object(
  {}
).shape(ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_PATCH_SHAPE);

export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_ATTRIBUTES_WITH_ID_PATCH_SHAPE = {
  input_type: mixed()
    .notRequired()
    .oneOf(["", "Option", "Multi_option"])
    .transform(transformArrayToString),
  name: string().required().min(1).max(255),
  is_variant_only: boolean().notRequired(),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_ATTRIBUTES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_ATTRIBUTES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PRODUCTS_ATTRIBUTES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_ATTRIBUTES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_ATTRIBUTES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_ATTRIBUTES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_CATEGORIES_WITH_ID_PATCH_SHAPE = {
  parent: mixed().notRequired().nullable().transform(transformObjectToId),
  name: string().required().min(1).max(250),
  description: string().notRequired(),
  image: mixed().nullable().notRequired(),
  image_alt: string().notRequired().max(128),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_CATEGORIES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_CATEGORIES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PRODUCTS_CATEGORIES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_CATEGORIES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_CATEGORIES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_CATEGORIES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_IMAGES_WITH_ID_PATCH_SHAPE = {
  sort_order: number().nullable().notRequired().max(2147483647),
  alt: string().notRequired().max(128),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_IMAGES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_IMAGES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PRODUCTS_IMAGES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_IMAGES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_IMAGES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_IMAGES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_RECOMMENDATIONS_WITH_ID_PATCH_SHAPE = {
  ranking: mixed().notRequired().nullable().transform(transformObjectToId),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_RECOMMENDATIONS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_RECOMMENDATIONS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PRODUCTS_RECOMMENDATIONS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_RECOMMENDATIONS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_RECOMMENDATIONS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_RECOMMENDATIONS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_PATCH_SHAPE = {
  values: array(number().required()).required().default([]),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_SCHEMA =
  object({}).shape(ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_PATCH_SHAPE);

export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_RESOLVER =
  yupResolver(ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_SCHEMA);

export type ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_SCHEMA
  >;

export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_PATCH_SHAPE = {
  values: array(number().required()).required().default([]),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_SCHEMA =
  object({}).shape(ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_PATCH_SHAPE);

export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_RESOLVER =
  yupResolver(ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_SCHEMA);

export type ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_PATCH_YUP_SCHEMA
  >;

export const ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_SHAPE = {
  name: string().required().min(1).max(250),
  tax_rate: string().notRequired().transform(transformDecimal),
  has_variants: boolean().notRequired(),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_SHAPE = {
  editable_sku: string().notRequired().min(1).max(255),
  unit: string().required().min(1).max(100),
  multiply: number().notRequired().min(1).max(2147483647),
  weight: number().notRequired(),
  bar_code: string().notRequired().max(100),
  price_incl_tax: string().notRequired().transform(transformDecimal),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_SHAPE = {
  track_inventory: boolean().notRequired(),
  is_default: boolean().notRequired(),
  editable_sku: string().notRequired().min(1).max(255),
  unit: string().required().min(1).max(100),
  weight: number().notRequired(),
  bar_code: string().notRequired().max(100),
  name: string().notRequired().max(255),
  price_incl_tax: string().notRequired().transform(transformDecimal),
  list_id_values: string().notRequired().min(1),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_PRODUCTS_WITH_ID_PATCH_SHAPE = {
  publication_date: mixed().nullable().test(testFormatDate),
  is_published: boolean().notRequired(),
  meta_title: string().notRequired().max(255),
  meta_description: string().notRequired(),
  seo_title: string().notRequired().max(70),
  seo_description: string().notRequired().max(300),
  name: string().required().min(1).max(250),
  description: string().notRequired(),
  available_for_purchase: mixed().nullable().test(testFormatDate),
  id: mixed().required(),
};

export const ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_PRODUCTS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_SETTINGS_PATCH_SHAPE = {
  logo: mixed().nullable().notRequired(),
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  postcode: string().notRequired().max(64),
  company_name: string().notRequired().max(254),
  store_name: string().notRequired().max(100),
  store_description: string().notRequired(),
  store_website: string().notRequired().max(200).url(),
  hotline_1: string().notRequired().max(128),
  hotline_2: string().notRequired().max(128),
  tax_identification_number: string().notRequired().max(20),
  currency: mixed().notRequired().oneOf(["VND"]).transform(transformArrayToString),
  weight_unit: string().notRequired().min(1).max(12),
  invoice_qr_code: mixed().nullable().notRequired(),
  invoice_notes: string().notRequired(),
  bank_account_info: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_SETTINGS_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_SETTINGS_PATCH_SHAPE
);

export const ADMIN_SETTINGS_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_SETTINGS_PATCH_YUP_SCHEMA
);

export type ADMIN_SETTINGS_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_SETTINGS_PATCH_YUP_SCHEMA
>;

export const ADMIN_USERS_ADDRESSES_WITH_ID_PATCH_SHAPE = {
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
  id: mixed().required(),
};

export const ADMIN_USERS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_USERS_ADDRESSES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_USERS_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_USERS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_USERS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_USERS_WITH_ID_PATCH_SHAPE = {
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
  id: mixed().required(),
};

export const ADMIN_USERS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_USERS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_USERS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_USERS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_USERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_USERS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_SHAPE = {
  line1: string().required().min(1).max(255),
  line2: string().notRequired().max(255),
  district: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  ward: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  province: mixed().notRequired().nullable().transform(transformProvinceDistrictWard),
  postcode: string().notRequired().max(64),
  country: mixed().notRequired().oneOf(["VN"]).transform(transformArrayToString),
  phone_number: string().notRequired().test(testPhoneNumber),
  id: mixed().required(),
};

export const ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_SHAPE = {
  unit_quantity: number().notRequired().min(1).max(2147483647),
  id: mixed().required(),
};

export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_SHAPE = {
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
  id: mixed().required(),
};

export const ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_SHAPE = {
  discount_type: mixed()
    .notRequired()
    .oneOf(["", "Percentage", "Absolute"])
    .transform(transformArrayToString),
  discount_amount: string().notRequired().transform(transformDecimal),
  quantity: number().notRequired().min(1).max(2147483647),
  offer_description: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_YUP_SCHEMA = object(
  {}
).shape(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_SHAPE);

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_YUP_RESOLVER =
  yupResolver(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_YUP_SCHEMA);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
  InferType<typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_YUP_SCHEMA>;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_WITH_ID_PATCH_SHAPE =
  {
    expiration_date: mixed().nullable().test(testFormatDate),
    notes: string().notRequired(),
    quantity: number().notRequired().min(1).max(2147483647),
    id: mixed().required(),
  };

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA =
  object({}).shape(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_WITH_ID_PATCH_SHAPE
  );

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_RESOLVER =
  yupResolver(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA
  );

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA
  >;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_WITH_ID_PATCH_SHAPE =
  {
    quantity: number().notRequired().min(1).max(2147483647),
    id: mixed().required(),
  };

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA =
  object({}).shape(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_WITH_ID_PATCH_SHAPE
  );

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_RESOLVER =
  yupResolver(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA
  );

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_WITH_ID_PATCH_YUP_SCHEMA
  >;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_SHAPE =
  {
    status: mixed().notRequired().oneOf(["", "Draft"]).transform(transformArrayToString),
    surcharge: string().notRequired().transform(transformDecimal),
    notes: string().notRequired(),
    id: mixed().required(),
  };

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA =
  object({}).shape(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_SHAPE
  );

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_YUP_RESOLVER =
  yupResolver(
    ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA
  );

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA
  >;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_SHAPE = {
  status: mixed().notRequired().oneOf(["", "Draft"]).transform(transformArrayToString),
  surcharge: string().notRequired().transform(transformDecimal),
  notes: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_YUP_SCHEMA =
  object({}).shape(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_SHAPE);

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_YUP_RESOLVER =
  yupResolver(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_YUP_SCHEMA);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
  InferType<
    typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_YUP_SCHEMA
  >;

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_PATCH_SHAPE = {
  status: mixed().notRequired().oneOf(["", "Draft"]).transform(transformArrayToString),
  notes: string().notRequired(),
  id: mixed().required(),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_SHAPE = {
  low_stock_threshold: number().nullable().notRequired().max(2147483647),
  price: string().notRequired().transform(transformDecimal),
  price_incl_tax: string()
    .notRequired()
    .transform(transformDecimal)
    .when("price", whenRequired)
    .test(testFormat("price"))
    .test(testCompareValue("price")),
  id: mixed().required(),
};

export const ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_SHAPE
);

export const ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_YUP_SCHEMA
>;

export const ADMIN_WAREHOUSES_WITH_ID_PATCH_SHAPE = {
  name: string().required().min(1).max(255),
  manager: mixed().notRequired().nullable().transform(transformObjectToId),
  id: mixed().required(),
};

export const ADMIN_WAREHOUSES_WITH_ID_PATCH_YUP_SCHEMA = object({}).shape(
  ADMIN_WAREHOUSES_WITH_ID_PATCH_SHAPE
);

export const ADMIN_WAREHOUSES_WITH_ID_PATCH_YUP_RESOLVER = yupResolver(
  ADMIN_WAREHOUSES_WITH_ID_PATCH_YUP_SCHEMA
);

export type ADMIN_WAREHOUSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE = InferType<
  typeof ADMIN_WAREHOUSES_WITH_ID_PATCH_YUP_SCHEMA
>;
