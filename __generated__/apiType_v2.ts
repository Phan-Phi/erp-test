/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ADMIN_EXPORT_EXPORT_FILE_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Status
   * @minLength 1
   */
  status?: string;
  /**
   * Message
   * @minLength 1
   */
  message?: string;
  /** Type */
  type: "Invoice_quantity" | "Transaction" | "Debt_record";
  /**
   * File
   * @format uri
   */
  file?: string | null;
}

export interface LOGIN_LOGIN_VIEW_TYPE_V2 {
  /** Token */
  token?: string;
  /** Refresh token */
  refresh_token?: string;
  /** Csrf token */
  csrf_token?: string;
  /** Login as default */
  login_as_default: boolean;
}

export interface PRODUCT_PRODUCT_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Product class
   * @format uri
   */
  product_class?: string;
  /**
   * Default variant
   * @format uri
   */
  default_variant?: string;
  /**
   * Categories
   * @format uri
   */
  categories?: string;
  /**
   * Product categories
   * @format uri
   */
  product_categories?: string;
  /**
   * Recommended products
   * @format uri
   */
  recommended_products?: string;
  /**
   * Recommended by products
   * @format uri
   */
  recommended_by_products?: string;
  /**
   * Primary recommendations
   * @format uri
   */
  primary_recommendations?: string;
  /**
   * Recommendations
   * @format uri
   */
  recommendations?: string;
  /**
   * Variants
   * @format uri
   */
  variants?: string;
  /**
   * Attributes
   * @format uri
   */
  attributes?: string;
  /**
   * Attributesrelated
   * @format uri
   */
  attributesrelated?: string;
  /**
   * Images
   * @format uri
   */
  images?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Publication date
   * @format date-time
   */
  publication_date?: string;
  /** Is published */
  is_published?: boolean;
  /**
   * Meta title
   * @maxLength 255
   */
  meta_title?: string;
  /** Meta description */
  meta_description?: string;
  /**
   * Seo title
   * @maxLength 70
   */
  seo_title?: string;
  /**
   * Seo description
   * @maxLength 300
   */
  seo_description?: string;
  /**
   * Sku
   * @minLength 1
   */
  sku?: string;
  /**
   * Name
   * @minLength 1
   * @maxLength 250
   */
  name: string;
  /** Description */
  description?: string;
  /**
   * Available for purchase
   * @format date-time
   */
  available_for_purchase?: string | null;
}

export interface PRODUCT_ATTRIBUTE_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Product types
   * @format uri
   */
  product_types?: string;
  /**
   * Product variant types
   * @format uri
   */
  product_variant_types?: string;
  /**
   * Attributeproducts
   * @format uri
   */
  attributeproducts?: string;
  /**
   * Attributevariants
   * @format uri
   */
  attributevariants?: string;
  /**
   * Values
   * @format uri
   */
  values?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** Input type */
  input_type?: "Option" | "Multi_option";
  /** Is variant only */
  is_variant_only?: boolean;
}

export interface PRODUCT_ATTRIBUTE_VALUE_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Attribute
   * @format uri
   */
  attribute?: string;
  /**
   * Product assignments
   * @format uri
   */
  product_assignments?: string;
  /**
   * Variant assignments
   * @format uri
   */
  variant_assignments?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Name
   * @minLength 1
   * @maxLength 250
   */
  name: string;
  /**
   * Value
   * @minLength 1
   * @maxLength 100
   */
  value: string;
}

export interface PRODUCT_CATEGORY_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Parent
   * @format uri
   */
  parent?: string;
  /**
   * Image
   * @format uri
   */
  image?: string;
  /**
   * Children
   * @format uri
   */
  children?: string;
  /**
   * Products
   * @format uri
   */
  products?: string;
  /**
   * Product categories
   * @format uri
   */
  product_categories?: string;
  /** Lft */
  lft?: number;
  /** Rght */
  rght?: number;
  /** Tree id */
  tree_id?: number;
  /** Level */
  level?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 250
   */
  name: string;
  /** Description */
  description?: string;
  /**
   * Image alt
   * @maxLength 128
   */
  image_alt?: string;
}

