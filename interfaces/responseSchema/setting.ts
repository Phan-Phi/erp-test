interface SETTING_ITEM {
  currency: string;
  logo: {
    default: string;
  } | null;
  line1: string;
  line2: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  postcode: string;
  company_name: string;
  store_name: string;
  store_description: string;
  store_website: string;
  hotline_1: string;
  hotline_2: string;
  tax_identification_number: string;
  weight_unit: string;
  invoice_qr_code: string;
  invoice_notes: string;
}

export type { SETTING_ITEM };
