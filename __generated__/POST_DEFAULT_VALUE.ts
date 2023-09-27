import Chance from "chance";
const chance = new Chance();
const ADMIN_EXPORT_FILES_POST_FAKE_DATA = {
  type: chance.pickone(["Invoice_quantity", "Transaction", "Debt_record"]),
  file_ext: chance.pickone([".csv", ".xlsx"]),
  field_options: [
    chance.pickone([
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
    ]),
  ],
  date_start: new Date().toISOString(),
  date_end: new Date(
    chance.date({
      year: parseInt(chance.exp_year()),
    })
  ).toISOString(),
  customer: "",
};

export const ADMIN_EXPORT_FILES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        type: "Invoice_quantity",
        file_ext: ".csv",
        field_options: [],
        date_start: null,
        date_end: null,
        customer: "",
      }
    : ADMIN_EXPORT_FILES_POST_FAKE_DATA;

const CHANGE_PASSWORD_POST_FAKE_DATA = {
  password: "",
  confirm_password: "",
};

export const CHANGE_PASSWORD_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        password: "",
        confirm_password: "",
      }
    : CHANGE_PASSWORD_POST_FAKE_DATA;

const LOGIN_POST_FAKE_DATA = {
  username: "",
  password: "",
};

export const LOGIN_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        username: "",
        password: "",
      }
    : LOGIN_POST_FAKE_DATA;

const REFRESH_TOKEN_POST_FAKE_DATA = {
  refresh_token: "",
  csrf_token: "",
};

export const REFRESH_TOKEN_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        refresh_token: "",
        csrf_token: "",
      }
    : REFRESH_TOKEN_POST_FAKE_DATA;

const VERIFY_TOKEN_POST_FAKE_DATA = {
  token: "",
};

export const VERIFY_TOKEN_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        token: "",
      }
    : VERIFY_TOKEN_POST_FAKE_DATA;

const ADMIN_CASH_PAYMENT_METHODS_POST_FAKE_DATA = {
  name: chance.name(),
  description: chance.sentence({
    words: 10,
  }),
};

export const ADMIN_CASH_PAYMENT_METHODS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        name: "",
        description: "",
      }
    : ADMIN_CASH_PAYMENT_METHODS_POST_FAKE_DATA;

const ADMIN_CASH_TRANSACTIONS_POST_FAKE_DATA = {
  status: "Draft",
  source_type: chance.pickone([
    "stock.receiptorder",
    "stock.stockoutnote",
    "order.invoice",
  ]),
  target_type: chance.pickone(["partner.partner", "customer.customer"]),
  flow_type: chance.pickone(["Cash_out", "Cash_in"]),
  notes: chance.sentence({
    words: 10,
  }),
  address: chance.address(),
  amount: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  source_id: null,
  target_id: null,
  target_name: chance.name(),
  affect_creditor: chance.bool(),
  type: null,
  payment_method: null,
};

export const ADMIN_CASH_TRANSACTIONS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        status: "Draft",
        source_type: "stock.receiptorder",
        target_type: "partner.partner",
        flow_type: "Cash_out",
        notes: "",
        address: "",
        amount: "",
        source_id: null,
        target_id: null,
        target_name: "",
        affect_creditor: true,
        type: null,
        payment_method: null,
      }
    : ADMIN_CASH_TRANSACTIONS_POST_FAKE_DATA;

const ADMIN_CASH_TRANSACTIONS_TYPES_POST_FAKE_DATA = {
  name: "",
  is_business_activity: chance.bool(),
  description: chance.sentence({
    words: 10,
  }),
};

export const ADMIN_CASH_TRANSACTIONS_TYPES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        name: "",
        is_business_activity: true,
        description: "",
      }
    : ADMIN_CASH_TRANSACTIONS_TYPES_POST_FAKE_DATA;

const ADMIN_CUSTOMERS_DRAFTS_POST_FAKE_DATA = {
  avatar: null,
  email: chance.email({
    domain: "gmail.com",
  }),
  main_phone_number: "+84".concat(
    chance
      .integer({
        min: 770000000,
        max: 779999999,
      })
      .toString()
  ),
  first_name: chance.first(),
  last_name: "",
  note: chance.sentence({
    words: 10,
  }),
  birthday: new Date(chance.birthday()).toISOString(),
  gender: chance.pickone(["Male", "Female", "Other"]),
  facebook: chance.url({}),
  tax_identification_number: "",
  company_name: chance.name(),
  in_business: chance.bool(),
  type: null,
};

