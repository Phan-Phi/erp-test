import { createContext } from "react";

import { useMutation } from "hooks";

export const Context = createContext({
  state: {
    id: 0,
  },
  set: (obj: object) => {},
});

const CustomerContext = ({ children }) => {
  const contextValue = useMutation({
    id: 0,
  });

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default CustomerContext;
