import { string, date, mixed, object, boolean, number } from "yup";
import get from "lodash/get";

export const settingSchema = () => {
  return object().shape({
    logo: mixed().nullable(),
    line1: string().trim().required().max(256),
    line2: string().trim().max(256),
    district: mixed(),
    ward: mixed(),
    province: mixed(),
    country: string(),
    company_name: string(),
    store_name: string(),
    store_description: string(),
    store_website: string().url().nullable(),
    hotline_1: string(),
    hotline_2: string(),
    tax_identification_number: string().max(20).nullable(),
    currency: string().required(),
    weight_unit: string(),
    invoice_qr_code: mixed().nullable(),
    invoice_notes: string(),
  });
};

export const loginSchema = () => {
  return object().shape({
    username: string().required().trim().max(256),
    password: string().required().max(256),
  });
};

export const changePasswordSchema = () => {
  return object().shape({
    password: string().required().trim().min(8).max(256),
    confirm_password: string().required().trim().min(8).max(256),
  });
};

export const customerSchema = (list) => {
  let genderList = get(list, "genders");

  genderList = genderList.map((el) => {
    return el[0];
  });

  return object().shape({
    first_name: string().trim().max(256),
    last_name: string().trim().max(256),
    email: string().nullable().trim().lowercase().email().max(254),
    main_phone_number: string()
      .trim()
      .nullable()
      .max(128)
      .when("email", ([email], schema) => {
        return email ? schema : schema.required();
      }),
    birthday: date().nullable(),
    avatar: mixed().nullable(),
    gender: mixed().oneOf(genderList),
    facebook: string().url().max(200),
    tax_identification_number: string().max(20).nullable(),
    company_name: string().max(255),
    type: mixed(),
    note: string(),
    line1: string().required().trim().max(255),
    line2: string().trim().max(255),
    district: mixed(),
    ward: mixed(),
    province: mixed(),
    phone_number: string().trim().max(128),
    notes: string().trim(),
    is_default_for_shipping: boolean(),
    is_default_for_billing: boolean(),
    country: string(),
    in_business: boolean(),
  });
};

export const userSchema = (list) => {
  let genderList = get(list, "genders");
  let statusList = get(list, "draft_customer_states");

  genderList = genderList.map((el) => {
    return el[0];
  });

  statusList = statusList.map((el) => {
    return el[0];
  });

  return object().shape({
    first_name: string().trim().max(256),
    last_name: string().trim().max(256),
    email: string().nullable().trim().lowercase().email().max(254),
    birthday: date().nullable(),
    status: mixed().oneOf(statusList),
    avatar: mixed(),
    gender: mixed().oneOf(genderList),
    facebook: string().url().max(200),
    tax_identification_number: string().max(20).nullable(),
    company_name: string().max(255),
    type: mixed(),
  });
};

export const addressSchema = () => {
  return object().shape({
    note: string(),
    line1: string().required().trim().max(255),
    line2: string().trim().max(255),
    district: mixed(),
    ward: mixed(),
    province: mixed(),
    phone_number: string().trim().max(128),
    notes: string().trim(),
    is_default_for_shipping: boolean(),
    is_default_for_billing: boolean(),
    country: string(),
  });
};

export const customerTypeSchema = () => {
  return object().shape({
    name: string().required().trim().max(255),
    description: string().trim(),
    parent: mixed(),
  });
};

export const saleInChargeSchema = () => {
  return object().shape({
    sales_in_charge: mixed(),
    max_debt: string().trim(),
  });
};

export const productCategorySchema = object().shape({
  name: string().required().trim().max(255),
  description: string().trim(),
  parent: mixed(),
});

export const productAttributeSchema = (list) => {
  let productAttributeTypes = get(list, "product_attribute_types");

  productAttributeTypes = productAttributeTypes.map((el) => {
    return el[0];
  });

  return object().shape({
    input_type: mixed().required().oneOf(productAttributeTypes),
    name: string().required().trim().max(255),
    meta_title: string().trim().max(255),
    meta_description: string().trim(),
    is_variant_only: boolean(),
    options: mixed(),
  });
};

export const productTypeSchema = () => {
  return object().shape({
    name: string().required().trim().max(128),
    tax_rate: number().min(0),
    has_variants: boolean(),
    attribute: mixed(),
  });
};

