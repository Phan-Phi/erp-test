import { useEffect, createContext } from "react";

import { useMutation } from "hooks";

export const DiscountContext = createContext({
  state: {
    mutateAddDiscountedVariant: async () => {},
    mutateAddedDiscountedVariant: async () => {},
  },
  set: (obj: object) => {},
});

export default ({ children }) => {
  const contextValue = useMutation({
    mutateAddDiscountedVariant: async () => {},
    mutateAddedDiscountedVariant: async () => {},
  });

  return (
    <DiscountContext.Provider value={contextValue}>{children}</DiscountContext.Provider>
  );
};
