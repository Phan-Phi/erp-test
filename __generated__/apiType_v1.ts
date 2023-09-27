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

export interface ADMIN_CASH_CASH_BOOK_VIEW_TYPE_V1 {
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
  total_revenue?: Price;
  total_expense?: Price;
  beginning_balance?: Price;
  total_balance?: Price;
}

export interface ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /** Creditor type */
  creditor_type?: "partner.partner" | "customer.customer" | null;
  /** Source type */
  source_type?:
    | "cash.debtrecord"
    | "stock.receiptorder"
    | "stock.returnorder"
    | "order.invoice"
    | null;
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
   * Sid
   * @minLength 1
   */
  sid?: string;
  /** Source */
  source?: string;
  /** Creditor */
  creditor?: string;
  debt_amount?: Price;
  total_debt_amount_at_time?: Price;
}

export interface ADMIN_CASH_PAYMENT_METHOD_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
  total_revenue?: Price;
  total_expense?: Price;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** Description */
  description?: string;
  beginning_balance?: Price;
  total_balance?: Price;
}

export interface ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  type?: {
    /** ID */
    id?: number;
    /** Is used */
    is_used: boolean;
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
    total_revenue?: Price;
    total_expense?: Price;
    /**
     * Name
     * @minLength 1
     * @maxLength 100
     */
    name: string;
    /** Is business activity */
    is_business_activity?: boolean;
    /** Description */
    description?: string;
  };
  payment_method?: {
    /** ID */
    id?: number;
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
    total_revenue?: Price;
    total_expense?: Price;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /** Description */
    description?: string;
  };
  /** Source type */
  source_type?: "stock.receiptorder" | "stock.stockoutnote" | "order.invoice" | null;
  /** Target type */
  target_type?: "partner.partner" | "customer.customer" | null;
  owner?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
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
   * Owner name
   * @minLength 1
   */
  owner_name?: string;
  /**
   * Owner email
   * @format email
   * @minLength 1
   */
  owner_email?: string;
  /**
   * Owner phone number
   * @minLength 1
   */
  owner_phone_number?: string;
  /** Flow type */
  flow_type?: "Cash_out" | "Cash_in";
  /** Status */
  status?: "Draft" | "Confirmed";
  /** Notes */
  notes?: string;
  /** Address */
  address?: string;
  /**
   * Date confirmed
   * @format date-time
   */
  date_confirmed?: string | null;
  amount?: Price;
  /**
   * Target name
   * @maxLength 255
   */
  target_name?: string;
  /**
   * Payment method name
   * @minLength 1
   */
  payment_method_name?: string;
  /** Affect creditor */
  affect_creditor?: boolean;
  /**
   * Sid
   * @minLength 1
   * @maxLength 100
   */
  sid?: string;
  /** Source */
  source?: string;
  /** Target */
  target?: string;
}

export interface ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /** Is used */
  is_used: boolean;
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
  total_revenue?: Price;
  total_expense?: Price;
  /**
   * Name
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /** Is business activity */
  is_business_activity?: boolean;
  /** Description */
  description?: string;
  beginning_balance?: Price;
  total_balance?: Price;
}

export interface ADMIN_CUSTOMER_CUSTOMER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /**
   * Avatar
   * @format uri
   */
  avatar?: string | null;
  default_shipping_address?: {
    /** ID */
    id?: number;
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
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
    /**
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
    /** Is default for shipping */
    is_default_for_shipping?: boolean;
    /** Is default for shipping ecom */
    is_default_for_shipping_ecom?: boolean;
    /** Is default for billing */
    is_default_for_billing?: boolean;
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
  };
  default_billing_address?: {
    /** ID */
    id?: number;
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
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
    /**
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
    /** Is default for shipping */
    is_default_for_shipping?: boolean;
    /** Is default for shipping ecom */
    is_default_for_shipping_ecom?: boolean;
    /** Is default for billing */
    is_default_for_billing?: boolean;
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
  };
  default_shipping_address_ecom?: {
    /** ID */
    id?: number;
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
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
    /**
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
    /** Is default for shipping */
    is_default_for_shipping?: boolean;
    /** Is default for shipping ecom */
    is_default_for_shipping_ecom?: boolean;
    /** Is default for billing */
    is_default_for_billing?: boolean;
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
  };
  sales_in_charge?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
  type?: {
    /** ID */
    id?: number;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /** Description */
    description?: string;
    /**
     * Full name
     * @minLength 1
     */
    full_name?: string;
  };
  /** Gender */
  gender: "Male" | "Female" | "Other";
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
   * Email
   * @format email
   * @maxLength 254
   */
  email?: string | null;
  /**
   * Main phone number
   * @maxLength 128
   */
  main_phone_number?: string | null;
  /**
   * First name
   * @maxLength 128
   */
  first_name?: string;
  /**
   * Last name
   * @maxLength 128
   */
  last_name?: string;
  /** Note */
  note?: string;
  /**
   * Date joined
   * @format date-time
   */
  date_joined?: string;
  /**
   * Birthday
   * @format date-time
   */
  birthday?: string | null;
  /**
   * Facebook
   * @format uri
   * @maxLength 200
   */
  facebook?: string;
  max_debt?: Price;
  /**
   * Tax identification number
   * @maxLength 20
   */
  tax_identification_number?: string | null;
  /**
   * Company name
   * @maxLength 255
   */
  company_name?: string;
  /** In business */
  in_business?: boolean;
  /**
   * Sid
   * @minLength 1
   */
  sid?: string;
  total_debt_amount?: Price;
  total_purchase?: Price;
}

export interface ADMIN_CUSTOMER_CUSTOMER_ADDRESS_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
   * District
   * @maxLength 255
   */
  district?: string;
  /**
   * Ward
   * @maxLength 255
   */
  ward?: string;
  /**
   * Province
   * @maxLength 255
   */
  province?: string;
  /**
   * Postcode
   * @maxLength 64
   */
  postcode?: string;
  /**
   * Phone number
   * @maxLength 128
   */
  phone_number?: string;
  /** Notes */
  notes?: string;
  /** Is default for shipping */
  is_default_for_shipping?: boolean;
  /** Is default for shipping ecom */
  is_default_for_shipping_ecom?: boolean;
  /** Is default for billing */
  is_default_for_billing?: boolean;
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
  user?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Sales in charge
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    sales_in_charge?: string;
    /**
     * Type
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerTypeView"
     */
    type?: string;
    /** Gender */
    gender: "Male" | "Female" | "Other";
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
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    max_debt?: Price;
    /**
     * Tax identification number
     * @maxLength 20
     */
    tax_identification_number?: string | null;
    /**
     * Company name
     * @maxLength 255
     */
    company_name?: string;
    /** In business */
    in_business?: boolean;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    total_debt_amount?: Price;
    total_purchase?: Price;
  };
}

export interface ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /**
   * Avatar
   * @format uri
   */
  avatar?: string | null;
  default_shipping_address: {
    /** ID */
    id?: number;
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
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
    /**
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
    /** Is default for shipping */
    is_default_for_shipping?: boolean;
    /** Is default for shipping ecom */
    is_default_for_shipping_ecom?: boolean;
    /** Is default for billing */
    is_default_for_billing?: boolean;
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
  };
  default_shipping_address_ecom: {
    /** ID */
    id?: number;
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
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
    /**
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
    /** Is default for shipping */
    is_default_for_shipping?: boolean;
    /** Is default for shipping ecom */
    is_default_for_shipping_ecom?: boolean;
    /** Is default for billing */
    is_default_for_billing?: boolean;
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
  };
  default_billing_address: {
    /** ID */
    id?: number;
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
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
    /**
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
    /** Is default for shipping */
    is_default_for_shipping?: boolean;
    /** Is default for shipping ecom */
    is_default_for_shipping_ecom?: boolean;
    /** Is default for billing */
    is_default_for_billing?: boolean;
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
  };
  official_customer?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerAddressView"
     */
    default_billing_address?: string;
    /**
     * Default shipping address ecom
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerAddressView"
     */
    default_shipping_address_ecom?: string;
    /**
     * Sales in charge
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    sales_in_charge?: string;
    /**
     * Type
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerTypeView"
     */
    type?: string;
    /** Gender */
    gender: "Male" | "Female" | "Other";
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
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    max_debt?: Price;
    /**
     * Tax identification number
     * @maxLength 20
     */
    tax_identification_number?: string | null;
    /**
     * Company name
     * @maxLength 255
     */
    company_name?: string;
    /** In business */
    in_business?: boolean;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    total_debt_amount?: Price;
    total_purchase?: Price;
  };
  type?: {
    /** ID */
    id?: number;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /** Description */
    description?: string;
    /**
     * Full name
     * @minLength 1
     */
    full_name?: string;
  };
  /** Gender */
  gender: "Male" | "Female" | "Other";
  /**
   * State
   * @minLength 1
   */
  state: string;
  /** Token */
  token?: string;
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
   * Email
   * @format email
   * @maxLength 254
   */
  email?: string | null;
  /**
   * Main phone number
   * @maxLength 128
   */
  main_phone_number?: string | null;
  /**
   * First name
   * @maxLength 128
   */
  first_name?: string;
  /**
   * Last name
   * @maxLength 128
   */
  last_name?: string;
  /** Note */
  note?: string;
  /**
   * Birthday
   * @format date-time
   */
  birthday?: string | null;
  /**
   * Facebook
   * @format uri
   * @maxLength 200
   */
  facebook?: string;
  /**
   * Tax identification number
   * @maxLength 20
   */
  tax_identification_number?: string | null;
  /**
   * Company name
   * @maxLength 255
   */
  company_name?: string;
  /** In business */
  in_business?: boolean;
  /** Is mutated */
  is_mutated?: boolean;
}

