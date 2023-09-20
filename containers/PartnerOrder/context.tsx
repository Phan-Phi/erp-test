import { useEffect, createContext } from "react";

import { useMutation } from "hooks";

export const PartnerOrderContext = createContext({
  state: {
    mutatePurchaseOrder: async () => {},
    mutateOrderedList: async () => {},
  },
  set: (obj: object) => {},
});

export default ({ children, mutate }) => {
  const contextValue = useMutation({
    mutatePurchaseOrder: async () => {},
    mutateOrderedList: async () => {},
  });

  useEffect(() => {
    contextValue.set({
      mutatePurchaseOrder: mutate,
    });
  }, [mutate]);

  return (
    <PartnerOrderContext.Provider value={contextValue}>
      {children}
    </PartnerOrderContext.Provider>
  );
};
