import queryString from "query-string";
import unset from "lodash/unset";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";

import { catchErrorHandler } from "./errorMessage";

export default async (req, res, url) => {
  const { axios } = req;
  let queryObj = cloneDeep(req.query);
  const id = get(queryObj, "id");
  const pdf = get(queryObj, "pdf");
  let data;

  try {
    if (id && pdf) {
      unset(queryObj, "id");
      unset(queryObj, "pdf");
      const query = queryString.stringify(queryObj);
      const { data: resData } = await axios.get(`${url}${id}/pdf?${query}`);
      data = resData;
    } else if (id) {
      unset(queryObj, "id");
      const query = queryString.stringify(queryObj);
      const { data: resData } = await axios.get(`${url}${id}?${query}`);
      data = resData;
    } else {
      const query = queryString.stringify(queryObj);
      const { data: resData } = await axios.get(`${url}?${query}`);
      data = resData;
    }

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.json(catchErrorHandler(error));
  }
};