export interface ADMIN_CUSTOMER_DRAFT_CUSTOMER_ADDRESS_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
   * District
   * @maxLength 255
   */
  district?: string;
  /**
   * Ward
   * @maxLength 255
   */
  ward?: string;
  /**
   * Province
   * @maxLength 255
   */
  province?: string;
  /**
   * Postcode
   * @maxLength 64
   */
  postcode?: string;
  /**
   * Phone number
   * @maxLength 128
   */
  phone_number?: string;
  /** Notes */
  notes?: string;
  /** Is default for shipping */
  is_default_for_shipping?: boolean;
  /** Is default for shipping ecom */
  is_default_for_shipping_ecom?: boolean;
  /** Is default for billing */
  is_default_for_billing?: boolean;
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
  user?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Official customer
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.CustomerView"
     */
    official_customer?: string;
    /**
     * Type
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerTypeView"
     */
    type?: string;
    /** Gender */
    gender: "Male" | "Female" | "Other";
    /**
     * State
     * @minLength 1
     */
    state: string;
    /** Token */
    token?: string;
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
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /**
     * Tax identification number
     * @maxLength 20
     */
    tax_identification_number?: string | null;
    /**
     * Company name
     * @maxLength 255
     */
    company_name?: string;
    /** In business */
    in_business?: boolean;
    /** Is mutated */
    is_mutated?: boolean;
  };
}

export interface ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** Description */
  description?: string;
  /** Parent */
  parent?: number | null;
  /** Level */
  level?: number;
  /**
   * Full name
   * @minLength 1
   */
  full_name?: string;
}

export interface ADMIN_DISCOUNT_SALE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
  /**
   * Date start
   * @format date-time
   */
  date_start?: string;
  /**
   * Date end
   * @format date-time
   */
  date_end?: string | null;
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

export interface ADMIN_DISCOUNT_SALE_VARIANT_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
  sale?: {
    /** ID */
    id?: number;
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
    /**
     * Date start
     * @format date-time
     */
    date_start?: string;
    /**
     * Date end
     * @format date-time
     */
    date_end?: string | null;
  };
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
  /** Discount type */
  discount_type?: "Percentage" | "Absolute";
  /**
   * Discount amount
   * @format decimal
   */
  discount_amount?: string;
  /**
   * Usage limit
   * @min 0
   * @max 2147483647
   */
  usage_limit?: number | null;
  /** Used */
  used?: number;
}

export interface ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
  /** Type */
  type?: "Entire_order" | "Shipping" | "Specific_product_variant";
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * Code
   * @minLength 1
   * @maxLength 255
   */
  code: string;
  /** Description */
  description?: string;
  /**
   * Usage limit
   * @min 0
   * @max 2147483647
   */
  usage_limit?: number | null;
  /** Used */
  used?: number;
  /**
   * Date start
   * @format date-time
   */
  date_start?: string;
  /**
   * Date end
   * @format date-time
   */
  date_end?: string | null;
  /** Apply once per order */
  apply_once_per_order?: boolean;
  /** Apply once per customer */
  apply_once_per_customer?: boolean;
  /** Discount type */
  discount_type?: "Percentage" | "Absolute";
  /**
   * Discount amount
   * @format decimal
   */
  discount_amount?: string;
  min_spent_amount?: Price;
  /**
   * Min checkout items quantity
   * @min 0
   * @max 2147483647
   */
  min_checkout_items_quantity?: number;
}

export interface ADMIN_DISCOUNT_VOUCHER_VARIANT_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
  voucher?: {
    /** ID */
    id?: number;
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
    /** Type */
    type?: "Entire_order" | "Shipping" | "Specific_product_variant";
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /**
     * Code
     * @minLength 1
     * @maxLength 255
     */
    code: string;
    /** Description */
    description?: string;
    /**
     * Usage limit
     * @min 0
     * @max 2147483647
     */
    usage_limit?: number | null;
    /** Used */
    used?: number;
    /**
     * Date start
     * @format date-time
     */
    date_start?: string;
    /**
     * Date end
     * @format date-time
     */
    date_end?: string | null;
    /** Apply once per order */
    apply_once_per_order?: boolean;
    /** Apply once per customer */
    apply_once_per_customer?: boolean;
    /** Discount type */
    discount_type?: "Percentage" | "Absolute";
    /**
     * Discount amount
     * @format decimal
     */
    discount_amount?: string;
    min_spent_amount?: Price;
    /**
     * Min checkout items quantity
     * @min 0
     * @max 2147483647
     */
    min_checkout_items_quantity?: number;
  };
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

export interface ADMIN_USER_USER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /**
   * Avatar
   * @format uri
   */
  avatar?: string | null;
  default_shipping_address?: {
    /** ID */
    id?: number;
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
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
    /**
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
    /** Is default for shipping */
    is_default_for_shipping?: boolean;
    /** Is default for shipping ecom */
    is_default_for_shipping_ecom?: boolean;
    /** Is default for billing */
    is_default_for_billing?: boolean;
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
  };
  default_billing_address?: {
    /** ID */
    id?: number;
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
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
    /**
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
    /** Is default for shipping */
    is_default_for_shipping?: boolean;
    /** Is default for shipping ecom */
    is_default_for_shipping_ecom?: boolean;
    /** Is default for billing */
    is_default_for_billing?: boolean;
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
  };
  /**
   * Superuser status
   * Designates that this user has all permissions without explicitly assigning them.
   */
  is_superuser?: boolean;
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
   * Username
   * @maxLength 255
   * @pattern ^[\w.+-]+$
   */
  username?: string | null;
  /**
   * Email
   * @format email
   * @maxLength 254
   */
  email?: string | null;
  /**
   * Main phone number
   * @maxLength 128
   */
  main_phone_number?: string | null;
  /**
   * First name
   * @maxLength 128
   */
  first_name?: string;
  /**
   * Last name
   * @maxLength 128
   */
  last_name?: string;
  /** Note */
  note?: string;
  /**
   * Date joined
   * @format date-time
   */
  date_joined?: string;
  /**
   * Birthday
   * @format date-time
   */
  birthday?: string | null;
  /** Gender */
  gender?: "Male" | "Female" | "Other";
  /**
   * Facebook
   * @format uri
   * @maxLength 200
   */
  facebook?: string;
  /** Is staff */
  is_staff?: boolean;
  /** Is active */
  is_active?: boolean;
  /**
   * Last login
   * @format date-time
   */
  last_login?: string;
}

export interface ADMIN_USER_INLINE_USER_ADDRESS_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
   * District
   * @maxLength 255
   */
  district?: string;
  /**
   * Ward
   * @maxLength 255
   */
  ward?: string;
  /**
   * Province
   * @maxLength 255
   */
  province?: string;
  /**
   * Postcode
   * @maxLength 64
   */
  postcode?: string;
  /**
   * Phone number
   * @maxLength 128
   */
  phone_number?: string;
  /** Notes */
  notes?: string;
  /** Is default for shipping */
  is_default_for_shipping?: boolean;
  /** Is default for shipping ecom */
  is_default_for_shipping_ecom?: boolean;
  /** Is default for billing */
  is_default_for_billing?: boolean;
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
}

export interface ADMIN_USER_PERMISSION_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /** Content type */
  content_type?:
    | "cash.paymentmethod"
    | "cash.transactiontype"
    | "cash.transaction"
    | "cash.debtrecord"
    | "site_setting.sitesettings"
    | "account.user"
    | "shipping.shippingmethod"
    | "shipping.shipper"
    | "catalogue.attribute"
    | "catalogue.category"
    | "catalogue.product"
    | "catalogue.productclass"
    | "partner.partner"
    | "stock.purchaseorder"
    | "stock.receiptorder"
    | "stock.returnorder"
    | "stock.stockoutnote"
    | "stock.warehouse"
    | "discount.sale"
    | "discount.voucher"
    | "order.invoice"
    | "order.order"
    | "order.purchasechannel"
    | "customer.customertype"
    | "customer.customer"
    | "export.exportfile"
    | null;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * Codename
   * @minLength 1
   * @maxLength 100
   */
  codename: string;
}