export const ADMIN_CUSTOMERS_DRAFTS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        avatar: null,
        email: "",
        main_phone_number: "+84",
        first_name: "",
        last_name: "",
        note: "",
        birthday: null,
        gender: "Male",
        facebook: "",
        tax_identification_number: "",
        company_name: "",
        in_business: true,
        type: null,
      }
    : ADMIN_CUSTOMERS_DRAFTS_POST_FAKE_DATA;

const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_FAKE_DATA = {
  line1: chance.address(),
  line2: "",
  district: ["D_772", "Quận 11"],
  ward: ["W_27211", "Phường 05"],
  province: ["P_79", "Thành phố Hồ Chí Minh"],
  postcode: "",
  phone_number: "+84".concat(
    chance
      .integer({
        min: 770000000,
        max: 779999999,
      })
      .toString()
  ),
  notes: chance.sentence({
    words: 10,
  }),
  is_default_for_shipping: chance.bool(),
  is_default_for_shipping_ecom: chance.bool(),
  is_default_for_billing: chance.bool(),
  country: "VN",
  user: null,
};

export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        line1: "",
        line2: "",
        district: null,
        ward: null,
        province: null,
        postcode: "",
        phone_number: "+84",
        notes: "",
        is_default_for_shipping: true,
        is_default_for_shipping_ecom: true,
        is_default_for_billing: true,
        country: "VN",
        user: null,
      }
    : ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_FAKE_DATA;

const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_FAKE_DATA = {
  token: "",
};

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        token: "",
      }
    : ADMIN_CUSTOMERS_DRAFTS_WITH_ID_APPLY_POST_FAKE_DATA;

const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_FAKE_DATA = {
  token: "",
};

export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        token: "",
      }
    : ADMIN_CUSTOMERS_DRAFTS_WITH_ID_REFUSE_POST_FAKE_DATA;

const ADMIN_CUSTOMERS_TYPES_POST_FAKE_DATA = {
  name: chance.name(),
  description: chance.sentence({
    words: 10,
  }),
  parent: null,
};

export const ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        name: "",
        description: "",
        parent: null,
      }
    : ADMIN_CUSTOMERS_TYPES_POST_FAKE_DATA;

const ADMIN_DISCOUNTS_POST_FAKE_DATA = {
  name: chance.name(),
  date_start: new Date().toISOString(),
  date_end: new Date(
    chance.date({
      year: parseInt(chance.exp_year()),
    })
  ).toISOString(),
};

export const ADMIN_DISCOUNTS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        name: "",
        date_start: null,
        date_end: null,
      }
    : ADMIN_DISCOUNTS_POST_FAKE_DATA;

const ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_FAKE_DATA = {
  category: null,
  discount_type: chance.pickone(["Percentage", "Absolute"]),
  discount_amount: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  usage_limit: chance.integer({
    min: 0,
    max: 1000000,
  }),
  variant: null,
  sale: null,
};

export const ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        category: null,
        discount_type: "Percentage",
        discount_amount: "",
        usage_limit: 0,
        variant: null,
        sale: null,
      }
    : ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_POST_FAKE_DATA;

const ADMIN_DISCOUNTS_VOUCHERS_POST_FAKE_DATA = {
  type: chance.pickone(["Entire_order", "Shipping", "Specific_product_variant"]),
  name: chance.name(),
  code: "",
  description: chance.sentence({
    words: 10,
  }),
  usage_limit: chance.integer({
    min: 0,
    max: 1000000,
  }),
  date_start: new Date().toISOString(),
  date_end: new Date(
    chance.date({
      year: parseInt(chance.exp_year()),
    })
  ).toISOString(),
  apply_once_per_order: chance.bool(),
  apply_once_per_customer: chance.bool(),
  discount_type: chance.pickone(["Percentage", "Absolute"]),
  discount_amount: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  min_spent_amount: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  min_checkout_items_quantity: chance.integer({
    min: 0,
    max: 50,
  }),
};

