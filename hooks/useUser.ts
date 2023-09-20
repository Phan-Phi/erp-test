import { useContext } from "react";

import { UserContext } from "../contexts";

export const useUser = () => {
  const context = useContext(UserContext);

  return context;
};
