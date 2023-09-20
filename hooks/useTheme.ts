import { useContext } from "react";
import { ThemeContext } from "contexts";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  return context;
};
