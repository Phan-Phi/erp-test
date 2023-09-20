import {
  userAddressSchema,
  defaultUserAddressFormState,
  UserAddressSchemaProps,
} from "./userAddress";

export {
  userAddressSchema as billingAddressSchema,
  defaultUserAddressFormState as defaultBillingAddressFormState,
};

export type { UserAddressSchemaProps as BillingAddressSchemaProps };
