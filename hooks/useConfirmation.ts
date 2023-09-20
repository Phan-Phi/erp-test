import { useContext } from "react";

import { ConfirmationContext } from "contexts/Confirmation";

export const useConfirmation = () => {
  const contextValue = useContext(ConfirmationContext);

  return contextValue;
};