export const productSchema = () => {
  return object().shape({
    product_class: mixed().required(),
    name: string().required(),
    description: string(),
    meta_title: string(),
    meta_description: string(),
    is_published: boolean(),
    publication_date: date().nullable().required(),
    available_for_purchase: date().nullable(),
  });
};

export const productVariantSchema = () => {
  return object().shape({
    name: string().required(),
    description: string(),
    meta_title: string(),
    meta_description: string(),
    is_published: boolean(),
    publication_date: date().nullable().required(),
    available_for_purchase: date().nullable(),
    variantId: string(),
    variantName: string(),
    price: string(),
    weight: string(),
    unit: string(),
    bar_code: string(),
    sort_order: string(),
    track_inventory: boolean(),
    editable_sku: string(),
  });
};

export const createVariantSchema = () => {
  return object().shape({
    is_default: boolean(),
    meta_title: string(),
    meta_description: string(),
    name: string(),
    price: string(),
    weight: string(),
    unit: string().required(),
    bar_code: string(),
    sort_order: string(),
    track_inventory: boolean(),
  });
};

export const connectProductAttributeSchema = () => {
  return object().shape({
    attribute: mixed().required(),
    product_class: mixed().required(),
  });
};

export const warehouseSchema = () => {
  return object().shape({
    line1: string().required().trim().max(255),
    line2: string().trim().max(255),
    district: mixed(),
    ward: mixed(),
    province: mixed(),
    country: string(),
    warehouse: string(),
    name: string().required(),
    phone_number: string().required(),
  });
};

export const partnerSchema = () => {
  return object().shape({
    max_debt: string(),
    name: string().required(),
    tax_identification_number: string().max(20).nullable(),
    line1: string().required().trim().max(255),
    line2: string().trim().max(255),
    district: mixed(),
    ward: mixed(),
    province: mixed(),
    country: string(),
    partner: string(),
    phone_number: string(),
  });
};

export const outnoteSchema = (list) => {
  let statusList = get(list, "stock_out_note_statuses");

  statusList = statusList.map((el) => {
    return el[0];
  });

  return object().shape({
    status: mixed().oneOf(statusList),
    shipping_incl_tax: string(),
    shipping_excl_tax: string(),
    amount: string(),
    notes: string(),
    warehouse: mixed().required(),
  });
};

export const productUnitSchema = () => {
  return object().shape({
    unit: string().required(),
    multiply: string(),
    weight: string(),
    bar_code: string(),
    price: string(),
    variant: mixed().required(),
  });
};

export const lineSchema = () => {
  return object().shape({
    unit: string(),
    unit_quantity: string(),
    stock_out_note: mixed().required(),
    product: mixed().required(),
  });
};

export const purchaseOrderSchema = (list) => {
  let statusList = get(list, "purchase_order_statuses");

  statusList = statusList.map((el) => {
    return el[0];
  });

  return object().shape({
    status: mixed().oneOf(statusList),
    warehouse: mixed().required(),
    partner: mixed().required(),
  });
};

export const receiptOrderSchema = (list) => {
  let statusList = get(list, "receipt_order_statuses");

  statusList = statusList.map((el) => {
    return el[0];
  });

  return object().shape({
    surcharge: string(),
    status: mixed().oneOf(statusList),
    notes: string(),
    order: mixed().required(),
  });
};

export const transactionTypeSchema = () => {
  return object().shape({
    name: string().required().trim().max(255),
    description: string().trim(),
  });
};

export const paymentMethodSchema = () => {
  return object().shape({
    name: string().required().trim().max(255),
    description: string().trim(),
  });
};

export const purchaseChannelSchema = () => {
  return object().shape({
    name: string().required().trim().max(255),
    description: string().trim(),
  });
};

export const transactionSchema = (list) => {
  let transactionStatusList = get(list, "transaction_statuses");
  let transactionFlowTypeList = get(list, "transaction_flow_types");
  let transactionSourceTypeList = get(list, "transaction_source_types");

  transactionStatusList = transactionStatusList.map((el) => {
    return el[0];
  });

  transactionFlowTypeList = transactionFlowTypeList.map((el) => {
    return el[0];
  });

  transactionSourceTypeList = transactionSourceTypeList.map((el) => {
    return el[0];
  });

  transactionSourceTypeList.push("");

  return object().shape({
    status: mixed().oneOf(transactionStatusList),
    type: mixed().required(),
    source_type: mixed().oneOf(transactionSourceTypeList),
    flow_type: mixed().oneOf(transactionFlowTypeList),
    notes: string().trim(),
    amount: string(),
    source_id: mixed(),
    affect_creditor: boolean(),
    target_type: mixed(),
    target_id: mixed(),
    target_name: string(),
    payment_method: mixed(),
    address: string().nullable(),
  });
};

