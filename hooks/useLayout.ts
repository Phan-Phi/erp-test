import { useContext } from "react";

import { LayoutContext } from "../contexts";

export const useLayout = () => {
  const context = useContext(LayoutContext);

  return context;
};
