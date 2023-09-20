import { useState, useMemo } from "react";

type UseMutationProps<T extends object> = T;

const useMutation = <T extends object>(initState: UseMutationProps<T>) => {
  const [state, setState] = useState(initState);

  const contextValue = useMemo(() => {
    return {
      state,
      set: (obj: object) => {
        setState((prev) => {
          return {
            ...prev,
            ...obj,
          };
        });
      },
    };
  }, [state]);

  return contextValue;
};

export default useMutation;
