import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import set from "lodash/set";

const useFilter = (initState = {}) => {
  const [state, setState] = useState(initState);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const paramObj = router.query;

    if (paramObj) {
      let validParams = {};

      for (const key of Object.keys(paramObj)) {
        if (paramObj[key] !== "") {
          set(validParams, key, paramObj[key]);
        }
      }

      setState((prev) => {
        return {
          ...prev,
          ...validParams,
        };
      });
      setIsReady(true);
    }
  }, []);

  return [state, setState, isReady];
};

export default useFilter;
