import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";

const objectList = ["variant", "partner"];

export default (keyList, currentData, originalData) => {
  const body = {};

  if (isEmpty(currentData)) {
    return {};
  }

  keyList.forEach((key) => {
    if (key === "weight") {
      set(body, key, currentData[key] || get(originalData[key], "weight"));
    } else if (key === "price") {
      set(body, key, currentData[key] || get(originalData[key], "excl_tax"));
    } else if (key === "price_incl_tax") {
      set(body, key, currentData[key] || get(originalData, "price.incl_tax"));
    } else if (objectList.includes(key)) {
      set(body, key, currentData[key] || get(originalData[key], "id"));
    } else {
      let value =
        typeof currentData[key] === "number"
          ? currentData[key].toString()
          : currentData[key];

      set(body, key, value || originalData[key]);
    }
  });

  return body;
};
