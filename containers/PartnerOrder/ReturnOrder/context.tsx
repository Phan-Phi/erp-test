import { createContext } from "react";

import { useMutation } from "hooks";

export const ReturnOrderContext = createContext({
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
    <ReturnOrderContext.Provider value={contextValue}>
      {children}
    </ReturnOrderContext.Provider>
  );
};