export interface ADMIN_ORDER_ORDER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  channel?: {
    /** ID */
    id?: number;
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
    /** Description */
    description?: string;
  };
  owner?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
  receiver?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerAddressView"
     */
    default_billing_address?: string;
    /**
     * Default shipping address ecom
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerAddressView"
     */
    default_shipping_address_ecom?: string;
    /**
     * Sales in charge
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    sales_in_charge?: string;
    /**
     * Type
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.InlineCustomerTypeView"
     */
    type?: string;
    /** Gender */
    gender: "Male" | "Female" | "Other";
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
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    max_debt?: Price;
    /**
     * Tax identification number
     * @maxLength 20
     */
    tax_identification_number?: string | null;
    /**
     * Company name
     * @maxLength 255
     */
    company_name?: string;
    /** In business */
    in_business?: boolean;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    total_debt_amount?: Price;
    total_purchase?: Price;
  };
  shipping_method?: {
    /** ID */
    id?: number;
    /** Type */
    type: "Price" | "Weight";
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
     * @maxLength 128
     */
    name: string;
    price?: Price;
    minimum_order_price?: Price;
    maximum_order_price?: Price;
    minimum_order_weight?: Weight;
    maximum_order_weight?: Weight;
  };
  /** Is editable */
  is_editable: boolean;
  shipping_address?: {
    /** ID */
    id?: number;
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
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
  };
  billing_address?: {
    /** ID */
    id?: number;
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
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /** Notes */
    notes?: string;
  };
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Sid
   * @minLength 1
   */
  sid?: string;
  /**
   * Channel name
   * @minLength 1
   */
  channel_name?: string;
  /**
   * Owner name
   * @minLength 1
   */
  owner_name?: string;
  /**
   * Owner email
   * @format email
   * @minLength 1
   */
  owner_email?: string;
  /**
   * Owner phone number
   * @minLength 1
   */
  owner_phone_number?: string;
  /**
   * Receiver name
   * @maxLength 256
   */
  receiver_name?: string;
  /**
   * Receiver email
   * @format email
   * @maxLength 254
   */
  receiver_email?: string;
  /**
   * Receiver phone number
   * @maxLength 128
   */
  receiver_phone_number?: string | null;
  /** Status */
  status?:
    | "Draft"
    | "Confirmed"
    | "Processed"
    | "Fulfilled"
    | "Partial_fulfilled"
    | "Cancelled";
  /**
   * Shipping method name
   * @minLength 1
   */
  shipping_method_name?: string;
  /**
   * Date placed
   * @format date-time
   */
  date_placed?: string;
  weight?: Weight;
  /** Customer notes */
  customer_notes?: string;
  /** Line count */
  line_count?: number;
  /** Item count */
  item_count?: number;
  total_price?: Price;
  total_before_vouchers?: Price;
  total_before_discounts?: Price;
  shipping_charge?: Price;
  shipping_charge_before_vouchers?: Price;
}

export interface ADMIN_ORDER_BILLING_ADDRESS_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Channel
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.PurchaseChannelView"
     */
    channel?: string;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /**
     * Receiver
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.CustomerView"
     */
    receiver?: string;
    /**
     * Shipping method
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.shipping.ShippingMethodView"
     */
    shipping_method?: string;
    /** Is editable */
    is_editable: boolean;
    /**
     * Date created
     * @format date-time
     */
    date_created?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /**
     * Channel name
     * @minLength 1
     */
    channel_name?: string;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Receiver name
     * @maxLength 256
     */
    receiver_name?: string;
    /**
     * Receiver email
     * @format email
     * @maxLength 254
     */
    receiver_email?: string;
    /**
     * Receiver phone number
     * @maxLength 128
     */
    receiver_phone_number?: string | null;
    /** Status */
    status?:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Fulfilled"
      | "Partial_fulfilled"
      | "Cancelled";
    /**
     * Shipping method name
     * @minLength 1
     */
    shipping_method_name?: string;
    /**
     * Date placed
     * @format date-time
     */
    date_placed?: string;
    weight?: Weight;
    /** Customer notes */
    customer_notes?: string;
    /** Line count */
    line_count?: number;
    /** Item count */
    item_count?: number;
    total_price?: Price;
    total_before_vouchers?: Price;
    total_before_discounts?: Price;
    shipping_charge?: Price;
    shipping_charge_before_vouchers?: Price;
  };
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
   * Phone number
   * @maxLength 128
   */
  phone_number?: string;
  /** Notes */
  notes?: string;
}

export interface ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Channel
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.PurchaseChannelView"
     */
    channel?: string;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /**
     * Receiver
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.CustomerView"
     */
    receiver?: string;
    /**
     * Shipping method
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.shipping.ShippingMethodView"
     */
    shipping_method?: string;
    /** Is editable */
    is_editable: boolean;
    /**
     * Shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.InlineShippingAddressView"
     */
    shipping_address?: string;
    /**
     * Billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.InlineBillingAddressView"
     */
    billing_address?: string;
    /**
     * Date created
     * @format date-time
     */
    date_created?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /**
     * Channel name
     * @minLength 1
     */
    channel_name?: string;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Receiver name
     * @maxLength 256
     */
    receiver_name?: string;
    /**
     * Receiver email
     * @format email
     * @maxLength 254
     */
    receiver_email?: string;
    /**
     * Receiver phone number
     * @maxLength 128
     */
    receiver_phone_number?: string | null;
    /** Status */
    status?:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Fulfilled"
      | "Partial_fulfilled"
      | "Cancelled";
    /**
     * Shipping method name
     * @minLength 1
     */
    shipping_method_name?: string;
    /**
     * Date placed
     * @format date-time
     */
    date_placed?: string;
    weight?: Weight;
    /** Customer notes */
    customer_notes?: string;
    /** Line count */
    line_count?: number;
    /** Item count */
    item_count?: number;
    total_price?: Price;
    total_before_vouchers?: Price;
    total_before_discounts?: Price;
    shipping_charge?: Price;
    shipping_charge_before_vouchers?: Price;
  };
  owner?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
  shipper?: {
    /** ID */
    id?: number;
    /**
     * User
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    user?: string;
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
     * @maxLength 128
     */
    name: string;
  };
  /** Is editable */
  is_editable: boolean;
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
  total_transaction_in_amount?: Price;
  total_transaction_out_amount?: Price;
  /**
   * Owner name
   * @minLength 1
   */
  owner_name?: string;
  /**
   * Owner email
   * @format email
   * @minLength 1
   */
  owner_email?: string;
  /**
   * Owner phone number
   * @minLength 1
   */
  owner_phone_number?: string;
  /**
   * Sid
   * @minLength 1
   */
  sid?: string;
  /** Status */
  status?:
    | "Draft"
    | "Confirmed"
    | "Processed"
    | "Partial_paid"
    | "Paid"
    | "Over_paid"
    | "Cancelled";
  /** Shipping status */
  shipping_status?: "Pending" | "Received" | "On delivery" | "Delivered" | "Returned";
  /** Cod */
  cod?: boolean;
  /**
   * Shipper name
   * @minLength 1
   */
  shipper_name?: string;
  surcharge?: Price;
  weight?: Weight;
  amount?: Price;
  amount_before_vouchers?: Price;
  amount_before_discounts?: Price;
  base_amount?: Price;
  /** Quantity count */
  quantity_count?: number;
  /** Item count */
  item_count?: number;
  shipping_charge?: Price;
}

export interface ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  invoice?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.OrderView"
     */
    order?: string;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /**
     * Shipper
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.shipping.ShipperView"
     */
    shipper?: string;
    /** Is editable */
    is_editable: boolean;
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
    total_transaction_in_amount?: Price;
    total_transaction_out_amount?: Price;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /** Status */
    status?:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Partial_paid"
      | "Paid"
      | "Over_paid"
      | "Cancelled";
    /** Shipping status */
    shipping_status?: "Pending" | "Received" | "On delivery" | "Delivered" | "Returned";
    /** Cod */
    cod?: boolean;
    /**
     * Shipper name
     * @minLength 1
     */
    shipper_name?: string;
    surcharge?: Price;
    weight?: Weight;
    amount?: Price;
    amount_before_vouchers?: Price;
    amount_before_discounts?: Price;
    base_amount?: Price;
    /** Quantity count */
    quantity_count?: number;
    /** Item count */
    item_count?: number;
    shipping_charge?: Price;
  };
  line?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.OrderView"
     */
    order?: string;
    /**
     * Variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductVariantView"
     */
    variant?: string;
    /** Actual invoice quantity */
    actual_invoice_quantity: number;
    /** Actual invoice unit quantity */
    actual_invoice_unit_quantity: number;
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
     * Variant name
     * @minLength 1
     */
    variant_name?: string;
    /**
     * Variant sku
     * @minLength 1
     */
    variant_sku?: string;
    /**
     * Unit
     * @maxLength 128
     */
    unit: string;
    unit_weight?: Weight;
    /** Quantity */
    quantity?: number;
    /** Invoice quantity */
    invoice_quantity?: number;
    /** Invoice unit quantity */
    invoice_unit_quantity?: number;
    /** Delivered quantity */
    delivered_quantity?: number;
    /** Delivered unit quantity */
    delivered_unit_quantity?: number;
    /**
     * Unit quantity
     * @min 1
     * @max 2147483647
     */
    unit_quantity?: number;
    /** Discount type */
    discount_type?: "Percentage" | "Absolute";
    /**
     * Discount amount
     * @format decimal
     */
    discount_amount?: string;
    line_price?: Price;
    line_price_before_vouchers?: Price;
    line_price_before_discounts?: Price;
    unit_price?: Price;
    unit_price_before_vouchers?: Price;
    unit_price_before_discounts?: Price;
    weight?: Weight;
  };
  warehouse?: {
    /** ID */
    id?: number;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /**
     * Primary address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.InlineWarehouseAddressView"
     */
    primary_address?: string;
    /** Is used */
    is_used: boolean;
    /**
     * Manager
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    manager?: string;
  };
  record?: {
    /** ID */
    id?: number;
    /**
     * Warehouse
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.WarehouseView"
     */
    warehouse?: string;
    /**
     * Variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductVariantView"
     */
    variant?: string;
    /** Quantity */
    quantity?: number;
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
    /** Allocated quantity */
    allocated_quantity?: number;
    /**
     * Low stock threshold
     * @min 0
     * @max 2147483647
     */
    low_stock_threshold?: number | null;
    price?: Price;
  };
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
   * Warehouse name
   * @minLength 1
   */
  warehouse_name?: string;
  /** Quantity */
  quantity?: number;
  /**
   * Unit quantity
   * @min 0
   * @max 2147483647
   */
  unit_quantity?: number;
  weight?: Weight;
  amount?: Price;
  amount_before_vouchers?: Price;
  amount_before_discounts?: Price;
  /**
   * Pick up address
   * @minLength 1
   */
  pick_up_address?: string;
  base_amount?: Price;
}

