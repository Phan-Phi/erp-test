export interface Price {
  currency: string;
  excl_tax: string;
  incl_tax: string;
  tax: string;
}

export interface PrimaryImage {
  product_small: string;
  product_gallery_2x: string;
  product_small_2x: string;
  product_gallery: string;
  product_list: string;
  product_list_2x: string;
}

export interface PrimaryAddress {
  id: number;
  line1: string;
  line2: string;
  phone_number: string;
  district: string;
  ward: string;
  province: string;
  postcode: string;
  country: string;
  notes: string;
}

export interface Weight {
  unit: string;
  weight: number;
}

export interface Unit {
  id: number;
  sku: string;
  editable_sku: string;
  unit: string;
  multiply: number;
  weight: Weight;
  bar_code: string;
  price: Price;
  discounted_price: Price;
}

export interface Avatar {
  default: string;
}