export const ADMIN_DISCOUNTS_VOUCHERS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        type: "Entire_order",
        name: "",
        code: "",
        description: "",
        usage_limit: 0,
        date_start: null,
        date_end: null,
        apply_once_per_order: true,
        apply_once_per_customer: true,
        discount_type: "Percentage",
        discount_amount: "",
        min_spent_amount: "",
        min_checkout_items_quantity: 0,
      }
    : ADMIN_DISCOUNTS_VOUCHERS_POST_FAKE_DATA;

const ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_FAKE_DATA = {
  category: null,
  variant: null,
  voucher: null,
};

export const ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        category: null,
        variant: null,
        voucher: null,
      }
    : ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_POST_FAKE_DATA;

const ADMIN_ORDERS_POST_FAKE_DATA = {
  receiver: null,
  receiver_name: chance.name(),
  receiver_email: chance.email({
    domain: "gmail.com",
  }),
  receiver_phone_number: "+84".concat(
    chance
      .integer({
        min: 770000000,
        max: 779999999,
      })
      .toString()
  ),
  status: "Draft",
  customer_notes: chance.sentence({
    words: 10,
  }),
  channel: null,
  shipping_method: null,
};

export const ADMIN_ORDERS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        receiver: null,
        receiver_name: "",
        receiver_email: "",
        receiver_phone_number: "+84",
        status: "Draft",
        customer_notes: "",
        channel: null,
        shipping_method: null,
      }
    : ADMIN_ORDERS_POST_FAKE_DATA;

const ADMIN_ORDERS_BILLING_ADDRESSES_POST_FAKE_DATA = {
  order: null,
  line1: chance.address(),
  line2: "",
  ward: ["W_27211", "Phường 05"],
  district: ["D_772", "Quận 11"],
  province: ["P_79", "Thành phố Hồ Chí Minh"],
  country: "VN",
  postcode: "",
  phone_number: "+84".concat(
    chance
      .integer({
        min: 770000000,
        max: 779999999,
      })
      .toString()
  ),
  notes: chance.sentence({
    words: 10,
  }),
};

export const ADMIN_ORDERS_BILLING_ADDRESSES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        order: null,
        line1: "",
        line2: "",
        ward: null,
        district: null,
        province: null,
        country: "VN",
        postcode: "",
        phone_number: "+84",
        notes: "",
      }
    : ADMIN_ORDERS_BILLING_ADDRESSES_POST_FAKE_DATA;

const ADMIN_ORDERS_INVOICES_POST_FAKE_DATA = {
  order: null,
  status: "Draft",
  shipping_status: "Pending",
  cod: chance.bool(),
  shipping_incl_tax: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  shipping_excl_tax: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  surcharge: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  shipper: null,
};

export const ADMIN_ORDERS_INVOICES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        order: null,
        status: "Draft",
        shipping_status: "Pending",
        cod: true,
        shipping_incl_tax: "",
        shipping_excl_tax: "",
        surcharge: "",
        shipper: null,
      }
    : ADMIN_ORDERS_INVOICES_POST_FAKE_DATA;

const ADMIN_ORDERS_INVOICES_QUANTITIES_POST_FAKE_DATA = {
  line: null,
  invoice: null,
  unit_quantity: chance.integer({
    min: 0,
    max: 50,
  }),
  record: null,
  warehouse: null,
};

export const ADMIN_ORDERS_INVOICES_QUANTITIES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        line: null,
        invoice: null,
        unit_quantity: 0,
        record: null,
        warehouse: null,
      }
    : ADMIN_ORDERS_INVOICES_QUANTITIES_POST_FAKE_DATA;

const ADMIN_ORDERS_LINES_POST_FAKE_DATA = {
  discount_type: chance.pickone(["Percentage", "Absolute"]),
  discount_amount: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  order: null,
  variant: null,
  unit: "",
  unit_quantity: chance.integer({
    min: 0,
    max: 50,
  }),
};

export const ADMIN_ORDERS_LINES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        discount_type: "Percentage",
        discount_amount: "",
        order: null,
        variant: null,
        unit: "",
        unit_quantity: 1,
      }
    : ADMIN_ORDERS_LINES_POST_FAKE_DATA;