export interface ADMIN_ORDER_INVOICE_SHIPPING_STATUS_CHANGE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  invoice?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.OrderView"
     */
    order?: string;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /**
     * Shipper
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.shipping.ShipperView"
     */
    shipper?: string;
    /** Is editable */
    is_editable: boolean;
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
    total_transaction_in_amount?: Price;
    total_transaction_out_amount?: Price;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /** Status */
    status?:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Partial_paid"
      | "Paid"
      | "Over_paid"
      | "Cancelled";
    /** Shipping status */
    shipping_status?: "Pending" | "Received" | "On delivery" | "Delivered" | "Returned";
    /** Cod */
    cod?: boolean;
    /**
     * Shipper name
     * @minLength 1
     */
    shipper_name?: string;
    surcharge?: Price;
    weight?: Weight;
    amount?: Price;
    amount_before_vouchers?: Price;
    amount_before_discounts?: Price;
    base_amount?: Price;
    /** Quantity count */
    quantity_count?: number;
    /** Item count */
    item_count?: number;
    shipping_charge?: Price;
  };
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
   * Old status
   * @minLength 1
   */
  old_status?: string;
  /**
   * New status
   * @minLength 1
   */
  new_status?: string;
}

export interface ADMIN_ORDER_INVOICE_STATUS_CHANGE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  invoice?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.OrderView"
     */
    order?: string;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /**
     * Shipper
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.shipping.ShipperView"
     */
    shipper?: string;
    /** Is editable */
    is_editable: boolean;
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
    total_transaction_in_amount?: Price;
    total_transaction_out_amount?: Price;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /** Status */
    status?:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Partial_paid"
      | "Paid"
      | "Over_paid"
      | "Cancelled";
    /** Shipping status */
    shipping_status?: "Pending" | "Received" | "On delivery" | "Delivered" | "Returned";
    /** Cod */
    cod?: boolean;
    /**
     * Shipper name
     * @minLength 1
     */
    shipper_name?: string;
    surcharge?: Price;
    weight?: Weight;
    amount?: Price;
    amount_before_vouchers?: Price;
    amount_before_discounts?: Price;
    base_amount?: Price;
    /** Quantity count */
    quantity_count?: number;
    /** Item count */
    item_count?: number;
    shipping_charge?: Price;
  };
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
   * Old status
   * @minLength 1
   */
  old_status?: string;
  /**
   * New status
   * @minLength 1
   */
  new_status?: string;
}

export interface ADMIN_ORDER_LINE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Channel
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.PurchaseChannelView"
     */
    channel?: string;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /**
     * Receiver
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.CustomerView"
     */
    receiver?: string;
    /**
     * Shipping method
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.shipping.ShippingMethodView"
     */
    shipping_method?: string;
    /** Is editable */
    is_editable: boolean;
    /**
     * Shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.InlineShippingAddressView"
     */
    shipping_address?: string;
    /**
     * Billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.InlineBillingAddressView"
     */
    billing_address?: string;
    /**
     * Date created
     * @format date-time
     */
    date_created?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /**
     * Channel name
     * @minLength 1
     */
    channel_name?: string;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Receiver name
     * @maxLength 256
     */
    receiver_name?: string;
    /**
     * Receiver email
     * @format email
     * @maxLength 254
     */
    receiver_email?: string;
    /**
     * Receiver phone number
     * @maxLength 128
     */
    receiver_phone_number?: string | null;
    /** Status */
    status?:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Fulfilled"
      | "Partial_fulfilled"
      | "Cancelled";
    /**
     * Shipping method name
     * @minLength 1
     */
    shipping_method_name?: string;
    /**
     * Date placed
     * @format date-time
     */
    date_placed?: string;
    weight?: Weight;
    /** Customer notes */
    customer_notes?: string;
    /** Line count */
    line_count?: number;
    /** Item count */
    item_count?: number;
    total_price?: Price;
    total_before_vouchers?: Price;
    total_before_discounts?: Price;
    shipping_charge?: Price;
    shipping_charge_before_vouchers?: Price;
  };
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
  /** Actual invoice quantity */
  actual_invoice_quantity: number;
  /** Actual invoice unit quantity */
  actual_invoice_unit_quantity: number;
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
   * Variant name
   * @minLength 1
   */
  variant_name?: string;
  /**
   * Variant sku
   * @minLength 1
   */
  variant_sku?: string;
  /**
   * Unit
   * @maxLength 128
   */
  unit: string;
  unit_weight?: Weight;
  /** Quantity */
  quantity?: number;
  /** Invoice quantity */
  invoice_quantity?: number;
  /** Invoice unit quantity */
  invoice_unit_quantity?: number;
  /** Delivered quantity */
  delivered_quantity?: number;
  /** Delivered unit quantity */
  delivered_unit_quantity?: number;
  /**
   * Unit quantity
   * @min 1
   * @max 2147483647
   */
  unit_quantity?: number;
  /** Discount type */
  discount_type?: "Percentage" | "Absolute";
  /**
   * Discount amount
   * @format decimal
   */
  discount_amount?: string;
  line_price?: Price;
  line_price_before_vouchers?: Price;
  line_price_before_discounts?: Price;
  unit_price?: Price;
  unit_price_before_vouchers?: Price;
  unit_price_before_discounts?: Price;
  weight?: Weight;
}

export interface ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
  /** Description */
  description?: string;
}

export interface ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  user?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
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
   * @maxLength 128
   */
  name: string;
}

export interface ADMIN_ORDER_SHIPPING_ADDRESS_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Channel
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.PurchaseChannelView"
     */
    channel?: string;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /**
     * Receiver
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.CustomerView"
     */
    receiver?: string;
    /**
     * Shipping method
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.shipping.ShippingMethodView"
     */
    shipping_method?: string;
    /** Is editable */
    is_editable: boolean;
    /**
     * Date created
     * @format date-time
     */
    date_created?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /**
     * Channel name
     * @minLength 1
     */
    channel_name?: string;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Receiver name
     * @maxLength 256
     */
    receiver_name?: string;
    /**
     * Receiver email
     * @format email
     * @maxLength 254
     */
    receiver_email?: string;
    /**
     * Receiver phone number
     * @maxLength 128
     */
    receiver_phone_number?: string | null;
    /** Status */
    status?:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Fulfilled"
      | "Partial_fulfilled"
      | "Cancelled";
    /**
     * Shipping method name
     * @minLength 1
     */
    shipping_method_name?: string;
    /**
     * Date placed
     * @format date-time
     */
    date_placed?: string;
    weight?: Weight;
    /** Customer notes */
    customer_notes?: string;
    /** Line count */
    line_count?: number;
    /** Item count */
    item_count?: number;
    total_price?: Price;
    total_before_vouchers?: Price;
    total_before_discounts?: Price;
    shipping_charge?: Price;
    shipping_charge_before_vouchers?: Price;
  };
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
   * Phone number
   * @maxLength 128
   */
  phone_number?: string;
  /** Notes */
  notes?: string;
}

export interface ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /** Type */
  type: "Price" | "Weight";
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
   * @maxLength 128
   */
  name: string;
  price?: Price;
  minimum_order_price?: Price;
  maximum_order_price?: Price;
  minimum_order_weight?: Weight;
  maximum_order_weight?: Weight;
}

export interface ADMIN_ORDER_ORDER_STATUS_CHANGE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Channel
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.PurchaseChannelView"
     */
    channel?: string;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /**
     * Receiver
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.customer.CustomerView"
     */
    receiver?: string;
    /**
     * Shipping method
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.shipping.ShippingMethodView"
     */
    shipping_method?: string;
    /** Is editable */
    is_editable: boolean;
    /**
     * Shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.InlineShippingAddressView"
     */
    shipping_address?: string;
    /**
     * Billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.order.InlineBillingAddressView"
     */
    billing_address?: string;
    /**
     * Date created
     * @format date-time
     */
    date_created?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /**
     * Channel name
     * @minLength 1
     */
    channel_name?: string;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Receiver name
     * @maxLength 256
     */
    receiver_name?: string;
    /**
     * Receiver email
     * @format email
     * @maxLength 254
     */
    receiver_email?: string;
    /**
     * Receiver phone number
     * @maxLength 128
     */
    receiver_phone_number?: string | null;
    /** Status */
    status?:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Fulfilled"
      | "Partial_fulfilled"
      | "Cancelled";
    /**
     * Shipping method name
     * @minLength 1
     */
    shipping_method_name?: string;
    /**
     * Date placed
     * @format date-time
     */
    date_placed?: string;
    weight?: Weight;
    /** Customer notes */
    customer_notes?: string;
    /** Line count */
    line_count?: number;
    /** Item count */
    item_count?: number;
    total_price?: Price;
    total_before_vouchers?: Price;
    total_before_discounts?: Price;
    shipping_charge?: Price;
    shipping_charge_before_vouchers?: Price;
  };
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
   * Old status
   * @minLength 1
   */
  old_status?: string;
  /**
   * New status
   * @minLength 1
   */
  new_status?: string;
}

