import { createContext } from "react";
import { useMutation } from "hooks";

export const ReceiptOrderContext = createContext({
  state: {
    mutate: async () => {},
  },
  set: (obj: object) => {},
});

export default ({ children }) => {
  const contextValue = useMutation({
    mutate: async () => {},
  });

  return (
    <ReceiptOrderContext.Provider value={contextValue}>
      {children}
    </ReceiptOrderContext.Provider>
  );
};
