import useSWR from "swr";
import React, { createContext, useMemo } from "react";

import { CHOICE } from "apis";
import { ChoiceType } from "interfaces";

export const ChoiceContext = createContext<ChoiceType>({} as ChoiceType);

const Choice = ({ children }: React.PropsWithChildren<{}>) => {
  const { data } = useSWR(CHOICE, {
    refreshInterval: 300 * 1000,
  });

  const choiceMemo = useMemo<ChoiceType>(() => {
    if (data == undefined) {
      return {} as ChoiceType;
    }
    return data;
  }, [data]);

  return <ChoiceContext.Provider value={choiceMemo}>{children}</ChoiceContext.Provider>;
};

export default Choice;