export interface ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  primary_address?: {
    /** ID */
    id?: number;
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
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
    /**
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
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
  };
  /** Is used */
  is_used: boolean;
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
  max_debt?: Price;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * Tax identification number
   * @maxLength 20
   */
  tax_identification_number?: string | null;
  /** Notes */
  notes?: string;
  /**
   * Email
   * @format email
   * @maxLength 254
   */
  email?: string;
  /** Contact info */
  contact_info?: string;
  total_debt_amount?: Price;
  total_purchase?: Price;
}

export interface ADMIN_PARTNER_PARTNER_ADDRESS_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
   * Phone number
   * @maxLength 128
   */
  phone_number?: string;
  /**
   * District
   * @maxLength 255
   */
  district?: string;
  /**
   * Ward
   * @maxLength 255
   */
  ward?: string;
  /**
   * Province
   * @maxLength 255
   */
  province?: string;
  /**
   * Postcode
   * @maxLength 64
   */
  postcode?: string;
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
  partner?: {
    /** ID */
    id?: number;
    /** Is used */
    is_used: boolean;
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
    max_debt?: Price;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /**
     * Tax identification number
     * @maxLength 20
     */
    tax_identification_number?: string | null;
    /** Notes */
    notes?: string;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string;
    /** Contact info */
    contact_info?: string;
    total_debt_amount?: Price;
    total_purchase?: Price;
  };
}

export interface ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  partner?: {
    /** ID */
    id?: number;
    /**
     * Primary address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.partner.InlinePartnerAddressView"
     */
    primary_address?: string;
    /** Is used */
    is_used: boolean;
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
    max_debt?: Price;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /**
     * Tax identification number
     * @maxLength 20
     */
    tax_identification_number?: string | null;
    /** Notes */
    notes?: string;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string;
    /** Contact info */
    contact_info?: string;
    total_debt_amount?: Price;
    total_purchase?: Price;
  };
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
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
   * Partner sku
   * @minLength 1
   * @maxLength 255
   */
  partner_sku: string;
  price?: Price;
}

export interface ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  product_class?: {
    /** ID */
    id?: number;
    /** Is used */
    is_used: boolean;
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
  };
  /**
   * Primary image
   * @format uri
   */
  primary_image?: string | null;
  default_variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
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
     */
    list_id_values?: string;
    discounted_price?: Price;
  };
  /** Is used */
  is_used: boolean;
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
  min_variant_price?: Price;
  max_variant_price?: Price;
}

export interface ADMIN_PRODUCT_ATTRIBUTE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /** Is used */
  is_used: boolean;
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

export interface ADMIN_PRODUCT_ATTRIBUTE_VALUE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  attribute?: {
    /** ID */
    id?: number;
    /** Is used */
    is_used: boolean;
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
  };
  /** Is used */
  is_used: boolean;
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

export interface ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /** Parent */
  parent?: number | null;
  /**
   * Name
   * @minLength 1
   * @maxLength 250
   */
  name: string;
  /** Description */
  description?: string;
  /**
   * Image
   * @format uri
   */
  image?: string;
  /**
   * Image alt
   * @maxLength 128
   */
  image_alt?: string;
  /** Have product */
  have_product?: boolean;
  /**
   * Full name
   * @minLength 1
   */
  full_name?: string;
  /** Level */
  level?: number;
}

export interface ADMIN_PRODUCT_PRODUCT_IMAGE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  product?: {
    /** ID */
    id?: number;
    /**
     * Product class
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductClassView"
     */
    product_class?: string;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Default variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductVariantView"
     */
    default_variant?: string;
    /** Is used */
    is_used: boolean;
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
    min_variant_price?: Price;
    max_variant_price?: Price;
  };
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

export interface ADMIN_PRODUCT_PRODUCT_CATEGORY_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  product?: {
    /** ID */
    id?: number;
    /**
     * Product class
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductClassView"
     */
    product_class?: string;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Default variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductVariantView"
     */
    default_variant?: string;
    /** Is used */
    is_used: boolean;
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
    min_variant_price?: Price;
    max_variant_price?: Price;
  };
  category?: {
    /** ID */
    id?: number;
    /** Parent */
    parent?: number | null;
    /**
     * Name
     * @minLength 1
     * @maxLength 250
     */
    name: string;
    /** Description */
    description?: string;
    /**
     * Image
     * @format uri
     */
    image?: string;
    /**
     * Image alt
     * @maxLength 128
     */
    image_alt?: string;
    /** Have product */
    have_product?: boolean;
    /**
     * Full name
     * @minLength 1
     */
    full_name?: string;
    /** Level */
    level?: number;
  };
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

export interface ADMIN_PRODUCT_PRODUCT_RECOMMENDATION_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  primary?: {
    /** ID */
    id?: number;
    /**
     * Product class
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductClassView"
     */
    product_class?: string;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Default variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductVariantView"
     */
    default_variant?: string;
    /** Is used */
    is_used: boolean;
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
    min_variant_price?: Price;
    max_variant_price?: Price;
  };
  recommendation?: {
    /** ID */
    id?: number;
    /**
     * Product class
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductClassView"
     */
    product_class?: string;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Default variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductVariantView"
     */
    default_variant?: string;
    /** Is used */
    is_used: boolean;
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
    min_variant_price?: Price;
    max_variant_price?: Price;
  };
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

export interface ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /** Is used */
  is_used: boolean;
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

export interface ADMIN_PRODUCT_ATTRIBUTE_PRODUCT_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  attribute?: {
    /** ID */
    id?: number;
    /** Is used */
    is_used: boolean;
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
  };
  product_class?: {
    /** ID */
    id?: number;
    /** Is used */
    is_used: boolean;
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
  };
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

export interface ADMIN_PRODUCT_ASSIGNED_PRODUCT_ATTRIBUTE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  values?: {
    /** ID */
    id?: number;
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
  }[];
  product?: {
    /** ID */
    id?: number;
    /**
     * Product class
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductClassView"
     */
    product_class?: string;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Default variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductVariantView"
     */
    default_variant?: string;
    /** Is used */
    is_used: boolean;
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
    min_variant_price?: Price;
    max_variant_price?: Price;
  };
  assignment?: {
    /** ID */
    id?: number;
    /**
     * Attribute
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.AttributeView"
     */
    attribute?: string;
    /**
     * Product class
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductClassView"
     */
    product_class?: string;
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
  };
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

export interface ADMIN_PRODUCT_ATTRIBUTE_VARIANT_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  attribute?: {
    /** ID */
    id?: number;
    /** Is used */
    is_used: boolean;
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
  };
  product_class?: {
    /** ID */
    id?: number;
    /** Is used */
    is_used: boolean;
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
  };
  /** Is used */
  is_used: boolean;
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

export interface ADMIN_PRODUCT_ASSIGNED_VARIANT_ATTRIBUTE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  values?: {
    /** ID */
    id?: number;
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
  }[];
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
  assignment?: {
    /** ID */
    id?: number;
    /**
     * Attribute
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.AttributeView"
     */
    attribute?: string;
    /**
     * Product class
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductClassView"
     */
    product_class?: string;
    /** Is used */
    is_used: boolean;
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
  };
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

export interface ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /** Is available */
  is_available: boolean;
  /** Is default */
  is_default: boolean;
  /**
   * Primary image
   * @format uri
   */
  primary_image?: string | null;
  units?: {
    /** ID */
    id?: number;
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
  }[];
  /** Quantity */
  quantity?: number;
  product?: {
    /** ID */
    id?: number;
    /**
     * Product class
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductClassView"
     */
    product_class?: string;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
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
    min_variant_price?: Price;
    max_variant_price?: Price;
  };
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

export interface ADMIN_PRODUCT_VARIANT_IMAGE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
  image?: {
    /** ID */
    id?: number;
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
  };
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

export interface ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
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

export interface TransactionType {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  revenue?: Price;
  expense?: Price;
}

export interface CashBookReport {
  /**
   * Date start
   * @format date-time
   */
  date_start: string;
  /**
   * Date end
   * @format date-time
   */
  date_end: string;
  transaction_types: TransactionType[];
  net_revenue?: Price;
  revenue?: Price;
  base_amount?: Price;
}

export interface CustomerWithDebtAmountReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Email
   * @minLength 1
   */
  email: string;
  /**
   * Phone number
   * @minLength 1
   */
  phone_number: string;
  beginning_debt_amount?: Price;
  credit?: Price;
  debit?: Price;
}

