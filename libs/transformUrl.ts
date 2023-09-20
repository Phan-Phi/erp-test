import queryString from "query-string";

type Params = [orignalUrl: string | undefined, addtionalParams?: object];

type FunctionType = (...args: Params) => string;

export const transformUrl: FunctionType = (originalUrl, addtionalParams) => {
  if (originalUrl == undefined) {
    return "";
  }

  let { url, query: params } = queryString.parseUrl(originalUrl);

  params = {
    ...params,
    ...addtionalParams,
  };

  return `${url}?${queryString.stringify(params)}`;
};
