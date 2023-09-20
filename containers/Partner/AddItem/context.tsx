import React, { createContext } from "react";
import { useMutation } from "hooks";

export const PartnerItemContext = createContext({
  state: {
    mutateItem: () => {},
    mutateAddedItem: () => {},
  },
  set: (obj: object) => {},
});

const PartnerItem = ({ children }: React.PropsWithChildren<{}>) => {
  const contextValue = useMutation({
    mutateItem: () => {},
    mutateAddedItem: () => {},
  });

  return (
    <PartnerItemContext.Provider value={contextValue}>
      {children}
    </PartnerItemContext.Provider>
  );
};

export default PartnerItem;