export interface CustomerWithRevenueReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Email
   * @minLength 1
   */
  email: string;
  /**
   * Phone number
   * @minLength 1
   */
  phone_number: string;
  /** Invoice count */
  invoice_count: number;
  net_revenue?: Price;
  revenue?: Price;
  base_amount?: Price;
}

export interface GeneralNetRevenueReport {
  /** Invoice count */
  invoice_count: number;
  net_revenue_in_date?: Price;
  net_revenue_in_previous_date?: Price;
  net_revenue_in_date_of_previous_month?: Price;
}

export interface DateStartDateEnd {
  /**
   * Date start
   * @format date-time
   */
  date_start: string;
  /**
   * Date end
   * @format date-time
   */
  date_end: string;
}

export interface NetRevenueReport {
  dates?: DateStartDateEnd[];
  net_revenue?: Price;
}

export interface PartnerWithDebtAmountReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  beginning_debt_amount?: Price;
  credit?: Price;
  debit?: Price;
}

export interface PartnerWithPurchaseAmountReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  purchase_amount?: Price;
  return_amount?: Price;
}

export interface ProductWithIOInventoryReport {
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Sku
   * @minLength 1
   */
  sku: string;
  /**
   * Unit
   * @minLength 1
   */
  unit: string;
  /** Beginning quantity */
  beginning_quantity: number;
  /** Input quantity */
  input_quantity: number;
  /** Output quantity */
  output_quantity: number;
  beginning_amount?: Price;
  total_input_amount?: Price;
  total_output_amount?: Price;
  current_price?: Price;
  current_base_price?: Price;
}

export interface ProductWithIOWarehouseReport {
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Sku
   * @minLength 1
   */
  sku: string;
  /**
   * Unit
   * @minLength 1
   */
  unit: string;
  /**
   * Warehouse name
   * @minLength 1
   */
  warehouse_name: string;
  /** Beginning quantity */
  beginning_quantity: number;
  /** Input quantity */
  input_quantity: number;
  /** Output quantity */
  output_quantity: number;
  beginning_amount?: Price;
  total_input_amount?: Price;
  total_output_amount?: Price;
  current_price?: Price;
  current_base_price?: Price;
}

export interface ProductWithRevenueReport {
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Sku
   * @minLength 1
   */
  sku: string;
  /**
   * Unit
   * @minLength 1
   */
  unit: string;
  /** Invoice count */
  invoice_count: number;
  /** Quantity */
  quantity: number;
  net_revenue?: Price;
  revenue?: Price;
  base_amount?: Price;
}

export interface RevenueReport {
  /**
   * Date start
   * @format date-time
   */
  date_start: string;
  /**
   * Date end
   * @format date-time
   */
  date_end: string;
  /** Invoice count */
  invoice_count: number;
  net_revenue?: Price;
  revenue?: Price;
  base_amount?: Price;
}

export interface StaffWithRevenueReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Email
   * @minLength 1
   */
  email: string;
  /**
   * Phone number
   * @minLength 1
   */
  phone_number: string;
  /** Invoice count */
  invoice_count: number;
  net_revenue?: Price;
  revenue?: Price;
  base_amount?: Price;
}

export interface TopCustomerByDebtAmountReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Email
   * @minLength 1
   */
  email: string;
  /**
   * Phone number
   * @minLength 1
   */
  phone_number: string;
  debt_amount?: Price;
}

export interface TopCustomerByNetRevenueReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Email
   * @minLength 1
   */
  email: string;
  /**
   * Phone number
   * @minLength 1
   */
  phone_number: string;
  net_revenue?: Price;
}

export interface TopPartnerByDebtAmountReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  debt_amount?: Price;
}

export interface TopPartnerByReceiptAmountReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  receipt_amount?: Price;
}

export interface TopProductByNetRevenueReport {
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Sku
   * @minLength 1
   */
  sku: string;
  /**
   * Unit
   * @minLength 1
   */
  unit: string;
  net_revenue?: Price;
}

export interface TopProductByProfitReport {
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Sku
   * @minLength 1
   */
  sku: string;
  /**
   * Unit
   * @minLength 1
   */
  unit: string;
  profit?: Price;
}

export interface TopProductByQuantityReport {
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Sku
   * @minLength 1
   */
  sku: string;
  /**
   * Unit
   * @minLength 1
   */
  unit: string;
  /** Quantity */
  quantity: number;
}

export interface TopProductByROSReport {
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Sku
   * @minLength 1
   */
  sku: string;
  /**
   * Unit
   * @minLength 1
   */
  unit: string;
  /**
   * Ros
   * @format decimal
   */
  ros?: string | null;
}

export interface TopStaffByNetRevenueReport {
  /** Id */
  id: number;
  /**
   * Name
   * @minLength 1
   */
  name: string;
  /**
   * Email
   * @minLength 1
   */
  email: string;
  /**
   * Phone number
   * @minLength 1
   */
  phone_number: string;
  net_revenue?: Price;
}

export interface ADMIN_SITE_SETTINGS_SITE_SETTINGS_VIEW_TYPE_V1 {
  /** Currency */
  currency:
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
  /**
   * Weight unit
   * @minLength 1
   * @maxLength 12
   */
  weight_unit?: string;
  /**
   * Invoice qr code
   * @format uri
   */
  invoice_qr_code?: string | null;
  /** Invoice notes */
  invoice_notes?: string;
  /** Bank account info */
  bank_account_info?: string;
}

export interface ADMIN_USER_USER_ADDRESS_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
   * District
   * @maxLength 255
   */
  district?: string;
  /**
   * Ward
   * @maxLength 255
   */
  ward?: string;
  /**
   * Province
   * @maxLength 255
   */
  province?: string;
  /**
   * Postcode
   * @maxLength 64
   */
  postcode?: string;
  /**
   * Phone number
   * @maxLength 128
   */
  phone_number?: string;
  /** Notes */
  notes?: string;
  /** Is default for shipping */
  is_default_for_shipping?: boolean;
  /** Is default for billing */
  is_default_for_billing?: boolean;
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
  user?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
}

export interface ADMIN_USER_USER_PERMISSION_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  user?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
  permission?: {
    /** ID */
    id?: number;
    /** Content type */
    content_type?:
      | "cash.paymentmethod"
      | "cash.transactiontype"
      | "cash.transaction"
      | "cash.debtrecord"
      | "site_setting.sitesettings"
      | "account.user"
      | "shipping.shippingmethod"
      | "shipping.shipper"
      | "catalogue.attribute"
      | "catalogue.category"
      | "catalogue.product"
      | "catalogue.productclass"
      | "partner.partner"
      | "stock.purchaseorder"
      | "stock.receiptorder"
      | "stock.returnorder"
      | "stock.stockoutnote"
      | "stock.warehouse"
      | "discount.sale"
      | "discount.voucher"
      | "order.invoice"
      | "order.order"
      | "order.purchasechannel"
      | "customer.customertype"
      | "customer.customer"
      | "export.exportfile"
      | null;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /**
     * Codename
     * @minLength 1
     * @maxLength 100
     */
    codename: string;
  };
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

export interface ADMIN_USER_RESET_PASSWORD_ACTION_TYPE_V1 {
  /**
   * Token
   * @minLength 1
   */
  token: string;
}

export interface ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  primary_address?: {
    /** ID */
    id?: number;
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
     * District
     * @maxLength 255
     */
    district?: string;
    /**
     * Ward
     * @maxLength 255
     */
    ward?: string;
    /**
     * Province
     * @maxLength 255
     */
    province?: string;
    /**
     * Postcode
     * @maxLength 64
     */
    postcode?: string;
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
     * Phone number
     * @maxLength 128
     */
    phone_number?: string;
  };
  /** Is used */
  is_used: boolean;
  manager?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
}

export interface ADMIN_STOCK_WAREHOUSE_ADDRESS_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
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
   * District
   * @maxLength 255
   */
  district?: string;
  /**
   * Ward
   * @maxLength 255
   */
  ward?: string;
  /**
   * Province
   * @maxLength 255
   */
  province?: string;
  /**
   * Postcode
   * @maxLength 64
   */
  postcode?: string;
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
  warehouse?: {
    /** ID */
    id?: number;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /** Is used */
    is_used: boolean;
    /**
     * Manager
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    manager?: string;
  };
  /**
   * Phone number
   * @maxLength 128
   */
  phone_number?: string;
}

export interface ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  owner?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
  /** Status */
  status: "Draft" | "Confirmed";
  warehouse?: {
    /** ID */
    id?: number;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /**
     * Primary address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.InlineWarehouseAddressView"
     */
    primary_address?: string;
    /** Is used */
    is_used: boolean;
    /**
     * Manager
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    manager?: string;
  };
  /** Is editable */
  is_editable: boolean;
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
  total_transaction_in_amount?: Price;
  total_transaction_out_amount?: Price;
  /**
   * Owner name
   * @minLength 1
   */
  owner_name?: string;
  /**
   * Owner email
   * @format email
   * @minLength 1
   */
  owner_email?: string;
  /**
   * Owner phone number
   * @minLength 1
   */
  owner_phone_number?: string;
  /**
   * Sid
   * @minLength 1
   */
  sid?: string;
  /**
   * Warehouse name
   * @minLength 1
   */
  warehouse_name?: string;
  /** Direction */
  direction?: "in" | "out";
  /** Reason */
  reason?:
    | "customer_return"
    | "partner_return"
    | "ecommerce_return"
    | "storage_miss_match"
    | "product_expiration"
    | "other";
  base_amount?: Price;
  amount?: Price;
  /** Line count */
  line_count?: number;
  /** Item count */
  item_count?: number;
  /** Notes */
  notes?: string;
  total_price?: Price;
  shipping_charge?: Price;
}

