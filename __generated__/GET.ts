export const ADMIN_EXPORT_FILES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_EXPORT_FILES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
};
export const CHOICES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
};
export const CHOICES_CONVERT_DIVISIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    country: { required: false, type: "string" },
    ward: { required: true, type: "string" },
    district: { required: true, type: "string" },
    province: { required: true, type: "string" },
  },
  additionalProperties: false,
};
export const CHOICES_COUNTRY_DIVISIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    country: { required: false, type: "string" },
    step: { type: "integer" },
    value: { required: true, type: "string" },
  },
  additionalProperties: false,
};
export const CHOICES_SEARCH_COUNTRY_DIVISIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    country: { required: false, type: "string" },
    step: { type: "integer" },
    value: { required: true, type: "string" },
  },
  additionalProperties: false,
};
export const PRODUCTS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    is_visible: { description: "", required: false, type: "string" },
    publication_date_start: { description: "", required: false, type: "string" },
    publication_date_end: { description: "", required: false, type: "string" },
    is_published: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    product_class: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    recommendation_of: { description: "", required: false, type: "number" },
    price_start: { description: "", required: false, type: "number" },
    price_end: { description: "", required: false, type: "number" },
    product_attribute: { description: "", required: false, type: "number" },
    variant_attribute: { description: "", required: false, type: "number" },
    partner: { description: "", required: false, type: "number" },
    available_for_purchase_start: { description: "", required: false, type: "string" },
    available_for_purchase_end: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    recommended_by_product: { description: "", required: false, type: "number" },
    recommended_product: { description: "", required: false, type: "number" },
    attributerelated: { description: "", required: false, type: "number" },
    is_below_threshold_in_warehouse: { description: "", required: false, type: "number" },
    ids: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "number",
    },
    ordering: { description: "", required: false, type: "string" },
    search: { description: "A search term.", required: false, type: "string" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_ATTRIBUTES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    is_variant_only: { description: "", required: false, type: "string" },
    product_class: { description: "", required: false, type: "number" },
    not_in_product_class: { description: "", required: false, type: "number" },
    input_type: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    product_type: { description: "", required: false, type: "number" },
    product_variant_type: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_ATTRIBUTES_OPTIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    is_used: { description: "", required: false, type: "string" },
    product_assignment: { description: "", required: false, type: "number" },
    variant_assignment: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    is_used: { description: "", required: false, type: "string" },
    product_assignment: { description: "", required: false, type: "number" },
    variant_assignment: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_ATTRIBUTES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    is_variant_only: { description: "", required: false, type: "string" },
    product_class: { description: "", required: false, type: "number" },
    not_in_product_class: { description: "", required: false, type: "number" },
    input_type: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    product_type: { description: "", required: false, type: "number" },
    product_variant_type: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_CATEGORIES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    name: { description: "", required: false, type: "string" },
    product: { description: "", required: false, type: "number" },
    parent: { description: "", required: false, type: "number" },
    level: { description: "", required: false, type: "number" },
    not_have_products: { description: "", required: false, type: "string" },
    is_leaf: { description: "", required: false, type: "string" },
    is_descendant_of: { description: "", required: false, type: "number" },
    is_not_descendant_of: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_CATEGORIES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    name: { description: "", required: false, type: "string" },
    product: { description: "", required: false, type: "number" },
    parent: { description: "", required: false, type: "number" },
    level: { description: "", required: false, type: "number" },
    not_have_products: { description: "", required: false, type: "string" },
    is_leaf: { description: "", required: false, type: "string" },
    is_descendant_of: { description: "", required: false, type: "number" },
    is_not_descendant_of: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_IMAGES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_IMAGES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_PRODUCT_CATEGORIES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_PRODUCT_CATEGORIES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_RECOMMENDATIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    primary: { description: "", required: false, type: "number" },
    recommendation: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_RECOMMENDATIONS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    primary: { description: "", required: false, type: "number" },
    recommendation: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    name: { description: "", required: false, type: "string" },
    has_variants: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    product_attribute: { description: "", required: false, type: "number" },
    variant_attribute: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    assigned_product: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    assignment: { description: "", required: false, type: "number" },
    value: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    assignment: { description: "", required: false, type: "number" },
    value: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    assigned_product: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_VARIANT_ATTRIBUTES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    is_used: { description: "", required: false, type: "string" },
    assigned_variant: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    assignment: { description: "", required: false, type: "number" },
    value: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    assignment: { description: "", required: false, type: "number" },
    value: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_VARIANT_ATTRIBUTES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    is_used: { description: "", required: false, type: "string" },
    assigned_variant: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_TYPES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    name: { description: "", required: false, type: "string" },
    has_variants: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    product_attribute: { description: "", required: false, type: "number" },
    variant_attribute: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_VARIANTS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    sku: { description: "", required: false, type: "string" },
    product: { description: "", required: false, type: "number" },
    bar_code: { description: "", required: false, type: "string" },
    list_id_values: { description: "", required: false, type: "string" },
    partner: { description: "", required: false, type: "number" },
    not_in_partner: { description: "", required: false, type: "number" },
    stock_out_note: { description: "", required: false, type: "number" },
    not_in_stock_out_note: { description: "", required: false, type: "number" },
    purchase_order: { description: "", required: false, type: "number" },
    not_in_purchase_order: { description: "", required: false, type: "number" },
    not_in_sale: { description: "", required: false, type: "number" },
    is_available_in_warehouse: { description: "", required: false, type: "number" },
    is_not_available_in_warehouse: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    price_end: { description: "", required: false, type: "number" },
    price_start: { description: "", required: false, type: "number" },
    available_for_purchase_start: { description: "", required: false, type: "string" },
    available_for_purchase_end: { description: "", required: false, type: "string" },
    is_visible: { description: "", required: false, type: "string" },
    publication_date_start: { description: "", required: false, type: "string" },
    publication_date_end: { description: "", required: false, type: "string" },
    is_published: { description: "", required: false, type: "string" },
    attributerelated: { description: "", required: false, type: "number" },
    image: { description: "", required: false, type: "number" },
    is_below_threshold_in_warehouse: { description: "", required: false, type: "number" },
    voucher: { description: "", required: false, type: "number" },
    not_in_voucher: { description: "", required: false, type: "number" },
    order: { description: "", required: false, type: "number" },
    not_in_order: { description: "", required: false, type: "number" },
    sale: { description: "", required: false, type: "number" },
    is_discounted: { description: "", required: false, type: "string" },
    is_available: { description: "", required: false, type: "string" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_VARIANTS_IMAGES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    image: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_VARIANTS_IMAGES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    image: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const PRODUCTS_VARIANTS_UNITS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    limit: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    offset: {
      description: "The initial index from which to return the results.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const PRODUCTS_VARIANTS_UNITS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { variant: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const PRODUCTS_VARIANTS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    sku: { description: "", required: false, type: "string" },
    product: { description: "", required: false, type: "number" },
    bar_code: { description: "", required: false, type: "string" },
    list_id_values: { description: "", required: false, type: "string" },
    partner: { description: "", required: false, type: "number" },
    not_in_partner: { description: "", required: false, type: "number" },
    stock_out_note: { description: "", required: false, type: "number" },
    not_in_stock_out_note: { description: "", required: false, type: "number" },
    purchase_order: { description: "", required: false, type: "number" },
    not_in_purchase_order: { description: "", required: false, type: "number" },
    not_in_sale: { description: "", required: false, type: "number" },
    is_available_in_warehouse: { description: "", required: false, type: "number" },
    is_not_available_in_warehouse: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    price_end: { description: "", required: false, type: "number" },
    price_start: { description: "", required: false, type: "number" },
    available_for_purchase_start: { description: "", required: false, type: "string" },
    available_for_purchase_end: { description: "", required: false, type: "string" },
    is_visible: { description: "", required: false, type: "string" },
    publication_date_start: { description: "", required: false, type: "string" },
    publication_date_end: { description: "", required: false, type: "string" },
    is_published: { description: "", required: false, type: "string" },
    attributerelated: { description: "", required: false, type: "number" },
    image: { description: "", required: false, type: "number" },
    is_below_threshold_in_warehouse: { description: "", required: false, type: "number" },
    voucher: { description: "", required: false, type: "number" },
    not_in_voucher: { description: "", required: false, type: "number" },
    order: { description: "", required: false, type: "number" },
    not_in_order: { description: "", required: false, type: "number" },
    sale: { description: "", required: false, type: "number" },
    is_discounted: { description: "", required: false, type: "string" },
    is_available: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const PRODUCTS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    is_visible: { description: "", required: false, type: "string" },
    publication_date_start: { description: "", required: false, type: "string" },
    publication_date_end: { description: "", required: false, type: "string" },
    is_published: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    product_class: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    recommendation_of: { description: "", required: false, type: "number" },
    price_start: { description: "", required: false, type: "number" },
    price_end: { description: "", required: false, type: "number" },
    product_attribute: { description: "", required: false, type: "number" },
    variant_attribute: { description: "", required: false, type: "number" },
    partner: { description: "", required: false, type: "number" },
    available_for_purchase_start: { description: "", required: false, type: "string" },
    available_for_purchase_end: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    recommended_by_product: { description: "", required: false, type: "number" },
    recommended_product: { description: "", required: false, type: "number" },
    attributerelated: { description: "", required: false, type: "number" },
    is_below_threshold_in_warehouse: { description: "", required: false, type: "number" },
    ids: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "number",
    },
    ordering: { description: "", required: false, type: "string" },
    search: { description: "A search term.", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const SETTINGS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
};
export const ADMIN_CASH_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_CASH_DEBT_RECORDS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    source_type: { description: "", required: false, type: "string" },
    source_id: { description: "", required: false, type: "number" },
    creditor_type: { description: "", required: false, type: "string" },
    creditor_id: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_CASH_DEBT_RECORDS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    source_type: { description: "", required: false, type: "string" },
    source_id: { description: "", required: false, type: "number" },
    creditor_type: { description: "", required: false, type: "string" },
    creditor_id: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_CASH_PAYMENT_METHODS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_CASH_PAYMENT_METHODS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_CASH_TRANSACTIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    type: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    source_type: { description: "", required: false, type: "string" },
    source_id: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
    flow_type: { description: "", required: false, type: "string" },
    target_type: { description: "", required: false, type: "string" },
    target_id: { description: "", required: false, type: "number" },
    payment_method: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    date_confirmed_start: { description: "", required: false, type: "string" },
    date_confirmed_end: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_CASH_TRANSACTIONS_TYPES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    is_used: { description: "", required: false, type: "string" },
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_CASH_TRANSACTIONS_TYPES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    is_used: { description: "", required: false, type: "string" },
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_CASH_TRANSACTIONS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    type: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    source_type: { description: "", required: false, type: "string" },
    source_id: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
    flow_type: { description: "", required: false, type: "string" },
    target_type: { description: "", required: false, type: "string" },
    target_id: { description: "", required: false, type: "number" },
    payment_method: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    date_confirmed_start: { description: "", required: false, type: "string" },
    date_confirmed_end: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_CASH_TRANSACTIONS_WITH_ID_PDF_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    type: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    source_type: { description: "", required: false, type: "string" },
    source_id: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
    flow_type: { description: "", required: false, type: "string" },
    target_type: { description: "", required: false, type: "string" },
    target_id: { description: "", required: false, type: "number" },
    payment_method: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    date_confirmed_start: { description: "", required: false, type: "string" },
    date_confirmed_end: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    ordering: {
      description: "Which field to use when ordering the results.",
      required: false,
      type: "string",
    },
    email: { description: "", required: false, type: "string" },
    gender: { description: "", required: false, type: "string" },
    country: { description: "", required: false, type: "string" },
    province: { description: "", required: false, type: "string" },
    district: { description: "", required: false, type: "string" },
    ward: { description: "", required: false, type: "string" },
    main_phone_number: { description: "", required: false, type: "string" },
    tax_identification_number: { description: "", required: false, type: "string" },
    type: { description: "", required: false, type: "number" },
    date_joined_start: { description: "", required: false, type: "string" },
    date_joined_end: { description: "", required: false, type: "string" },
    birthday_start: { description: "", required: false, type: "string" },
    birthday_end: { description: "", required: false, type: "string" },
    sales_in_charge: { description: "", required: false, type: "number" },
    in_business: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_ADDRESSES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    is_default_for_shipping: { description: "", required: false, type: "string" },
    is_default_for_shipping_ecom: { description: "", required: false, type: "string" },
    is_default_for_billing: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_ADDRESSES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    is_default_for_shipping: { description: "", required: false, type: "string" },
    is_default_for_shipping_ecom: { description: "", required: false, type: "string" },
    is_default_for_billing: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_DRAFTS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    ordering: {
      description: "Which field to use when ordering the results.",
      required: false,
      type: "string",
    },
    email: { description: "", required: false, type: "string" },
    gender: { description: "", required: false, type: "string" },
    country: { description: "", required: false, type: "string" },
    province: { description: "", required: false, type: "string" },
    district: { description: "", required: false, type: "string" },
    ward: { description: "", required: false, type: "string" },
    main_phone_number: { description: "", required: false, type: "string" },
    tax_identification_number: { description: "", required: false, type: "string" },
    type: { description: "", required: false, type: "number" },
    official_customer: { description: "", required: false, type: "number" },
    official_customer_isnull: { description: "", required: false, type: "string" },
    is_mutated: { description: "", required: false, type: "string" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    birthday_start: { description: "", required: false, type: "string" },
    birthday_end: { description: "", required: false, type: "string" },
    sales_in_charge: { description: "", required: false, type: "number" },
    in_business: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    is_default_for_shipping: { description: "", required: false, type: "string" },
    is_default_for_shipping_ecom: { description: "", required: false, type: "string" },
    is_default_for_billing: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    is_default_for_shipping: { description: "", required: false, type: "string" },
    is_default_for_shipping_ecom: { description: "", required: false, type: "string" },
    is_default_for_billing: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_DRAFTS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    ordering: {
      description: "Which field to use when ordering the results.",
      required: false,
      type: "string",
    },
    email: { description: "", required: false, type: "string" },
    gender: { description: "", required: false, type: "string" },
    country: { description: "", required: false, type: "string" },
    province: { description: "", required: false, type: "string" },
    district: { description: "", required: false, type: "string" },
    ward: { description: "", required: false, type: "string" },
    main_phone_number: { description: "", required: false, type: "string" },
    tax_identification_number: { description: "", required: false, type: "string" },
    type: { description: "", required: false, type: "number" },
    official_customer: { description: "", required: false, type: "number" },
    official_customer_isnull: { description: "", required: false, type: "string" },
    is_mutated: { description: "", required: false, type: "string" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    birthday_start: { description: "", required: false, type: "string" },
    birthday_end: { description: "", required: false, type: "string" },
    sales_in_charge: { description: "", required: false, type: "number" },
    in_business: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_TYPES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    parent: { description: "", required: false, type: "number" },
    level: { description: "", required: false, type: "number" },
    is_descendant_of: { description: "", required: false, type: "number" },
    is_not_descendant_of: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_TYPES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    parent: { description: "", required: false, type: "number" },
    level: { description: "", required: false, type: "number" },
    is_descendant_of: { description: "", required: false, type: "number" },
    is_not_descendant_of: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_CUSTOMERS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    ordering: {
      description: "Which field to use when ordering the results.",
      required: false,
      type: "string",
    },
    email: { description: "", required: false, type: "string" },
    gender: { description: "", required: false, type: "string" },
    country: { description: "", required: false, type: "string" },
    province: { description: "", required: false, type: "string" },
    district: { description: "", required: false, type: "string" },
    ward: { description: "", required: false, type: "string" },
    main_phone_number: { description: "", required: false, type: "string" },
    tax_identification_number: { description: "", required: false, type: "string" },
    type: { description: "", required: false, type: "number" },
    date_joined_start: { description: "", required: false, type: "string" },
    date_joined_end: { description: "", required: false, type: "string" },
    birthday_start: { description: "", required: false, type: "string" },
    birthday_end: { description: "", required: false, type: "string" },
    sales_in_charge: { description: "", required: false, type: "number" },
    in_business: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_DISCOUNTS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    variant: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    sale: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    sale: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_DISCOUNTS_VOUCHERS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    code: { description: "", required: false, type: "string" },
    type: { description: "", required: false, type: "string" },
    variant: { description: "", required: false, type: "number" },
    can_be_used: { description: "", required: false, type: "string" },
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
    discount_type: { description: "", required: false, type: "string" },
    discount_amount_start: { description: "", required: false, type: "number" },
    discount_amount_end: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    voucher: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_DISCOUNTS_VOUCHERS_DISCOUNTED_VARIANTS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    voucher: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_DISCOUNTS_VOUCHERS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    code: { description: "", required: false, type: "string" },
    type: { description: "", required: false, type: "string" },
    variant: { description: "", required: false, type: "number" },
    can_be_used: { description: "", required: false, type: "string" },
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
    discount_type: { description: "", required: false, type: "string" },
    discount_amount_start: { description: "", required: false, type: "number" },
    discount_amount_end: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_DISCOUNTS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    variant: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "string" },
    date_end: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_ME_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
};
export const ADMIN_ME_ADDRESSES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ME_ADDRESSES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
};
export const ADMIN_ME_PERMISSIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ME_PERMISSIONS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
};
export const ADMIN_ORDERS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    channel: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    receiver: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    shipping_method: { description: "", required: false, type: "number" },
    shipping_address_country: { description: "", required: false, type: "string" },
    shipping_address_province: { description: "", required: false, type: "string" },
    shipping_address_district: { description: "", required: false, type: "string" },
    shipping_address_ward: { description: "", required: false, type: "string" },
    date_placed_start: { description: "", required: false, type: "string" },
    date_placed_end: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    invoice_sid_icontains: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_BILLING_ADDRESSES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    order: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_BILLING_ADDRESSES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { order: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    order: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    line: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    shipping_status: { description: "", required: false, type: "string" },
    can_be_paid: { description: "", required: false, type: "string" },
    is_discounted: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    order_owner: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    receiver: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_amount: { description: "", required: false, type: "boolean" },
    with_sum_amount_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_amount_before_discounts: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_sum_amount_before_discounts_incl_tax: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_sum_base_amount: { description: "", required: false, type: "boolean" },
    with_sum_base_amount_incl_tax: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_QUANTITIES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    line: { description: "", required: false, type: "number" },
    invoice: { description: "", required: false, type: "number" },
    warehouse: { description: "", required: false, type: "number" },
    record: { description: "", required: false, type: "number" },
    variant_sku: { description: "", required: false, type: "string" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    shipping_status: { description: "", required: false, type: "string" },
    status: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_amount: { description: "", required: false, type: "boolean" },
    with_sum_amount_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_amount_before_discounts: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_sum_amount_before_discounts_incl_tax: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_sum_base_amount: { description: "", required: false, type: "boolean" },
    with_sum_base_amount_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_unit_quantity: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_QUANTITIES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    line: { description: "", required: false, type: "number" },
    invoice: { description: "", required: false, type: "number" },
    warehouse: { description: "", required: false, type: "number" },
    record: { description: "", required: false, type: "number" },
    variant_sku: { description: "", required: false, type: "string" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    shipping_status: { description: "", required: false, type: "string" },
    status: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_SHIPPING_STATUS_CHANGES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    invoice: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_SHIPPING_STATUS_CHANGES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { invoice: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_STATUS_CHANGES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    invoice: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_STATUS_CHANGES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { invoice: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    order: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    line: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    shipping_status: { description: "", required: false, type: "string" },
    can_be_paid: { description: "", required: false, type: "string" },
    is_discounted: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    order_owner: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    receiver: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_WITH_ID_PDF_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    order: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    line: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    shipping_status: { description: "", required: false, type: "string" },
    can_be_paid: { description: "", required: false, type: "string" },
    is_discounted: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    order_owner: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    receiver: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_INVOICES_WITH_ID_SHIPPING_PDF_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    order: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    line: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    shipping_status: { description: "", required: false, type: "string" },
    can_be_paid: { description: "", required: false, type: "string" },
    is_discounted: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    order_owner: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    receiver: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_LINES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    order: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    invoice: { description: "", required: false, type: "number" },
    not_in_invoice: { description: "", required: false, type: "number" },
    invoice_with_warehouse: { description: "", required: false, type: "number" },
    not_in_invoice_with_warehouse: { description: "", required: false, type: "number" },
    can_add_to_invoice: { description: "", required: false, type: "string" },
    order__status: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "string",
    },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_quantity: { description: "", required: false, type: "boolean" },
    with_sum_unit_quantity: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_LINES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    order: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    invoice: { description: "", required: false, type: "number" },
    not_in_invoice: { description: "", required: false, type: "number" },
    invoice_with_warehouse: { description: "", required: false, type: "number" },
    not_in_invoice_with_warehouse: { description: "", required: false, type: "number" },
    can_add_to_invoice: { description: "", required: false, type: "string" },
    order__status: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "string",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_PURCHASE_CHANNELS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    name: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_PURCHASE_CHANNELS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { name: { description: "", required: false, type: "string" } },
  additionalProperties: false,
};
export const ADMIN_ORDERS_SHIPPERS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_SHIPPERS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { user: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const ADMIN_ORDERS_SHIPPING_ADDRESSES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    order: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_SHIPPING_ADDRESSES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { order: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const ADMIN_ORDERS_SHIPPING_METHODS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    type: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_SHIPPING_METHODS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { type: { description: "", required: false, type: "string" } },
  additionalProperties: false,
};
export const ADMIN_ORDERS_STATUS_CHANGES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    order: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_STATUS_CHANGES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { order: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const ADMIN_ORDERS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    channel: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    receiver: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    shipping_method: { description: "", required: false, type: "number" },
    shipping_address_country: { description: "", required: false, type: "string" },
    shipping_address_province: { description: "", required: false, type: "string" },
    shipping_address_district: { description: "", required: false, type: "string" },
    shipping_address_ward: { description: "", required: false, type: "string" },
    date_placed_start: { description: "", required: false, type: "string" },
    date_placed_end: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    invoice_sid_icontains: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_ORDERS_WITH_ID_PDF_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    channel: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    receiver: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    shipping_method: { description: "", required: false, type: "number" },
    shipping_address_country: { description: "", required: false, type: "string" },
    shipping_address_province: { description: "", required: false, type: "string" },
    shipping_address_district: { description: "", required: false, type: "string" },
    shipping_address_ward: { description: "", required: false, type: "string" },
    date_placed_start: { description: "", required: false, type: "string" },
    date_placed_end: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    invoice_sid_icontains: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_PARTNERS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    ordering: {
      description: "Which field to use when ordering the results.",
      required: false,
      type: "string",
    },
    name: { description: "", required: false, type: "string" },
    country: { description: "", required: false, type: "string" },
    province: { description: "", required: false, type: "string" },
    district: { description: "", required: false, type: "string" },
    ward: { description: "", required: false, type: "string" },
    total_debt_amount_start: { description: "", required: false, type: "number" },
    total_debt_amount_end: { description: "", required: false, type: "number" },
    total_purchase_start: { description: "", required: false, type: "number" },
    total_purchase_end: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PARTNERS_ADDRESSES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    partner: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PARTNERS_ADDRESSES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { partner: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const ADMIN_PARTNERS_ITEMS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    partner: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    partner_sku: { description: "", required: false, type: "string" },
    purchase_order: { description: "", required: false, type: "number" },
    not_in_purchase_order: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PARTNERS_ITEMS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    partner: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    partner_sku: { description: "", required: false, type: "string" },
    purchase_order: { description: "", required: false, type: "number" },
    not_in_purchase_order: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PARTNERS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    ordering: {
      description: "Which field to use when ordering the results.",
      required: false,
      type: "string",
    },
    name: { description: "", required: false, type: "string" },
    country: { description: "", required: false, type: "string" },
    province: { description: "", required: false, type: "string" },
    district: { description: "", required: false, type: "string" },
    ward: { description: "", required: false, type: "string" },
    total_debt_amount_start: { description: "", required: false, type: "number" },
    total_debt_amount_end: { description: "", required: false, type: "number" },
    total_purchase_start: { description: "", required: false, type: "number" },
    total_purchase_end: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PERMISSIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    not_in_user: { description: "", required: false, type: "number" },
    content_type: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PERMISSIONS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    not_in_user: { description: "", required: false, type: "number" },
    content_type: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    is_visible: { description: "", required: false, type: "string" },
    publication_date_start: { description: "", required: false, type: "string" },
    publication_date_end: { description: "", required: false, type: "string" },
    is_published: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    product_class: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    recommendation_of: { description: "", required: false, type: "number" },
    price_start: { description: "", required: false, type: "number" },
    price_end: { description: "", required: false, type: "number" },
    product_attribute: { description: "", required: false, type: "number" },
    variant_attribute: { description: "", required: false, type: "number" },
    partner: { description: "", required: false, type: "number" },
    available_for_purchase_start: { description: "", required: false, type: "string" },
    available_for_purchase_end: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    recommended_by_product: { description: "", required: false, type: "number" },
    recommended_product: { description: "", required: false, type: "number" },
    attributerelated: { description: "", required: false, type: "number" },
    is_below_threshold_in_warehouse: { description: "", required: false, type: "number" },
    ids: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "number",
    },
    ordering: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_ATTRIBUTES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    is_variant_only: { description: "", required: false, type: "string" },
    product_class: { description: "", required: false, type: "number" },
    not_in_product_class: { description: "", required: false, type: "number" },
    input_type: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    product_type: { description: "", required: false, type: "number" },
    product_variant_type: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    is_used: { description: "", required: false, type: "string" },
    product_assignment: { description: "", required: false, type: "number" },
    variant_assignment: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_ATTRIBUTES_OPTIONS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    is_used: { description: "", required: false, type: "string" },
    product_assignment: { description: "", required: false, type: "number" },
    variant_assignment: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_ATTRIBUTES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    is_variant_only: { description: "", required: false, type: "string" },
    product_class: { description: "", required: false, type: "number" },
    not_in_product_class: { description: "", required: false, type: "number" },
    input_type: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    product_type: { description: "", required: false, type: "number" },
    product_variant_type: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_CATEGORIES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    product: { description: "", required: false, type: "number" },
    parent: { description: "", required: false, type: "number" },
    level: { description: "", required: false, type: "number" },
    not_have_products: { description: "", required: false, type: "string" },
    is_leaf: { description: "", required: false, type: "string" },
    is_descendant_of: { description: "", required: false, type: "number" },
    is_not_descendant_of: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_CATEGORIES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    product: { description: "", required: false, type: "number" },
    parent: { description: "", required: false, type: "number" },
    level: { description: "", required: false, type: "number" },
    not_have_products: { description: "", required: false, type: "string" },
    is_leaf: { description: "", required: false, type: "string" },
    is_descendant_of: { description: "", required: false, type: "number" },
    is_not_descendant_of: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_IMAGES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_IMAGES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_PRODUCT_CATEGORIES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_PRODUCT_CATEGORIES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_RECOMMENDATIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    primary: { description: "", required: false, type: "number" },
    recommendation: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_RECOMMENDATIONS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    primary: { description: "", required: false, type: "number" },
    recommendation: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    name: { description: "", required: false, type: "string" },
    has_variants: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    product_attribute: { description: "", required: false, type: "number" },
    variant_attribute: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    assigned_product: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    assignment: { description: "", required: false, type: "number" },
    value: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_VALUES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    product: { description: "", required: false, type: "number" },
    assignment: { description: "", required: false, type: "number" },
    value: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_PRODUCT_ATTRIBUTES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    assigned_product: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    is_used: { description: "", required: false, type: "string" },
    assigned_variant: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    assignment: { description: "", required: false, type: "number" },
    value: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_VALUES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    assignment: { description: "", required: false, type: "number" },
    value: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    attribute: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    is_used: { description: "", required: false, type: "string" },
    assigned_variant: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_TYPES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    name: { description: "", required: false, type: "string" },
    has_variants: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    product_attribute: { description: "", required: false, type: "number" },
    variant_attribute: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_VARIANTS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    sku: { description: "", required: false, type: "string" },
    product: { description: "", required: false, type: "number" },
    bar_code: { description: "", required: false, type: "string" },
    list_id_values: { description: "", required: false, type: "string" },
    partner: { description: "", required: false, type: "number" },
    not_in_partner: { description: "", required: false, type: "number" },
    stock_out_note: { description: "", required: false, type: "number" },
    not_in_stock_out_note: { description: "", required: false, type: "number" },
    purchase_order: { description: "", required: false, type: "number" },
    not_in_purchase_order: { description: "", required: false, type: "number" },
    not_in_sale: { description: "", required: false, type: "number" },
    is_available_in_warehouse: { description: "", required: false, type: "number" },
    is_not_available_in_warehouse: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    price_end: { description: "", required: false, type: "number" },
    price_start: { description: "", required: false, type: "number" },
    available_for_purchase_start: { description: "", required: false, type: "string" },
    available_for_purchase_end: { description: "", required: false, type: "string" },
    is_visible: { description: "", required: false, type: "string" },
    publication_date_start: { description: "", required: false, type: "string" },
    publication_date_end: { description: "", required: false, type: "string" },
    is_published: { description: "", required: false, type: "string" },
    attributerelated: { description: "", required: false, type: "number" },
    image: { description: "", required: false, type: "number" },
    is_below_threshold_in_warehouse: { description: "", required: false, type: "number" },
    voucher: { description: "", required: false, type: "number" },
    not_in_voucher: { description: "", required: false, type: "number" },
    order: { description: "", required: false, type: "number" },
    not_in_order: { description: "", required: false, type: "number" },
    sale: { description: "", required: false, type: "number" },
    is_discounted: { description: "", required: false, type: "string" },
    is_available: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_VARIANTS_IMAGES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    image: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_VARIANTS_IMAGES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    image: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_VARIANTS_UNITS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    variant: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { variant: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_VARIANTS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    sku: { description: "", required: false, type: "string" },
    product: { description: "", required: false, type: "number" },
    bar_code: { description: "", required: false, type: "string" },
    list_id_values: { description: "", required: false, type: "string" },
    partner: { description: "", required: false, type: "number" },
    not_in_partner: { description: "", required: false, type: "number" },
    stock_out_note: { description: "", required: false, type: "number" },
    not_in_stock_out_note: { description: "", required: false, type: "number" },
    purchase_order: { description: "", required: false, type: "number" },
    not_in_purchase_order: { description: "", required: false, type: "number" },
    not_in_sale: { description: "", required: false, type: "number" },
    is_available_in_warehouse: { description: "", required: false, type: "number" },
    is_not_available_in_warehouse: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    product_class: { description: "", required: false, type: "number" },
    price_end: { description: "", required: false, type: "number" },
    price_start: { description: "", required: false, type: "number" },
    available_for_purchase_start: { description: "", required: false, type: "string" },
    available_for_purchase_end: { description: "", required: false, type: "string" },
    is_visible: { description: "", required: false, type: "string" },
    publication_date_start: { description: "", required: false, type: "string" },
    publication_date_end: { description: "", required: false, type: "string" },
    is_published: { description: "", required: false, type: "string" },
    attributerelated: { description: "", required: false, type: "number" },
    image: { description: "", required: false, type: "number" },
    is_below_threshold_in_warehouse: { description: "", required: false, type: "number" },
    voucher: { description: "", required: false, type: "number" },
    not_in_voucher: { description: "", required: false, type: "number" },
    order: { description: "", required: false, type: "number" },
    not_in_order: { description: "", required: false, type: "number" },
    sale: { description: "", required: false, type: "number" },
    is_discounted: { description: "", required: false, type: "string" },
    is_available: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_PRODUCTS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    is_visible: { description: "", required: false, type: "string" },
    publication_date_start: { description: "", required: false, type: "string" },
    publication_date_end: { description: "", required: false, type: "string" },
    is_published: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    product_class: { description: "", required: false, type: "number" },
    category: { description: "", required: false, type: "number" },
    recommendation_of: { description: "", required: false, type: "number" },
    price_start: { description: "", required: false, type: "number" },
    price_end: { description: "", required: false, type: "number" },
    product_attribute: { description: "", required: false, type: "number" },
    variant_attribute: { description: "", required: false, type: "number" },
    partner: { description: "", required: false, type: "number" },
    available_for_purchase_start: { description: "", required: false, type: "string" },
    available_for_purchase_end: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    recommended_by_product: { description: "", required: false, type: "number" },
    recommended_product: { description: "", required: false, type: "number" },
    attributerelated: { description: "", required: false, type: "number" },
    is_below_threshold_in_warehouse: { description: "", required: false, type: "number" },
    ids: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "number",
    },
    ordering: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_CASH_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    period: { description: "", required: false, type: "number" },
    period_unit: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_CUSTOMER_WITH_DEBT_AMOUNT_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_beginning_debt_amount: { description: "", required: false, type: "boolean" },
    with_sum_credit: { description: "", required: false, type: "boolean" },
    with_sum_debit: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_CUSTOMER_WITH_REVENUE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_invoice_count: { description: "", required: false, type: "boolean" },
    with_sum_revenue: { description: "", required: false, type: "boolean" },
    with_sum_revenue_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_net_revenue: { description: "", required: false, type: "boolean" },
    with_sum_net_revenue_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_base_amount: { description: "", required: false, type: "boolean" },
    with_sum_base_amount_incl_tax: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_GENERAL_NET_REVENUE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
};
export const ADMIN_REPORTS_NET_REVENUE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    purchase_channel: { description: "", required: false, type: "number" },
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    period: { description: "", required: false, type: "number" },
    period_unit: { description: "", required: false, type: "string" },
    chart_num: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_PARTNER_WITH_DEBT_AMOUNT_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_beginning_debt_amount: { description: "", required: false, type: "boolean" },
    with_sum_credit: { description: "", required: false, type: "boolean" },
    with_sum_debit: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_purchase_amount: { description: "", required: false, type: "boolean" },
    with_sum_purchase_amount_incl_tax: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_sum_return_amount: { description: "", required: false, type: "boolean" },
    with_sum_return_amount_incl_tax: {
      description: "",
      required: false,
      type: "boolean",
    },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_PRODUCT_WITH_IO_INVENTORY_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    sku: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    category: { description: "", required: false, type: "number" },
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_current_price: { description: "", required: false, type: "boolean" },
    with_sum_current_price_incl_tax: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_total_current_price_till_date_end: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_total_current_price_incl_tax_till_date_end: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_sum_current_base_price: { description: "", required: false, type: "boolean" },
    with_sum_current_base_price_incl_tax: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_total_current_base_price_till_date_end: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_total_current_base_price_incl_tax_till_date_end: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_sum_beginning_amount: { description: "", required: false, type: "boolean" },
    with_sum_total_input_amount: { description: "", required: false, type: "boolean" },
    with_sum_total_output_amount: { description: "", required: false, type: "boolean" },
    with_sum_beginning_quantity: { description: "", required: false, type: "boolean" },
    with_sum_input_quantity: { description: "", required: false, type: "boolean" },
    with_sum_output_quantity: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    sku: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    category: { description: "", required: false, type: "number" },
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_current_price: { description: "", required: false, type: "boolean" },
    with_sum_current_price_incl_tax: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_total_current_price_till_date_end: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_total_current_price_incl_tax_till_date_end: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_sum_current_base_price: { description: "", required: false, type: "boolean" },
    with_sum_current_base_price_incl_tax: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_total_current_base_price_till_date_end: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_total_current_base_price_incl_tax_till_date_end: {
      description: "",
      required: false,
      type: "boolean",
    },
    with_sum_beginning_amount: { description: "", required: false, type: "boolean" },
    with_sum_total_input_amount: { description: "", required: false, type: "boolean" },
    with_sum_total_output_amount: { description: "", required: false, type: "boolean" },
    with_sum_beginning_quantity: { description: "", required: false, type: "boolean" },
    with_sum_input_quantity: { description: "", required: false, type: "boolean" },
    with_sum_output_quantity: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_PRODUCT_WITH_REVENUE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    sku: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    category: { description: "", required: false, type: "number" },
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_invoice_count: { description: "", required: false, type: "boolean" },
    with_sum_quantity: { description: "", required: false, type: "boolean" },
    with_sum_revenue: { description: "", required: false, type: "boolean" },
    with_sum_revenue_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_net_revenue: { description: "", required: false, type: "boolean" },
    with_sum_net_revenue_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_base_amount: { description: "", required: false, type: "boolean" },
    with_sum_base_amount_incl_tax: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_REVENUE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    purchase_channel: { description: "", required: false, type: "number" },
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    period: { description: "", required: false, type: "number" },
    period_unit: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_invoice_count: { description: "", required: false, type: "boolean" },
    with_sum_revenue: { description: "", required: false, type: "boolean" },
    with_sum_revenue_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_net_revenue: { description: "", required: false, type: "boolean" },
    with_sum_net_revenue_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_base_amount: { description: "", required: false, type: "boolean" },
    with_sum_base_amount_incl_tax: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_STAFF_WITH_REVENUE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
    purchase_channel: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_invoice_count: { description: "", required: false, type: "boolean" },
    with_sum_revenue: { description: "", required: false, type: "boolean" },
    with_sum_revenue_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_net_revenue: { description: "", required: false, type: "boolean" },
    with_sum_net_revenue_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_base_amount: { description: "", required: false, type: "boolean" },
    with_sum_base_amount_incl_tax: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_TOP_CUSTOMER_BY_DEBT_AMOUNT_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    top: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_TOP_CUSTOMER_BY_NET_REVENUE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    top: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_TOP_PARTNER_BY_DEBT_AMOUNT_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    top: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_TOP_PARTNER_BY_RECEIPT_AMOUNT_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    top: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_TOP_PRODUCT_BY_NET_REVENUE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    sku: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    category: { description: "", required: false, type: "number" },
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    top: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_TOP_PRODUCT_BY_PROFIT_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    sku: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    category: { description: "", required: false, type: "number" },
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    top: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_TOP_PRODUCT_BY_QUANTITY_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    sku: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    category: { description: "", required: false, type: "number" },
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    top: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_TOP_PRODUCT_BY_ROS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    sku: { description: "", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    category: { description: "", required: false, type: "number" },
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    top: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_REPORTS_TOP_STAFF_BY_NET_REVENUE_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    date_end: { description: "", required: false, type: "number" },
    date_start: { description: "", required: false, type: "number" },
    top: { description: "", required: false, type: "number" },
    name: { description: "", required: false, type: "string" },
    purchase_channel: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_SETTINGS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
};
export const ADMIN_USERS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    is_staff: { description: "", required: false, type: "string" },
    is_active: { description: "", required: false, type: "string" },
    username: { description: "", required: false, type: "string" },
    email: { description: "", required: false, type: "string" },
    main_phone_number: { description: "", required: false, type: "string" },
    first_name: { description: "", required: false, type: "string" },
    last_name: { description: "", required: false, type: "string" },
    is_not_customer: { description: "", required: false, type: "string" },
    is_not_shipper: { description: "", required: false, type: "string" },
    gender: { description: "", required: false, type: "string" },
    birthday_start: { description: "", required: false, type: "string" },
    birthday_end: { description: "", required: false, type: "string" },
    permission: { description: "", required: false, type: "number" },
    not_have_permission: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_USERS_ADDRESSES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    is_default_for_shipping: { description: "", required: false, type: "string" },
    is_default_for_shipping_ecom: { description: "", required: false, type: "string" },
    is_default_for_billing: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_USERS_ADDRESSES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    is_default_for_shipping: { description: "", required: false, type: "string" },
    is_default_for_shipping_ecom: { description: "", required: false, type: "string" },
    is_default_for_billing: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_USERS_PERMISSIONS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    permission: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_USERS_PERMISSIONS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    user: { description: "", required: false, type: "number" },
    permission: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_USERS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    is_staff: { description: "", required: false, type: "string" },
    is_active: { description: "", required: false, type: "string" },
    username: { description: "", required: false, type: "string" },
    email: { description: "", required: false, type: "string" },
    main_phone_number: { description: "", required: false, type: "string" },
    first_name: { description: "", required: false, type: "string" },
    last_name: { description: "", required: false, type: "string" },
    is_not_customer: { description: "", required: false, type: "string" },
    is_not_shipper: { description: "", required: false, type: "string" },
    gender: { description: "", required: false, type: "string" },
    birthday_start: { description: "", required: false, type: "string" },
    birthday_end: { description: "", required: false, type: "string" },
    permission: { description: "", required: false, type: "number" },
    not_have_permission: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_USERS_WITH_ID_RESET_PASSWORD_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    is_staff: { description: "", required: false, type: "string" },
    is_active: { description: "", required: false, type: "string" },
    username: { description: "", required: false, type: "string" },
    email: { description: "", required: false, type: "string" },
    main_phone_number: { description: "", required: false, type: "string" },
    first_name: { description: "", required: false, type: "string" },
    last_name: { description: "", required: false, type: "string" },
    is_not_customer: { description: "", required: false, type: "string" },
    is_not_shipper: { description: "", required: false, type: "string" },
    gender: { description: "", required: false, type: "string" },
    birthday_start: { description: "", required: false, type: "string" },
    birthday_end: { description: "", required: false, type: "string" },
    permission: { description: "", required: false, type: "number" },
    not_have_permission: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    country: { description: "", required: false, type: "string" },
    province: { description: "", required: false, type: "string" },
    district: { description: "", required: false, type: "string" },
    ward: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_ADDRESSES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    warehouse: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: { warehouse: { description: "", required: false, type: "number" } },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_OUT_NOTES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    warehouse: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    total_start: { description: "", required: false, type: "number" },
    total_end: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    variant_name: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    can_be_paid: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    stock_out_note: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    variant_name: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    stock_out_note: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    variant_name: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    warehouse: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    total_start: { description: "", required: false, type: "number" },
    total_end: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    variant_name: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    can_be_paid: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PDF_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    warehouse: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    total_start: { description: "", required: false, type: "number" },
    total_end: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    variant_name: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    can_be_paid: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    warehouse: { description: "", required: false, type: "number" },
    partner: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    date_placed_day: { description: "", required: false, type: "number" },
    date_placed_month: { description: "", required: false, type: "number" },
    date_placed_year: { description: "", required: false, type: "number" },
    date_placed_start: { description: "", required: false, type: "string" },
    date_placed_end: { description: "", required: false, type: "string" },
    total_start: { description: "", required: false, type: "number" },
    total_end: { description: "", required: false, type: "number" },
    variant_name: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    receipt_order_sid_icontains: { description: "", required: false, type: "string" },
    return_order_sid_icontains: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    order: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    receipt_order: { description: "", required: false, type: "number" },
    not_in_receipt_order: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    order: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    receipt_order: { description: "", required: false, type: "number" },
    not_in_receipt_order: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    order: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    return_order: { description: "", required: false, type: "number" },
    not_in_return_order: { description: "", required: false, type: "number" },
    partner: { description: "", required: false, type: "number" },
    can_be_paid: { description: "", required: false, type: "string" },
    can_be_returned: { description: "", required: false, type: "string" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    statuses: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "string",
    },
    exclude_statuses: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "string",
    },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
    with_sum_amount: { description: "", required: false, type: "boolean" },
    with_sum_amount_incl_tax: { description: "", required: false, type: "boolean" },
    with_sum_item_count: { description: "", required: false, type: "boolean" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      line: { description: "", required: false, type: "number" },
      order: { description: "", required: false, type: "number" },
      page: {
        description: "A page number within the paginated result set.",
        required: false,
        type: "integer",
      },
      page_size: {
        description: "Number of results to return per page.",
        required: false,
        type: "integer",
      },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_WITH_ID_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      line: { description: "", required: false, type: "number" },
      order: { description: "", required: false, type: "number" },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      search: { description: "A search term.", required: false, type: "string" },
      order: { description: "", required: false, type: "number" },
      purchase_order: { description: "", required: false, type: "number" },
      status: { description: "", required: false, type: "string" },
      partner: { description: "", required: false, type: "number" },
      date_created_start: { description: "", required: false, type: "string" },
      date_created_end: { description: "", required: false, type: "string" },
      statuses: {
        description: "Multiple values may be separated by commas.",
        required: false,
        type: "string",
      },
      exclude_statuses: {
        description: "Multiple values may be separated by commas.",
        required: false,
        type: "string",
      },
      page: {
        description: "A page number within the paginated result set.",
        required: false,
        type: "integer",
      },
      page_size: {
        description: "Number of results to return per page.",
        required: false,
        type: "integer",
      },
      with_sum_amount: { description: "", required: false, type: "boolean" },
      with_sum_amount_incl_tax: { description: "", required: false, type: "boolean" },
      with_sum_item_count: { description: "", required: false, type: "boolean" },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      line: { description: "", required: false, type: "number" },
      order: { description: "", required: false, type: "number" },
      page: {
        description: "A page number within the paginated result set.",
        required: false,
        type: "integer",
      },
      page_size: {
        description: "Number of results to return per page.",
        required: false,
        type: "integer",
      },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_WITH_ID_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      line: { description: "", required: false, type: "number" },
      order: { description: "", required: false, type: "number" },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      search: { description: "A search term.", required: false, type: "string" },
      order: { description: "", required: false, type: "number" },
      purchase_order: { description: "", required: false, type: "number" },
      status: { description: "", required: false, type: "string" },
      partner: { description: "", required: false, type: "number" },
      date_created_start: { description: "", required: false, type: "string" },
      date_created_end: { description: "", required: false, type: "string" },
      statuses: {
        description: "Multiple values may be separated by commas.",
        required: false,
        type: "string",
      },
      exclude_statuses: {
        description: "Multiple values may be separated by commas.",
        required: false,
        type: "string",
      },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PDF_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      search: { description: "A search term.", required: false, type: "string" },
      order: { description: "", required: false, type: "number" },
      purchase_order: { description: "", required: false, type: "number" },
      status: { description: "", required: false, type: "string" },
      partner: { description: "", required: false, type: "number" },
      date_created_start: { description: "", required: false, type: "string" },
      date_created_end: { description: "", required: false, type: "string" },
      statuses: {
        description: "Multiple values may be separated by commas.",
        required: false,
        type: "string",
      },
      exclude_statuses: {
        description: "Multiple values may be separated by commas.",
        required: false,
        type: "string",
      },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_STATUS_CHANGES_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      order: { description: "", required: false, type: "number" },
      old_status: { description: "", required: false, type: "string" },
      new_status: { description: "", required: false, type: "string" },
      page: {
        description: "A page number within the paginated result set.",
        required: false,
        type: "integer",
      },
      page_size: {
        description: "Number of results to return per page.",
        required: false,
        type: "integer",
      },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_STATUS_CHANGES_WITH_ID_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      order: { description: "", required: false, type: "number" },
      old_status: { description: "", required: false, type: "string" },
      new_status: { description: "", required: false, type: "string" },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    order: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    return_order: { description: "", required: false, type: "number" },
    not_in_return_order: { description: "", required: false, type: "number" },
    partner: { description: "", required: false, type: "number" },
    can_be_paid: { description: "", required: false, type: "string" },
    can_be_returned: { description: "", required: false, type: "string" },
    date_created_start: { description: "", required: false, type: "string" },
    date_created_end: { description: "", required: false, type: "string" },
    statuses: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "string",
    },
    exclude_statuses: {
      description: "Multiple values may be separated by commas.",
      required: false,
      type: "string",
    },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PDF_GET_PARAM_SCHEMA =
  {
    type: "object",
    properties: {
      search: { description: "A search term.", required: false, type: "string" },
      order: { description: "", required: false, type: "number" },
      status: { description: "", required: false, type: "string" },
      return_order: { description: "", required: false, type: "number" },
      not_in_return_order: { description: "", required: false, type: "number" },
      partner: { description: "", required: false, type: "number" },
      can_be_paid: { description: "", required: false, type: "string" },
      can_be_returned: { description: "", required: false, type: "string" },
      date_created_start: { description: "", required: false, type: "string" },
      date_created_end: { description: "", required: false, type: "string" },
      statuses: {
        description: "Multiple values may be separated by commas.",
        required: false,
        type: "string",
      },
      exclude_statuses: {
        description: "Multiple values may be separated by commas.",
        required: false,
        type: "string",
      },
    },
    additionalProperties: false,
  };
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_STATUS_CHANGES_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    order: { description: "", required: false, type: "number" },
    old_status: { description: "", required: false, type: "string" },
    new_status: { description: "", required: false, type: "string" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_STATUS_CHANGES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    order: { description: "", required: false, type: "number" },
    old_status: { description: "", required: false, type: "string" },
    new_status: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    warehouse: { description: "", required: false, type: "number" },
    partner: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    date_placed_day: { description: "", required: false, type: "number" },
    date_placed_month: { description: "", required: false, type: "number" },
    date_placed_year: { description: "", required: false, type: "number" },
    date_placed_start: { description: "", required: false, type: "string" },
    date_placed_end: { description: "", required: false, type: "string" },
    total_start: { description: "", required: false, type: "number" },
    total_end: { description: "", required: false, type: "number" },
    variant_name: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    receipt_order_sid_icontains: { description: "", required: false, type: "string" },
    return_order_sid_icontains: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_PURCHASE_ORDERS_WITH_ID_PDF_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    warehouse: { description: "", required: false, type: "number" },
    partner: { description: "", required: false, type: "number" },
    owner: { description: "", required: false, type: "number" },
    status: { description: "", required: false, type: "string" },
    date_placed_day: { description: "", required: false, type: "number" },
    date_placed_month: { description: "", required: false, type: "number" },
    date_placed_year: { description: "", required: false, type: "number" },
    date_placed_start: { description: "", required: false, type: "string" },
    date_placed_end: { description: "", required: false, type: "string" },
    total_start: { description: "", required: false, type: "number" },
    total_end: { description: "", required: false, type: "number" },
    variant_name: { description: "", required: false, type: "string" },
    variant_sku: { description: "", required: false, type: "string" },
    sid_icontains: { description: "", required: false, type: "string" },
    receipt_order_sid_icontains: { description: "", required: false, type: "string" },
    return_order_sid_icontains: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_RECORDS_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    warehouse: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    stock_out_note: { description: "", required: false, type: "number" },
    not_in_stock_out_note: { description: "", required: false, type: "number" },
    order: { description: "", required: false, type: "number" },
    not_in_order: { description: "", required: false, type: "number" },
    can_add_to_invoice: { description: "", required: false, type: "string" },
    is_below_threshold: { description: "", required: false, type: "string" },
    quantity_gte: { description: "", required: false, type: "number" },
    page: {
      description: "A page number within the paginated result set.",
      required: false,
      type: "integer",
    },
    page_size: {
      description: "Number of results to return per page.",
      required: false,
      type: "integer",
    },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_RECORDS_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    warehouse: { description: "", required: false, type: "number" },
    variant: { description: "", required: false, type: "number" },
    stock_out_note: { description: "", required: false, type: "number" },
    not_in_stock_out_note: { description: "", required: false, type: "number" },
    order: { description: "", required: false, type: "number" },
    not_in_order: { description: "", required: false, type: "number" },
    can_add_to_invoice: { description: "", required: false, type: "string" },
    is_below_threshold: { description: "", required: false, type: "string" },
    quantity_gte: { description: "", required: false, type: "number" },
  },
  additionalProperties: false,
};
export const ADMIN_WAREHOUSES_WITH_ID_GET_PARAM_SCHEMA = {
  type: "object",
  properties: {
    search: { description: "A search term.", required: false, type: "string" },
    name: { description: "", required: false, type: "string" },
    country: { description: "", required: false, type: "string" },
    province: { description: "", required: false, type: "string" },
    district: { description: "", required: false, type: "string" },
    ward: { description: "", required: false, type: "string" },
    is_used: { description: "", required: false, type: "string" },
  },
  additionalProperties: false,
};