export interface PRODUCT_PRODUCT_IMAGE_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Product
   * @format uri
   */
  product?: string;
  /**
   * Image
   * @format uri
   */
  image?: string;
  /**
   * Variant images
   * @format uri
   */
  variant_images?: string;
  /**
   * Variants
   * @format uri
   */
  variants?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Sort order
   * @min 0
   * @max 2147483647
   */
  sort_order?: number | null;
  /**
   * Alt
   * @maxLength 128
   */
  alt?: string;
}

export interface PRODUCT_PRODUCT_CATEGORY_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Category
   * @format uri
   */
  category?: string;
  /**
   * Product
   * @format uri
   */
  product?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
}

export interface PRODUCT_PRODUCT_RECOMMENDATION_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Primary
   * @format uri
   */
  primary?: string;
  /**
   * Recommendation
   * @format uri
   */
  recommendation?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Ranking
   * Determines order of the products. A product with a higher value will appear before one with a lower ranking.
   * @min 0
   * @max 32767
   */
  ranking?: number;
}

export interface PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Attributeproducts
   * @format uri
   */
  attributeproducts?: string;
  /**
   * Attributevariants
   * @format uri
   */
  attributevariants?: string;
  /**
   * Products
   * @format uri
   */
  products?: string;
  /**
   * Product attributes
   * @format uri
   */
  product_attributes?: string;
  /**
   * Variant attributes
   * @format uri
   */
  variant_attributes?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Name
   * @minLength 1
   * @maxLength 250
   */
  name: string;
  /**
   * Tax rate
   * @format decimal
   */
  tax_rate?: string;
  /** Has variants */
  has_variants?: boolean;
}

export interface PRODUCT_ATTRIBUTE_PRODUCT_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Attribute
   * @format uri
   */
  attribute?: string;
  /**
   * Product class
   * @format uri
   */
  product_class?: string;
  /**
   * Assigned products
   * @format uri
   */
  assigned_products?: string;
  /**
   * Product assignments
   * @format uri
   */
  product_assignments?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
}

export interface PRODUCT_ASSIGNED_PRODUCT_ATTRIBUTE_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Product
   * @format uri
   */
  product?: string;
  /**
   * Assignment
   * @format uri
   */
  assignment?: string;
  /**
   * Values
   * @format uri
   */
  values?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
}

export interface PRODUCT_ATTRIBUTE_VARIANT_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Attribute
   * @format uri
   */
  attribute?: string;
  /**
   * Product class
   * @format uri
   */
  product_class?: string;
  /**
   * Assigned variants
   * @format uri
   */
  assigned_variants?: string;
  /**
   * Variant assignments
   * @format uri
   */
  variant_assignments?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
}

export interface PRODUCT_ASSIGNED_VARIANT_ATTRIBUTE_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Variant
   * @format uri
   */
  variant?: string;
  /**
   * Assignment
   * @format uri
   */
  assignment?: string;
  /**
   * Values
   * @format uri
   */
  values?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * List id values
   * @minLength 1
   */
  list_id_values?: string;
}

export interface Weight {
  /**
   * Unit
   * @minLength 1
   */
  unit: string;
  /** Weight */
  weight: number;
}

export interface Price {
  /**
   * Currency
   * @minLength 1
   * @maxLength 12
   * @default "VND"
   */
  currency?: string;
  /**
   * Excl tax
   * @format decimal
   */
  excl_tax: string;
  /**
   * Incl tax
   * @format decimal
   */
  incl_tax?: string;
  /**
   * Tax
   * @format decimal
   */
  tax?: string;
}