export interface ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  stock_out_note?: {
    /** ID */
    id?: number;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /** Status */
    status: "Draft" | "Confirmed";
    /**
     * Warehouse
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.WarehouseView"
     */
    warehouse?: string;
    /** Is editable */
    is_editable: boolean;
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
    total_transaction_in_amount?: Price;
    total_transaction_out_amount?: Price;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /**
     * Warehouse name
     * @minLength 1
     */
    warehouse_name?: string;
    /** Direction */
    direction?: "in" | "out";
    /** Reason */
    reason?:
      | "customer_return"
      | "partner_return"
      | "ecommerce_return"
      | "storage_miss_match"
      | "product_expiration"
      | "other";
    base_amount?: Price;
    amount?: Price;
    /** Line count */
    line_count?: number;
    /** Item count */
    item_count?: number;
    /** Notes */
    notes?: string;
    total_price?: Price;
    shipping_charge?: Price;
  };
  record?: {
    /** ID */
    id?: number;
    /**
     * Warehouse
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.WarehouseView"
     */
    warehouse?: string;
    /**
     * Variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductVariantView"
     */
    variant?: string;
    /** Quantity */
    quantity?: number;
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
    /** Allocated quantity */
    allocated_quantity?: number;
    /**
     * Low stock threshold
     * @min 0
     * @max 2147483647
     */
    low_stock_threshold?: number | null;
    price?: Price;
  };
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
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
  /** Quantity */
  quantity?: number;
  /**
   * Unit quantity
   * @min 1
   * @max 2147483647
   */
  unit_quantity?: number;
  /**
   * Unit
   * @minLength 1
   * @maxLength 100
   */
  unit: string;
  /**
   * Variant sku
   * @minLength 1
   */
  variant_sku?: string;
  /**
   * Variant name
   * @minLength 1
   */
  variant_name?: string;
  /**
   * Unit base price incl tax
   * @format decimal
   */
  unit_base_price_incl_tax?: string;
  /**
   * Unit base price excl tax
   * @format decimal
   */
  unit_base_price_excl_tax?: string;
  line_price?: Price;
  unit_price?: Price;
  base_amount?: Price;
}

export interface ADMIN_STOCK_PURCHASE_ORDER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  owner?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
  /** Status */
  status:
    | "Draft"
    | "Confirmed"
    | "Processed"
    | "Partial_fulfilled"
    | "Fulfilled"
    | "Cancelled";
  warehouse?: {
    /** ID */
    id?: number;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /**
     * Primary address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.InlineWarehouseAddressView"
     */
    primary_address?: string;
    /** Is used */
    is_used: boolean;
    /**
     * Manager
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    manager?: string;
  };
  partner?: {
    /** ID */
    id?: number;
    /**
     * Primary address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.partner.InlinePartnerAddressView"
     */
    primary_address?: string;
    /** Is used */
    is_used: boolean;
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
    max_debt?: Price;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /**
     * Tax identification number
     * @maxLength 20
     */
    tax_identification_number?: string | null;
    /** Notes */
    notes?: string;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string;
    /** Contact info */
    contact_info?: string;
    total_debt_amount?: Price;
    total_purchase?: Price;
  };
  /** Is editable */
  is_editable: boolean;
  /**
   * Date created
   * @format date-time
   */
  date_created?: string;
  /**
   * Sid
   * @minLength 1
   */
  sid?: string;
  /**
   * Partner name
   * @minLength 1
   */
  partner_name?: string;
  /**
   * Warehouse name
   * @minLength 1
   */
  warehouse_name?: string;
  /**
   * Owner name
   * @minLength 1
   */
  owner_name?: string;
  /**
   * Owner email
   * @format email
   * @minLength 1
   */
  owner_email?: string;
  /**
   * Owner phone number
   * @minLength 1
   */
  owner_phone_number?: string;
  /**
   * Date placed
   * @format date-time
   */
  date_placed?: string;
  /** Line count */
  line_count?: number;
  /** Item count */
  item_count?: number;
  /** Notes */
  notes?: string;
  total_price?: Price;
  total_before_discounts?: Price;
}

export interface ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /** Status */
    status:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Partial_fulfilled"
      | "Fulfilled"
      | "Cancelled";
    /**
     * Warehouse
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.WarehouseView"
     */
    warehouse?: string;
    /**
     * Partner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.partner.PartnerView"
     */
    partner?: string;
    /** Is editable */
    is_editable: boolean;
    /**
     * Date created
     * @format date-time
     */
    date_created?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /**
     * Partner name
     * @minLength 1
     */
    partner_name?: string;
    /**
     * Warehouse name
     * @minLength 1
     */
    warehouse_name?: string;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Date placed
     * @format date-time
     */
    date_placed?: string;
    /** Line count */
    line_count?: number;
    /** Item count */
    item_count?: number;
    /** Notes */
    notes?: string;
    total_price?: Price;
    total_before_discounts?: Price;
  };
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
  item?: {
    /** ID */
    id?: number;
    /**
     * Partner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.partner.PartnerView"
     */
    partner?: string;
    /**
     * Variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductVariantView"
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
     * Partner sku
     * @minLength 1
     * @maxLength 255
     */
    partner_sku: string;
    price?: Price;
  };
  record?: {
    /** ID */
    id?: number;
    /**
     * Warehouse
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.WarehouseView"
     */
    warehouse?: string;
    /**
     * Variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductVariantView"
     */
    variant?: string;
    /** Quantity */
    quantity?: number;
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
    /** Allocated quantity */
    allocated_quantity?: number;
    /**
     * Low stock threshold
     * @min 0
     * @max 2147483647
     */
    low_stock_threshold?: number | null;
    price?: Price;
  };
  /** Actual receipt quantity */
  actual_receipt_quantity: number;
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
   * Quantity
   * @min 1
   * @max 2147483647
   */
  quantity?: number;
  /** Offer description */
  offer_description?: string;
  /**
   * Partner sku
   * @minLength 1
   */
  partner_sku?: string;
  /**
   * Variant sku
   * @minLength 1
   */
  variant_sku?: string;
  /**
   * Variant name
   * @minLength 1
   */
  variant_name?: string;
  /** Discount type */
  discount_type?: "Percentage" | "Absolute";
  /**
   * Discount amount
   * @format decimal
   */
  discount_amount?: string;
  /** Receipt quantity */
  receipt_quantity?: number;
  /** Return quantity */
  return_quantity?: number;
  line_price?: Price;
  line_price_before_discounts?: Price;
  unit_price?: Price;
  unit_price_before_discounts?: Price;
}

export interface ADMIN_STOCK_RECEIPT_ORDER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /** Status */
    status:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Partial_fulfilled"
      | "Fulfilled"
      | "Cancelled";
    /**
     * Warehouse
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.WarehouseView"
     */
    warehouse?: string;
    /**
     * Partner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.partner.PartnerView"
     */
    partner?: string;
    /** Is editable */
    is_editable: boolean;
    /**
     * Date created
     * @format date-time
     */
    date_created?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /**
     * Partner name
     * @minLength 1
     */
    partner_name?: string;
    /**
     * Warehouse name
     * @minLength 1
     */
    warehouse_name?: string;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Date placed
     * @format date-time
     */
    date_placed?: string;
    /** Line count */
    line_count?: number;
    /** Item count */
    item_count?: number;
    /** Notes */
    notes?: string;
    total_price?: Price;
    total_before_discounts?: Price;
  };
  /** Is editable */
  is_editable?: boolean;
  owner?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
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
  total_transaction_in_amount?: Price;
  total_transaction_out_amount?: Price;
  /**
   * Owner name
   * @minLength 1
   */
  owner_name?: string;
  /**
   * Owner email
   * @format email
   * @minLength 1
   */
  owner_email?: string;
  /**
   * Owner phone number
   * @minLength 1
   */
  owner_phone_number?: string;
  /**
   * Sid
   * @minLength 1
   */
  sid?: string;
  /** Status */
  status?: "Draft" | "Confirmed" | "Partial_paid" | "Paid" | "Over_paid";
  surcharge?: Price;
  amount?: Price;
  /** Quantity count */
  quantity_count?: number;
  /** Item count */
  item_count?: number;
  /** Notes */
  notes?: string;
}