const ADMIN_ORDERS_PURCHASE_CHANNELS_POST_FAKE_DATA = {
  name: chance.name(),
  description: chance.sentence({
    words: 10,
  }),
};

export const ADMIN_ORDERS_PURCHASE_CHANNELS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        name: "",
        description: "",
      }
    : ADMIN_ORDERS_PURCHASE_CHANNELS_POST_FAKE_DATA;

const ADMIN_ORDERS_SHIPPERS_POST_FAKE_DATA = {
  user: null,
  name: chance.name(),
};

export const ADMIN_ORDERS_SHIPPERS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        user: null,
        name: "",
      }
    : ADMIN_ORDERS_SHIPPERS_POST_FAKE_DATA;

const ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_FAKE_DATA = {
  order: null,
  line1: chance.address(),
  line2: "",
  ward: ["W_27211", "Phường 05"],
  district: ["D_772", "Quận 11"],
  province: ["P_79", "Thành phố Hồ Chí Minh"],
  country: "VN",
  postcode: "",
  phone_number: "+84".concat(
    chance
      .integer({
        min: 770000000,
        max: 779999999,
      })
      .toString()
  ),
  notes: chance.sentence({
    words: 10,
  }),
};

export const ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        order: null,
        line1: "",
        line2: "",
        ward: null,
        district: null,
        province: null,
        country: "VN",
        postcode: "",
        phone_number: "+84",
        notes: "",
      }
    : ADMIN_ORDERS_SHIPPING_ADDRESSES_POST_FAKE_DATA;

const ADMIN_ORDERS_SHIPPING_METHODS_POST_FAKE_DATA = {
  name: chance.name(),
  type: chance.pickone(["Price", "Weight"]),
  price: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  price_incl_tax: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  minimum_order_price: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  maximum_order_price: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  minimum_order_weight: chance.integer({
    min: 0,
    max: 1000000,
  }),
  maximum_order_weight: chance.integer({
    max: 1000000,
  }),
};

export const ADMIN_ORDERS_SHIPPING_METHODS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        name: "",
        type: "Price",
        price: "",
        price_incl_tax: "",
        minimum_order_price: "",
        maximum_order_price: "",
        minimum_order_weight: 0,
        maximum_order_weight: 0,
      }
    : ADMIN_ORDERS_SHIPPING_METHODS_POST_FAKE_DATA;

const ADMIN_PARTNERS_POST_FAKE_DATA = {
  max_debt: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  name: chance.name(),
  tax_identification_number: "",
  notes: chance.sentence({
    words: 10,
  }),
  email: chance.email({
    domain: "gmail.com",
  }),
  contact_info: chance.sentence({
    words: 10,
  }),
};

export const ADMIN_PARTNERS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        max_debt: "",
        name: "",
        tax_identification_number: "",
        notes: "",
        email: "",
        contact_info: "",
      }
    : ADMIN_PARTNERS_POST_FAKE_DATA;

const ADMIN_PARTNERS_ADDRESSES_POST_FAKE_DATA = {
  phone_number: "+84".concat(
    chance
      .integer({
        min: 770000000,
        max: 779999999,
      })
      .toString()
  ),
  line1: chance.address(),
  line2: "",
  district: ["D_772", "Quận 11"],
  ward: ["W_27211", "Phường 05"],
  province: ["P_79", "Thành phố Hồ Chí Minh"],
  postcode: "",
  country: "VN",
  partner: null,
};

export const ADMIN_PARTNERS_ADDRESSES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        phone_number: "+84",
        line1: "",
        line2: "",
        district: null,
        ward: null,
        province: null,
        postcode: "",
        country: "VN",
        partner: null,
      }
    : ADMIN_PARTNERS_ADDRESSES_POST_FAKE_DATA;

const ADMIN_PARTNERS_ITEMS_POST_FAKE_DATA = {
  partner_sku: "",
  price: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  price_incl_tax: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  partner: null,
  variant: null,
};

export const ADMIN_PARTNERS_ITEMS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        partner_sku: "",
        price: "",
        price_incl_tax: "",
        partner: null,
        variant: null,
      }
    : ADMIN_PARTNERS_ITEMS_POST_FAKE_DATA;

