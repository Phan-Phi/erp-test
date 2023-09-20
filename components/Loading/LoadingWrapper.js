import React from "react";

import get from "lodash/get";

import FailToLoad from "./FailToLoad";
import Loading from "./LoadingDynamic";

const LoadingWrapper = ({ error, data: resData, children }) => {
  if (resData === undefined) {
    return <Loading />;
  }

  if (error || get(resData, "status") === "error") {
    return <FailToLoad />;
  }

  return children;
};

export default LoadingWrapper;
