import React from "react";

import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from "components";

const ErrorBoundaryWrapper = ({ children }: React.PropsWithChildren<{}>) => {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};

export default ErrorBoundaryWrapper;