const ADMIN_PRODUCTS_POST_FAKE_DATA = {
  product_class: null,
  publication_date: new Date().toISOString(),
  is_published: chance.bool(),
  meta_title: chance.sentence({
    words: 10,
  }),
  meta_description: "",
  seo_title: chance.sentence({
    words: 10,
  }),
  seo_description: "",
  name: chance.name(),
  description: chance.sentence({
    words: 10,
  }),
  available_for_purchase: new Date().toISOString(),
};

export const ADMIN_PRODUCTS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        product_class: null,
        publication_date: null,
        is_published: true,
        meta_title: "",
        meta_description: "",
        seo_title: "",
        seo_description: "",
        name: "",
        description: "",
        available_for_purchase: null,
      }
    : ADMIN_PRODUCTS_POST_FAKE_DATA;

const ADMIN_PRODUCTS_ATTRIBUTES_POST_FAKE_DATA = {
  input_type: chance.pickone(["Option", "Multi_option"]),
  name: chance.name(),
  is_variant_only: chance.bool(),
};

export const ADMIN_PRODUCTS_ATTRIBUTES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        input_type: "Option",
        name: "",
        is_variant_only: true,
      }
    : ADMIN_PRODUCTS_ATTRIBUTES_POST_FAKE_DATA;

const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_FAKE_DATA = {
  name: "",
  value: "",
  attribute: null,
};

export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        name: "",
        value: "",
        attribute: null,
      }
    : ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_POST_FAKE_DATA;

const ADMIN_PRODUCTS_CATEGORIES_POST_FAKE_DATA = {
  parent: null,
  name: chance.name(),
  description: chance.sentence({
    words: 10,
  }),
  image: null,
  image_alt: "",
};

export const ADMIN_PRODUCTS_CATEGORIES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        parent: null,
        name: "",
        description: "",
        image: null,
        image_alt: "",
      }
    : ADMIN_PRODUCTS_CATEGORIES_POST_FAKE_DATA;

const ADMIN_PRODUCTS_IMAGES_POST_FAKE_DATA = {
  image: null,
  sort_order: chance.integer({
    min: 0,
    max: 1000000,
  }),
  alt: chance.sentence({
    words: 10,
  }),
  product: null,
};

export const ADMIN_PRODUCTS_IMAGES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        image: null,
        sort_order: 0,
        alt: "",
        product: null,
      }
    : ADMIN_PRODUCTS_IMAGES_POST_FAKE_DATA;

const ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_FAKE_DATA = {
  category: null,
  product: null,
};

export const ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        category: null,
        product: null,
      }
    : ADMIN_PRODUCTS_PRODUCT_CATEGORIES_POST_FAKE_DATA;

const ADMIN_PRODUCTS_RECOMMENDATIONS_POST_FAKE_DATA = {
  ranking: null,
  primary: null,
  recommendation: null,
};

export const ADMIN_PRODUCTS_RECOMMENDATIONS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        ranking: null,
        primary: null,
        recommendation: null,
      }
    : ADMIN_PRODUCTS_RECOMMENDATIONS_POST_FAKE_DATA;

const ADMIN_PRODUCTS_TYPES_POST_FAKE_DATA = {
  name: chance.name(),
  tax_rate: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 100,
    })
    .toString(),
  has_variants: chance.bool(),
};

export const ADMIN_PRODUCTS_TYPES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        name: "",
        tax_rate: "",
        has_variants: true,
      }
    : ADMIN_PRODUCTS_TYPES_POST_FAKE_DATA;

const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_FAKE_DATA = {
  attribute: null,
  product_class: null,
};

export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        attribute: null,
        product_class: null,
      }
    : ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_POST_FAKE_DATA;

const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_FAKE_DATA = {
  attribute: null,
  product_class: null,
};

export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        attribute: null,
        product_class: null,
      }
    : ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_POST_FAKE_DATA;

const ADMIN_PRODUCTS_VARIANTS_POST_FAKE_DATA = {
  track_inventory: chance.bool(),
  is_default: chance.bool(),
  product: null,
  editable_sku: "",
  unit: "",
  weight: chance.integer({
    min: 0,
    max: 1000000,
  }),
  bar_code: "",
  name: chance.name(),
  price_incl_tax: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  list_id_values: "",
};

