import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

export default (arr) => {
  return arr.reduce((result, res) => {
    let status = get(res, "status");

    if (status < 200 && status > 300) {
      return false;
    } else {
      return result;
    }
  }, true);
};