export interface PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Product
   * @format uri
   */
  product?: string;
  /** Is default */
  is_default: boolean;
  /**
   * Units
   * @format uri
   */
  units?: string;
  /**
   * Variant images
   * @format uri
   */
  variant_images?: string;
  /**
   * Images
   * @format uri
   */
  images?: string;
  /**
   * Attributes
   * @format uri
   */
  attributes?: string;
  /**
   * Attributesrelated
   * @format uri
   */
  attributesrelated?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Sku
   * @minLength 1
   */
  sku?: string;
  /**
   * Editable sku
   * @minLength 1
   * @maxLength 255
   */
  editable_sku?: string;
  /**
   * Unit
   * @minLength 1
   * @maxLength 100
   */
  unit: string;
  weight?: Weight;
  /**
   * Bar code
   * @maxLength 100
   */
  bar_code?: string;
  /**
   * Name
   * @maxLength 255
   */
  name?: string;
  /** Track inventory */
  track_inventory?: boolean;
  price?: Price;
  /** Allocated quantity */
  allocated_quantity?: number;
  /**
   * List id values
   * @minLength 1
   * @default ""
   */
  list_id_values?: string;
  discounted_price?: Price;
}

export interface PRODUCT_VARIANT_IMAGE_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Variant
   * @format uri
   */
  variant?: string;
  /**
   * Image
   * @format uri
   */
  image?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
}

export interface PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Self
   * @format uri
   */
  self?: string;
  /**
   * Variant
   * @format uri
   */
  variant?: string;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Sku
   * @minLength 1
   */
  sku?: string;
  /**
   * Editable sku
   * @minLength 1
   * @maxLength 255
   */
  editable_sku?: string;
  /**
   * Unit
   * @minLength 1
   * @maxLength 100
   */
  unit: string;
  /**
   * Multiply
   * @min 1
   * @max 2147483647
   */
  multiply?: number;
  weight?: Weight;
  /**
   * Bar code
   * @maxLength 100
   */
  bar_code?: string;
  price?: Price;
  discounted_price?: Price;
}

export interface LOGIN_REFRESH_TOKEN_VIEW_TYPE_V2 {
  /** Token */
  token?: string;
}