export const ADMIN_PRODUCTS_VARIANTS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        track_inventory: true,
        is_default: true,
        product: null,
        editable_sku: "",
        unit: "",
        weight: 0,
        bar_code: "",
        name: "",
        price_incl_tax: "",
        list_id_values: "",
      }
    : ADMIN_PRODUCTS_VARIANTS_POST_FAKE_DATA;

const ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_FAKE_DATA = {
  variant: null,
  image: chance.integer({
    max: 1000000,
  }),
};

export const ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        variant: null,
        image: 0,
      }
    : ADMIN_PRODUCTS_VARIANTS_IMAGES_POST_FAKE_DATA;

const ADMIN_PRODUCTS_VARIANTS_UNITS_POST_FAKE_DATA = {
  editable_sku: "",
  unit: "",
  multiply: chance.integer({
    min: 1,
    max: 1000000,
  }),
  weight: chance.integer({
    min: 0,
    max: 1000000,
  }),
  bar_code: "",
  price_incl_tax: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  variant: null,
};

export const ADMIN_PRODUCTS_VARIANTS_UNITS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        editable_sku: "",
        unit: "",
        multiply: 1,
        weight: 0,
        bar_code: "",
        price_incl_tax: "",
        variant: null,
      }
    : ADMIN_PRODUCTS_VARIANTS_UNITS_POST_FAKE_DATA;

const ADMIN_USERS_POST_FAKE_DATA = {
  avatar: null,
  username: "",
  email: chance.email({
    domain: "gmail.com",
  }),
  main_phone_number: "+84".concat(
    chance
      .integer({
        min: 770000000,
        max: 779999999,
      })
      .toString()
  ),
  first_name: chance.first(),
  last_name: "",
  note: chance.sentence({
    words: 10,
  }),
  birthday: new Date(chance.birthday()).toISOString(),
  gender: chance.pickone(["Male", "Female", "Other"]),
  facebook: chance.url({}),
  is_staff: chance.bool(),
  is_active: chance.bool(),
};

export const ADMIN_USERS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        avatar: null,
        username: "",
        email: "",
        main_phone_number: "+84",
        first_name: "",
        last_name: "",
        note: "",
        birthday: null,
        gender: "Male",
        facebook: "",
        is_staff: true,
        is_active: true,
      }
    : ADMIN_USERS_POST_FAKE_DATA;

const ADMIN_USERS_ADDRESSES_POST_FAKE_DATA = {
  line1: chance.address(),
  line2: "",
  district: ["D_772", "Quận 11"],
  ward: ["W_27211", "Phường 05"],
  province: ["P_79", "Thành phố Hồ Chí Minh"],
  postcode: "",
  phone_number: "+84".concat(
    chance
      .integer({
        min: 770000000,
        max: 779999999,
      })
      .toString()
  ),
  notes: chance.sentence({
    words: 10,
  }),
  is_default_for_shipping: chance.bool(),
  is_default_for_billing: chance.bool(),
  country: "VN",
  user: null,
};

export const ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        line1: "",
        line2: "",
        district: null,
        ward: null,
        province: null,
        postcode: "",
        phone_number: "+84",
        notes: "",
        is_default_for_shipping: true,
        is_default_for_billing: true,
        country: "VN",
        user: null,
      }
    : ADMIN_USERS_ADDRESSES_POST_FAKE_DATA;

const ADMIN_USERS_PERMISSIONS_POST_FAKE_DATA = {
  user: null,
  permission: null,
};

export const ADMIN_USERS_PERMISSIONS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        user: null,
        permission: null,
      }
    : ADMIN_USERS_PERMISSIONS_POST_FAKE_DATA;

const ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_FAKE_DATA = {
  token: "",
};

export const ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        token: "",
      }
    : ADMIN_USERS_WITH_ID_RESET_PASSWORD_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_POST_FAKE_DATA = {
  name: chance.name(),
  manager: null,
};

