import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "Trường này bắt buộc",
  },

  string: {
    email: "Vui lòng nhập đúng định dạng email",
    min: "Trường này ít nhất ${min} kí tự",
  },
});

export * from "./login";
export * from "./setting";
export * from "./shipper";
export * from "./partner";
export * from "./product";
export * from "./warehouse";
export * from "./productType";
export * from "./transaction";
export * from "./customerType";
export * from "./productImage";
export * from "./variantImage";
export * from "./paymentMethod";
export * from "./shippingMethod";
export * from "./partnerAddress";
export * from "./purchaseChannel";
export * from "./transactionType";
export * from "./productVariant";
export * from "./warehouseRecord";
export * from "./productCategory";
export * from "./warehouseAddress";
export * from "./productVariantUnit";
export * from "./connectProductAttribute";
export * from "./connectProductWithCategory";

export * from "./partnerItem";
export * from "./outnote";
export * from "./outnoteLine";

export * from "./purchaseOrder";
export * from "./purchaseOrderLine";

export * from "./receiptOrder";
export * from "./receiptOrderQuantity";

export * from "./returnOrder";
export * from "./returnOrderQuantity";

export * from "./customer";
export * from "./customerAddress";

export * from "./saleInCharge";

export * from "./order";
export * from "./orderLine";

export * from "./shippingAddress";

export * from "./billingAddress";

export * from "./user";
export * from "./userAddress";

export * from "./invoice";
export * from "./invoiceQuantity";

export * from "./userPermission";

export * from "./discount";

export * from "./changePassword";

export * from "./exportInvoice";
export * from "./exportTransaction";
export * from "./exportDebtRecord";

// * ===== ===== ===== ===== =====

export {
  default as productAttributeSchema,
  defaultFormState as defaultProductAttributeFormState,
} from "./productAttribute";

export {
  default as productAttributeOptionSchema,
  defaultFormState as defaultProductAttributeOptionFormState,
} from "./productAttributeOption";

export {
  default as productAttributeValueSchema,
  defaultFormState as defaultProductAttributeValueFormState,
} from "./productAttributeValue";

export {
  default as variantAttributeValueSchema,
  defaultFormState as defaultVariantAttributeValueFormState,
} from "./variantAttributeValue";
