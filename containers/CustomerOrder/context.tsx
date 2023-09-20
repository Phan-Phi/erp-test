import { useMutation } from "hooks";
import React, { createContext } from "react";

export const InvoiceContext = createContext({
  state: {
    mutateOrderInvoiceForCancelOrder: async () => {},
    mutateInvoiceList: async () => {},
    mutateOrderLineList: async () => {},
  },
  set: (obj: object) => {},
});

export default ({ children }) => {
  const contextValue = useMutation({
    mutateOrderInvoiceForCancelOrder: async () => {},
    mutateInvoiceList: async () => {},
    mutateOrderLineList: async () => {},
  });

  return (
    <InvoiceContext.Provider value={contextValue}>{children}</InvoiceContext.Provider>
  );
};