export const ADMIN_WAREHOUSES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        name: "",
        manager: null,
      }
    : ADMIN_WAREHOUSES_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_ADDRESSES_POST_FAKE_DATA = {
  line1: chance.address(),
  line2: "",
  district: ["D_772", "Quận 11"],
  ward: ["W_27211", "Phường 05"],
  province: ["P_79", "Thành phố Hồ Chí Minh"],
  postcode: "",
  country: "VN",
  warehouse: null,
  phone_number: "+84".concat(
    chance
      .integer({
        min: 770000000,
        max: 779999999,
      })
      .toString()
  ),
};

export const ADMIN_WAREHOUSES_ADDRESSES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        line1: "",
        line2: "",
        district: null,
        ward: null,
        province: null,
        postcode: "",
        country: "VN",
        warehouse: null,
        phone_number: "+84",
      }
    : ADMIN_WAREHOUSES_ADDRESSES_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_OUT_NOTES_POST_FAKE_DATA = {
  status: "Draft",
  direction: chance.pickone(["in", "out"]),
  reason: chance.pickone([
    "customer_return",
    "partner_return",
    "ecommerce_return",
    "storage_miss_match",
    "product_expiration",
    "other",
  ]),
  shipping_incl_tax: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  shipping_excl_tax: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  amount: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  amount_incl_tax: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  notes: chance.sentence({
    words: 10,
  }),
  warehouse: null,
};

export const ADMIN_WAREHOUSES_OUT_NOTES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        status: "Draft",
        direction: "in",
        reason: "customer_return",
        shipping_incl_tax: "",
        shipping_excl_tax: "",
        amount: "",
        amount_incl_tax: "",
        notes: "",
        warehouse: null,
      }
    : ADMIN_WAREHOUSES_OUT_NOTES_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_FAKE_DATA = {
  unit: "",
  variant: null,
  record: null,
  stock_out_note: null,
  unit_quantity: chance.integer({
    min: 0,
    max: 50,
  }),
};

export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        unit: "",
        variant: null,
        record: null,
        stock_out_note: null,
        unit_quantity: 1,
      }
    : ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_FAKE_DATA = {
  status: "Draft",
  notes: chance.sentence({
    words: 10,
  }),
  warehouse: null,
  partner: null,
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        status: "Draft",
        notes: "",
        warehouse: null,
        partner: null,
      }
    : ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_FAKE_DATA = {
  discount_type: chance.pickone(["Percentage", "Absolute"]),
  discount_amount: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  order: null,
  quantity: chance.integer({
    min: 0,
    max: 50,
  }),
  offer_description: chance.sentence({
    words: 10,
  }),
  variant: null,
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        discount_type: "Percentage",
        discount_amount: "",
        order: null,
        quantity: 1,
        offer_description: "",
        variant: null,
      }
    : ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_FAKE_DATA = {
  order: null,
  status: "Draft",
  surcharge: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  notes: chance.sentence({
    words: 10,
  }),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        order: null,
        status: "Draft",
        surcharge: "",
        notes: "",
      }
    : ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_FAKE_DATA = {
  order: null,
  line: null,
  expiration_date: new Date(
    chance.date({
      year: parseInt(chance.exp_year()),
    })
  ).toISOString(),
  notes: chance.sentence({
    words: 10,
  }),
  quantity: chance.integer({
    min: 0,
    max: 50,
  }),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        order: null,
        line: null,
        expiration_date: null,
        notes: "",
        quantity: 1,
      }
    : ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_FAKE_DATA = {
  order: null,
  status: "Draft",
  surcharge: chance
    .floating({
      min: 0,
      fixed: 2,
      max: 1000000,
    })
    .toString(),
  notes: chance.sentence({
    words: 10,
  }),
};

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        order: null,
        status: "Draft",
        surcharge: "",
        notes: "",
      }
    : ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_FAKE_DATA;

const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_FAKE_DATA =
  {
    order: null,
    receipt_order_quantity: chance.integer({
      min: 0,
      max: 50,
    }),
    quantity: chance.integer({
      min: 0,
      max: 50,
    }),
  };

export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_DEFAULT_VALUE =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? {
        order: null,
        receipt_order_quantity: 0,
        quantity: 1,
      }
    : ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_FAKE_DATA;