export const shipperSchema = () => {
  return object().shape({
    user: mixed(),
    name: string().required(),
  });
};

export const shippingMethodSchema = (list) => {
  let shippingMethodTypeList = get(list, "shipping_method_types");

  shippingMethodTypeList = shippingMethodTypeList.map((el) => {
    return el[0];
  });

  return object().shape({
    name: string().required(),
    type: mixed().required().oneOf(shippingMethodTypeList),
    price: string().nullable(),
    price_incl_tax: string().nullable(),
    minimum_order_price: string().nullable(),
    maximum_order_price: string().nullable(),
    minimum_order_weight: string().nullable(),
    maximum_order_weight: string().nullable(),
  });
};

export const discountSchema = (list) => {
  let discountTypeList = get(list, "discount_types");

  discountTypeList = discountTypeList.map((el) => {
    return el[0];
  });

  return object().shape({
    discount_type: mixed().required().oneOf(discountTypeList),
    name: string().required(),
    discount_amount: string().nullable(),
    date_start: date().nullable(),
    date_end: date().nullable(),
  });
};

export const voucherSchema = (list) => {
  let discountTypeList = get(list, "discount_types");
  let voucherTypeList = get(list, "voucher_types");

  discountTypeList = discountTypeList.map((el) => {
    return el[0];
  });

  voucherTypeList = voucherTypeList.map((el) => {
    return el[0];
  });

  return object().shape({
    type: mixed().required().oneOf(voucherTypeList),
    discount_type: mixed().required().oneOf(discountTypeList),
    name: string().required(),
    code: string().required().uppercase(),
    usage_limit: string().nullable(),
    discount_amount: string().nullable(),
    date_start: date().nullable(),
    date_end: date().nullable(),
    apply_once_per_order: boolean(),
    apply_once_per_customer: boolean(),
    min_spent_amount: string().nullable(),
    min_checkout_items_quantity: string().nullable(),
  });
};

export const superUserSchema = (list) => {
  let genderList = get(list, "genders");

  genderList = genderList.map((el) => {
    return el[0];
  });

  return object().shape({
    avatar: mixed().nullable(),
    gender: mixed().oneOf(genderList),
    main_phone_number: string()
      .trim()
      .nullable()
      .max(128)
      .when("email", ([email], schema) => {
        return email ? schema : schema.required();
      }),
    is_superuser: boolean(),
    username: string(),
    email: string().nullable().trim().lowercase().email().max(254),
    first_name: string().trim().max(256),
    last_name: string().trim().max(256),
    note: string(),
    birthday: date().nullable(),
    facebook: string().url().max(200),
    is_staff: boolean(),
    is_active: boolean(),
    line1: string().required().trim().max(255),
    line2: string().trim().max(255),
    district: mixed(),
    ward: mixed(),
    province: mixed(),
    phone_number: string().trim().max(128),
    notes: string().trim(),
    is_default_for_shipping: boolean(),
    is_default_for_billing: boolean(),
    country: string(),
  });
};

export const orderSchema = (list) => {
  return object().shape({
    channel: mixed().required(),
    receiver: mixed(),
    status: string().required(),
    shipping_method: mixed().required(),
    receiver_name: string().nullable(),
    receiver_email: string().nullable(),
    receiver_phone_number: string().nullable(),
    customer_notes: string().nullable(),
  });
};

export const invoiceSchema = (list) => {
  let orderStatus = get(list, "order_statuses");

  orderStatus = orderStatus.map((el) => {
    return el[0];
  });

  let shippingStatus = get(list, "shipping_statuses");

  shippingStatus = shippingStatus.map((el) => {
    return el[0];
  });

  return object().shape({
    order: mixed().required(),
    status: mixed().oneOf(orderStatus).required(),
    shipping_status: mixed().oneOf(shippingStatus).required(),
    shipper: mixed().nullable(),
    cod: boolean(),
    shipping_incl_tax: string().nullable(),
    shipping_excl_tax: string().nullable(),
    surcharge: string().nullable(),
  });
};