export interface SITE_SETTINGS_SITE_SETTINGS_VIEW_TYPE_V2 {
  /** ID */
  id?: number;
  /**
   * Logo
   * @format uri
   */
  logo?: string | null;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Date updated
   * @format date-time
   */
  date_updated?: string;
  /**
   * Line1
   * @minLength 1
   * @maxLength 255
   */
  line1: string;
  /**
   * Line2
   * @maxLength 255
   */
  line2?: string;
  /**
   * Ward
   * @maxLength 255
   */
  ward?: string;
  /**
   * District
   * @maxLength 255
   */
  district?: string;
  /**
   * Province
   * @maxLength 255
   */
  province?: string;
  /** Country */
  country?:
    | "AF"
    | "AX"
    | "AL"
    | "DZ"
    | "AS"
    | "AD"
    | "AO"
    | "AI"
    | "AQ"
    | "AG"
    | "AR"
    | "AM"
    | "AW"
    | "AU"
    | "AT"
    | "AZ"
    | "BS"
    | "BH"
    | "BD"
    | "BB"
    | "BY"
    | "BE"
    | "BZ"
    | "BJ"
    | "BM"
    | "BT"
    | "BO"
    | "BQ"
    | "BA"
    | "BW"
    | "BV"
    | "BR"
    | "IO"
    | "BN"
    | "BG"
    | "BF"
    | "BI"
    | "CV"
    | "KH"
    | "CM"
    | "CA"
    | "KY"
    | "CF"
    | "TD"
    | "CL"
    | "CN"
    | "CX"
    | "CC"
    | "CO"
    | "KM"
    | "CG"
    | "CD"
    | "CK"
    | "CR"
    | "CI"
    | "HR"
    | "CU"
    | "CW"
    | "CY"
    | "CZ"
    | "DK"
    | "DJ"
    | "DM"
    | "DO"
    | "EC"
    | "EG"
    | "SV"
    | "GQ"
    | "ER"
    | "EE"
    | "SZ"
    | "ET"
    | "FK"
    | "FO"
    | "FJ"
    | "FI"
    | "FR"
    | "GF"
    | "PF"
    | "TF"
    | "GA"
    | "GM"
    | "GE"
    | "DE"
    | "GH"
    | "GI"
    | "GR"
    | "GL"
    | "GD"
    | "GP"
    | "GU"
    | "GT"
    | "GG"
    | "GN"
    | "GW"
    | "GY"
    | "HT"
    | "HM"
    | "VA"
    | "HN"
    | "HK"
    | "HU"
    | "IS"
    | "IN"
    | "ID"
    | "IR"
    | "IQ"
    | "IE"
    | "IM"
    | "IL"
    | "IT"
    | "JM"
    | "JP"
    | "JE"
    | "JO"
    | "KZ"
    | "KE"
    | "KI"
    | "KW"
    | "KG"
    | "LA"
    | "LV"
    | "LB"
    | "LS"
    | "LR"
    | "LY"
    | "LI"
    | "LT"
    | "LU"
    | "MO"
    | "MG"
    | "MW"
    | "MY"
    | "MV"
    | "ML"
    | "MT"
    | "MH"
    | "MQ"
    | "MR"
    | "MU"
    | "YT"
    | "MX"
    | "FM"
    | "MD"
    | "MC"
    | "MN"
    | "ME"
    | "MS"
    | "MA"
    | "MZ"
    | "MM"
    | "NA"
    | "NR"
    | "NP"
    | "NL"
    | "NC"
    | "NZ"
    | "NI"
    | "NE"
    | "NG"
    | "NU"
    | "NF"
    | "KP"
    | "MK"
    | "MP"
    | "NO"
    | "OM"
    | "PK"
    | "PW"
    | "PS"
    | "PA"
    | "PG"
    | "PY"
    | "PE"
    | "PH"
    | "PN"
    | "PL"
    | "PT"
    | "PR"
    | "QA"
    | "RE"
    | "RO"
    | "RU"
    | "RW"
    | "BL"
    | "SH"
    | "KN"
    | "LC"
    | "MF"
    | "PM"
    | "VC"
    | "WS"
    | "SM"
    | "ST"
    | "SA"
    | "SN"
    | "RS"
    | "SC"
    | "SL"
    | "SG"
    | "SX"
    | "SK"
    | "SI"
    | "SB"
    | "SO"
    | "ZA"
    | "GS"
    | "KR"
    | "SS"
    | "ES"
    | "LK"
    | "SD"
    | "SR"
    | "SJ"
    | "SE"
    | "CH"
    | "SY"
    | "TW"
    | "TJ"
    | "TZ"
    | "TH"
    | "TL"
    | "TG"
    | "TK"
    | "TO"
    | "TT"
    | "TN"
    | "TR"
    | "TM"
    | "TC"
    | "TV"
    | "UG"
    | "UA"
    | "AE"
    | "GB"
    | "UM"
    | "US"
    | "UY"
    | "UZ"
    | "VU"
    | "VE"
    | "VN"
    | "VG"
    | "VI"
    | "WF"
    | "EH"
    | "YE"
    | "ZM"
    | "ZW";
  /**
   * Postcode
   * @maxLength 64
   */
  postcode?: string;
  /**
   * Company name
   * @maxLength 254
   */
  company_name?: string;
  /**
   * Store name
   * @maxLength 100
   */
  store_name?: string;
  /** Store description */
  store_description?: string;
  /**
   * Store website
   * @format uri
   * @maxLength 200
   */
  store_website?: string;
  /**
   * Hotline 1
   * @maxLength 128
   */
  hotline_1?: string;
  /**
   * Hotline 2
   * @maxLength 128
   */
  hotline_2?: string;
  /**
   * Tax identification number
   * @maxLength 20
   */
  tax_identification_number?: string;
  /** Currency */
  currency?:
    | "ADP"
    | "AFA"
    | "ALK"
    | "AON"
    | "AOR"
    | "ARA"
    | "ARP"
    | "ATS"
    | "AZM"
    | "BAD"
    | "BEF"
    | "BGL"
    | "BRC"
    | "BRE"
    | "BRN"
    | "BRR"
    | "BYR"
    | "CLE"
    | "CSD"
    | "CSK"
    | "CYP"
    | "DDM"
    | "DEM"
    | "ECS"
    | "ECV"
    | "EEK"
    | "ESA"
    | "ESB"
    | "ESP"
    | "FIM"
    | "FRF"
    | "GHC"
    | "GRD"
    | "GWP"
    | "HRD"
    | "IEP"
    | "ITL"
    | "LTL"
    | "LUF"
    | "LVL"
    | "MGF"
    | "MLF"
    | "MRO"
    | "MTL"
    | "MZM"
    | "NLG"
    | "PEI"
    | "PLZ"
    | "PTE"
    | "ROL"
    | "RUR"
    | "SDD"
    | "SIT"
    | "SKK"
    | "SRG"
    | "STD"
    | "TJR"
    | "TMM"
    | "TPE"
    | "TRL"
    | "UAK"
    | "USS"
    | "VEB"
    | "VEF"
    | "VNN"
    | "XEU"
    | "YDD"
    | "YUM"
    | "YUN"
    | "ZAL"
    | "ZMK"
    | "ZRN"
    | "ZRZ"
    | "ZWD"
    | "ZWL"
    | "ZWR"
    | "AOK"
    | "ARL"
    | "ARM"
    | "BAN"
    | "BEC"
    | "BEL"
    | "BGM"
    | "BGO"
    | "BOL"
    | "BOP"
    | "BRB"
    | "BRZ"
    | "BUK"
    | "BYB"
    | "CNH"
    | "CNX"
    | "GEK"
    | "GNS"
    | "GQE"
    | "GWE"
    | "ILP"
    | "ILR"
    | "ISJ"
    | "KRH"
    | "KRO"
    | "LTT"
    | "LUC"
    | "LUL"
    | "LVR"
    | "MAF"
    | "MCF"
    | "MDC"
    | "MKN"
    | "MRU"
    | "MTP"
    | "MVP"
    | "MXP"
    | "MZE"
    | "NIC"
    | "PES"
    | "RHD"
    | "SDP"
    | "STN"
    | "SUR"
    | "UGS"
    | "UYP"
    | "UYW"
    | "VES"
    | "XRE"
    | "YUD"
    | "YUR"
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BBD"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BOV"
    | "BRL"
    | "BSD"
    | "BTN"
    | "BWP"
    | "BYN"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHE"
    | "CHF"
    | "CHW"
    | "CLF"
    | "CLP"
    | "CNY"
    | "COP"
    | "COU"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "EUR"
    | "FJD"
    | "FKP"
    | "GBP"
    | "GEL"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "ISK"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MMK"
    | "MNT"
    | "MOP"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MXV"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLE"
    | "SLL"
    | "SOS"
    | "SRD"
    | "SSP"
    | "SVC"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TVD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "USD"
    | "USN"
    | "UYI"
    | "UYU"
    | "UZS"
    | "VED"
    | "VND"
    | "VUV"
    | "WST"
    | "XAF"
    | "XAG"
    | "XAU"
    | "XBA"
    | "XBB"
    | "XBC"
    | "XBD"
    | "XCD"
    | "XDR"
    | "XFO"
    | "XFU"
    | "XOF"
    | "XPD"
    | "XPF"
    | "XPT"
    | "XSU"
    | "XTS"
    | "XUA"
    | "XXX"
    | "YER"
    | "ZAR"
    | "ZMW"
    | "ZWN";
  /**
   * Weight unit
   * @minLength 1
   * @maxLength 12
   */
  weight_unit?: string;
  /** Bank account info */
  bank_account_info?: string;
}
