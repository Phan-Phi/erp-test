import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePrevious } from "react-use";

import queryString from "query-string";

import pick from "lodash/pick";
import omit from "lodash/omit";
import isEqual from "lodash/isEqual";

import { transformUrl } from "libs";

interface Props {
  initState?: {
    [key: string]: any;
  };
  callback?: (params: object) => void;
  excludeKeys?: string[];
  isUpdateRouter?: boolean;
  isShallow?: boolean;
  isScroll?: boolean;
}

export const useParams = (props: Props = {}) => {
  const {
    initState = {},
    callback = () => {},
    excludeKeys = [],
    isScroll = false,
    isShallow = true,
    isUpdateRouter = true,
  } = props;

  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState(initState);
  const prevParams = usePrevious(params);

  useEffect(() => {
    setParams((prev) => {
      const originalObj = { ...prev, ...router.query };

      const newObj: Record<string, any> = {};

      for (const key of Object.keys(originalObj)) {
        if (!!originalObj[key]) {
          newObj[key] = originalObj[key];
        }
      }

      return newObj;
    });
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isEqual(prevParams, params)) {
      return;
    }

    const urlParams = omit(params, [...excludeKeys]);

    const { url } = queryString.parseUrl(router.asPath);

    const pathname = transformUrl(url, urlParams);

    callback(params);

    if (isUpdateRouter) {
      router.push(pathname, pathname, {
        shallow: isShallow,
        scroll: isScroll,
      });
    }
  }, [callback, params, prevParams]);

  const paramsHandler = useCallback((value) => {
    setParams((prev) => {
      return {
        ...prev,
        ...value,
      };
    });
  }, []);

  const resetParams = useCallback(() => {
    const whiteList = ["page_size", "use_cache", "nested_depth"];

    const defaultParams = {
      page_size: 25,
      use_cache: false,
      page: 1,
    };

    setParams({ ...defaultParams, ...pick(params, whiteList) });
  }, [params]);

  return [params, paramsHandler, isReady, resetParams] as [
    params: typeof params,
    paramsHandler: typeof paramsHandler,
    isReady: typeof isReady,
    resetParams: typeof resetParams
  ];
};

export default useParams;
