import { useContext } from "react";
import { ChoiceContext } from "../contexts";

export const useChoice = () => {
  const data = useContext(ChoiceContext);

  return data;
};
