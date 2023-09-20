import { Unit, Weight, PrimaryImage, Price } from "./utils";

export type PRODUCT_VARIANT_ITEM = {
  id: number;
  is_available: boolean;
  is_default: boolean;
  primary_image: PrimaryImage;
  units: Unit[];
  quantity: number;
  product: Product;
  sku: string;
  editable_sku: string;
  unit: string;
  weight: Weight;
  bar_code: string;
  name: string;
  track_inventory: boolean;
  price: Price;
  allocated_quantity: number;
  list_id_values: string;
  discounted_price: Price;
};

export interface Product {
  id: number;
  product_class: number;
  primary_image: PrimaryImage;
  publication_date: Date;
  is_published: boolean;
  meta_title: string;
  meta_description: string;
  seo_title: string;
  seo_description: string;
  sku: string;
  name: string;
  description: string;
  date_updated: Date;
  available_for_purchase: Date;
  min_variant_price: Price;
  max_variant_price: Price;
}

export interface Variant {
  id: number;
  is_available: boolean;
  is_default: boolean;
  primary_image: PrimaryImage;
  units: Unit[];
  quantity: number;
  product: Product;
  sku: string;
  editable_sku: string;
  unit: string;
  weight: Weight;
  bar_code: string;
  name: string;
  track_inventory: boolean;
  price: Price;
  allocated_quantity: number;
  list_id_values: string;
  discounted_price: Price;
}

export type PRODUCT_CATEGORY_ITEM = {
  id: number;
  parent: object | null | number;
  name: string;
  description: string;
  image: object;
  image_alt: string;
  have_product: boolean;
  full_name: string;
  level: number;
};

export type PRODUCT_TYPE_ITEM = {
  id: number;
  is_used: boolean;
  name: string;
  tax_rate: string;
  has_variants: boolean;
};

export type PRODUCT_TYPE_PRODUCT_ATTRIBUTE_ITEM = {
  id: number;
  attribute: Attribute;
  product_class: ProductClass;
};

export interface Attribute {
  id: number;
  is_used: boolean;
  name: string;
  input_type: string;
  is_variant_only: boolean;
}

export interface ProductClass {
  id: number;
  is_used: boolean;
  name: string;
  tax_rate: string;
  has_variants: boolean;
}

export type PRODUCT_ATTRIBUTE_ITEM = {
  id: number;
  is_used: boolean;
  name: string;
  input_type: string;
  is_variant_only: boolean;
};

export type PRODUCT_TYPE_VARIANT_ATTRIBUTE_ITEM = {
  id: number;
  attribute: Attribute;
  product_class: ProductClass;
  is_used: boolean;
};

export type PRODUCT_ITEM = {
  id: number;
  product_class: ProductClass;
  primary_image: PrimaryImage;
  default_variant: DefaultVariant;
  is_used: boolean;
  publication_date: Date;
  is_published: boolean;
  meta_title: string;
  meta_description: string;
  seo_title: string;
  seo_description: string;
  sku: string;
  name: string;
  description: string;
  date_updated: Date;
  available_for_purchase: Date;
  min_variant_price: Price;
  max_variant_price: Price;
};

export interface DefaultVariant {
  id: number;
  is_available: boolean;
  primary_image: PrimaryImage;
  units: number[];
  quantity: number;
  sku: string;
  editable_sku: string;
  unit: string;
  weight: Weight;
  bar_code: string;
  name: string;
  track_inventory: boolean;
  price: Price;
  allocated_quantity: number;
  list_id_values: string;
  discounted_price: Price;
}

export type PRODUCT_TYPE_PRODUCT_ATTRIBUTE_VALUE_ITEM = {
  id: number;
  values: Value[];
  product: Product;
  assignment: Assignment;
};

export interface Assignment {
  id: number;
  attribute: number;
  product_class: number;
}

export interface Value {
  id: number;
  name: string;
  value: string;
}

export type PRODUCT_PRODUCT_CATEGORY_ITEM = {
  id: number;
  product: Product;
  category: Category;
};

export interface Category {
  id: number;
  parent: number;
  name: string;
  description: string;
  image: PrimaryImage;
  image_alt: string;
  have_product: boolean;
  full_name: string;
  level: number;
}

export type PRODUCT_IMAGE_ITEM = {
  id: number;
  product: Product;
  image: PrimaryImage;
  sort_order: number;
  alt: string;
};

export type PRODUCT_VARIANT_IMAGE_ITEM = {
  id: number;
  variant: Variant;
  image: Image;
};

export interface Image {
  id: number;
  image: PrimaryImage;
  sort_order: number;
  alt: string;
}

export type PRODUCT_VARIANT_UNIT_ITEM = {
  id: number;
  variant: Variant;
  sku: string;
  editable_sku: string;
  unit: string;
  multiply: number;
  weight: Weight;
  bar_code: string;
  price: Price;
  discounted_price: Price;
};
