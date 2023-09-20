import { useContext } from "react";

import { SettingContext } from "contexts";

export const useSetting = () => {
  const context = useContext(SettingContext);

  return context;
};