export interface ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.PurchaseOrderView"
     */
    order?: string;
    /** Is editable */
    is_editable?: boolean;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
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
    total_transaction_in_amount?: Price;
    total_transaction_out_amount?: Price;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /** Status */
    status?: "Draft" | "Confirmed" | "Partial_paid" | "Paid" | "Over_paid";
    surcharge?: Price;
    amount?: Price;
    /** Quantity count */
    quantity_count?: number;
    /** Item count */
    item_count?: number;
    /** Notes */
    notes?: string;
  };
  line?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.PurchaseOrderView"
     */
    order?: string;
    /**
     * Variant
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.ProductVariantView"
     */
    variant?: string;
    /**
     * Item
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.partner.PartnerItemView"
     */
    item?: string;
    /**
     * Record
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.StockRecordView"
     */
    record?: string;
    /** Actual receipt quantity */
    actual_receipt_quantity: number;
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
     * Quantity
     * @min 1
     * @max 2147483647
     */
    quantity?: number;
    /** Offer description */
    offer_description?: string;
    /**
     * Partner sku
     * @minLength 1
     */
    partner_sku?: string;
    /**
     * Variant sku
     * @minLength 1
     */
    variant_sku?: string;
    /**
     * Variant name
     * @minLength 1
     */
    variant_name?: string;
    /** Discount type */
    discount_type?: "Percentage" | "Absolute";
    /**
     * Discount amount
     * @format decimal
     */
    discount_amount?: string;
    /** Receipt quantity */
    receipt_quantity?: number;
    /** Return quantity */
    return_quantity?: number;
    line_price?: Price;
    line_price_before_discounts?: Price;
    unit_price?: Price;
    unit_price_before_discounts?: Price;
  };
  /** Actual return quantity */
  actual_return_quantity: number;
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
   * Expiration date
   * @format date-time
   */
  expiration_date?: string;
  /** Notes */
  notes?: string;
  /**
   * Quantity
   * @min 1
   * @max 2147483647
   */
  quantity?: number;
  /** Return quantity */
  return_quantity?: number;
  amount?: Price;
}

export interface ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.PurchaseOrderView"
     */
    order?: string;
    /** Is editable */
    is_editable?: boolean;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
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
    total_transaction_in_amount?: Price;
    total_transaction_out_amount?: Price;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /** Status */
    status?: "Draft" | "Confirmed" | "Partial_paid" | "Paid" | "Over_paid";
    surcharge?: Price;
    amount?: Price;
    /** Quantity count */
    quantity_count?: number;
    /** Item count */
    item_count?: number;
    /** Notes */
    notes?: string;
  };
  /** Is editable */
  is_editable?: boolean;
  owner?: {
    /** ID */
    id?: number;
    /**
     * Avatar
     * @format uri
     */
    avatar?: string | null;
    /**
     * Default shipping address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_shipping_address?: string;
    /**
     * Default billing address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.InlineUserAddressView"
     */
    default_billing_address?: string;
    /**
     * Superuser status
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
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
     * Username
     * @maxLength 255
     * @pattern ^[\w.+-]+$
     */
    username?: string | null;
    /**
     * Email
     * @format email
     * @maxLength 254
     */
    email?: string | null;
    /**
     * Main phone number
     * @maxLength 128
     */
    main_phone_number?: string | null;
    /**
     * First name
     * @maxLength 128
     */
    first_name?: string;
    /**
     * Last name
     * @maxLength 128
     */
    last_name?: string;
    /** Note */
    note?: string;
    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    /**
     * Birthday
     * @format date-time
     */
    birthday?: string | null;
    /** Gender */
    gender?: "Male" | "Female" | "Other";
    /**
     * Facebook
     * @format uri
     * @maxLength 200
     */
    facebook?: string;
    /** Is staff */
    is_staff?: boolean;
    /** Is active */
    is_active?: boolean;
    /**
     * Last login
     * @format date-time
     */
    last_login?: string;
  };
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
   * Owner name
   * @minLength 1
   */
  owner_name?: string;
  /**
   * Owner email
   * @format email
   * @minLength 1
   */
  owner_email?: string;
  /**
   * Owner phone number
   * @minLength 1
   */
  owner_phone_number?: string;
  /**
   * Sid
   * @minLength 1
   */
  sid?: string;
  /** Status */
  status?: "Draft" | "Confirmed";
  amount?: Price;
  surcharge?: Price;
  /** Quantity count */
  quantity_count?: number;
  /** Item count */
  item_count?: number;
  /** Notes */
  notes?: string;
}

export interface ADMIN_STOCK_RETURN_ORDER_QUANTITY_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.ReceiptOrderView"
     */
    order?: string;
    /** Is editable */
    is_editable?: boolean;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
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
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /** Status */
    status?: "Draft" | "Confirmed";
    amount?: Price;
    surcharge?: Price;
    /** Quantity count */
    quantity_count?: number;
    /** Item count */
    item_count?: number;
    /** Notes */
    notes?: string;
  };
  receipt_order_quantity?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.ReceiptOrderView"
     */
    order?: string;
    /**
     * Line
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.PurchaseOrderLineView"
     */
    line?: string;
    /** Actual return quantity */
    actual_return_quantity: number;
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
     * Expiration date
     * @format date-time
     */
    expiration_date?: string;
    /** Notes */
    notes?: string;
    /**
     * Quantity
     * @min 1
     * @max 2147483647
     */
    quantity?: number;
    /** Return quantity */
    return_quantity?: number;
    amount?: Price;
  };
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
   * Quantity
   * @min 1
   * @max 2147483647
   */
  quantity?: number;
  amount?: Price;
}

export interface ADMIN_STOCK_RECEIPT_ORDER_STATUS_CHANGE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Order
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.PurchaseOrderView"
     */
    order?: string;
    /** Is editable */
    is_editable?: boolean;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
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
    total_transaction_in_amount?: Price;
    total_transaction_out_amount?: Price;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /** Status */
    status?: "Draft" | "Confirmed" | "Partial_paid" | "Paid" | "Over_paid";
    surcharge?: Price;
    amount?: Price;
    /** Quantity count */
    quantity_count?: number;
    /** Item count */
    item_count?: number;
    /** Notes */
    notes?: string;
  };
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
   * Old status
   * @minLength 1
   */
  old_status?: string;
  /**
   * New status
   * @minLength 1
   */
  new_status?: string;
}

export interface ADMIN_STOCK_PURCHASE_ORDER_STATUS_CHANGE_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  order?: {
    /** ID */
    id?: number;
    /**
     * Owner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    owner?: string;
    /** Status */
    status:
      | "Draft"
      | "Confirmed"
      | "Processed"
      | "Partial_fulfilled"
      | "Fulfilled"
      | "Cancelled";
    /**
     * Warehouse
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.WarehouseView"
     */
    warehouse?: string;
    /**
     * Partner
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.partner.PartnerView"
     */
    partner?: string;
    /** Is editable */
    is_editable: boolean;
    /**
     * Date created
     * @format date-time
     */
    date_created?: string;
    /**
     * Sid
     * @minLength 1
     */
    sid?: string;
    /**
     * Partner name
     * @minLength 1
     */
    partner_name?: string;
    /**
     * Warehouse name
     * @minLength 1
     */
    warehouse_name?: string;
    /**
     * Owner name
     * @minLength 1
     */
    owner_name?: string;
    /**
     * Owner email
     * @format email
     * @minLength 1
     */
    owner_email?: string;
    /**
     * Owner phone number
     * @minLength 1
     */
    owner_phone_number?: string;
    /**
     * Date placed
     * @format date-time
     */
    date_placed?: string;
    /** Line count */
    line_count?: number;
    /** Item count */
    item_count?: number;
    /** Notes */
    notes?: string;
    total_price?: Price;
    total_before_discounts?: Price;
  };
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
   * Old status
   * @minLength 1
   */
  old_status?: string;
  /**
   * New status
   * @minLength 1
   */
  new_status?: string;
}

export interface ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1 {
  /** ID */
  id?: number;
  warehouse?: {
    /** ID */
    id?: number;
    /**
     * Name
     * @minLength 1
     * @maxLength 255
     */
    name: string;
    /**
     * Primary address
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.stock.InlineWarehouseAddressView"
     */
    primary_address?: string;
    /** Is used */
    is_used: boolean;
    /**
     * Manager
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.user.UserView"
     */
    manager?: string;
  };
  variant?: {
    /** ID */
    id?: number;
    /** Is available */
    is_available: boolean;
    /** Is default */
    is_default: boolean;
    /**
     * Primary image
     * @format uri
     */
    primary_image?: string | null;
    /**
     * Units
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineExtendUnitProductView"
     */
    units?: string;
    /** Quantity */
    quantity?: number;
    /**
     * Product
     * @minLength 1
     * @default "nested_depth src.api.v1.serializers.admin.product.InlineProductView"
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
  };
  /** Quantity */
  quantity?: number;
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
  /** Allocated quantity */
  allocated_quantity?: number;
  /**
   * Low stock threshold
   * @min 0
   * @max 2147483647
   */
  low_stock_threshold?: number | null;
  price?: Price;
}

export interface LOGIN_LOGIN_VIEW_TYPE_V1 {
  /** Token */
  token?: string;
  /** Refresh token */
  refresh_token?: string;
  /** Csrf token */
  csrf_token?: string;
  /** Login as default */
  login_as_default: boolean;
}

export interface LOGIN_REFRESH_TOKEN_VIEW_TYPE_V1 {
  /** Token */
  token?: string;
}

export interface SITE_SETTINGS_SITE_SETTINGS_VIEW_TYPE_V1 {
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
