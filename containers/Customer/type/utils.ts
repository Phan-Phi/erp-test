import groupBy from "lodash/groupBy";
import get from "lodash/get";
import unset from "lodash/unset";

import { CUSTOMER_TYPE_ITEM } from "interfaces";

export const transformCustomerTypeData = (data?: CUSTOMER_TYPE_ITEM[]) => {
  if (!data) {
    return;
  }

  if (get(data, "length") === 0) {
    return [];
  }

  let groupedData = groupBy(data, "parent");

  const roots = get(groupedData, "null");

  unset(groupedData, "null");

  let orderedData: CUSTOMER_TYPE_ITEM[] = [];

  let traverseTree = (id, level) => {
    if (groupedData[id]) {
      for (let el of groupedData[id]) {
        orderedData.push(el);
        traverseTree(el.id, level + 1);
      }
    } else {
      return;
    }
  };

  for (let root of roots) {
    orderedData.push(root);
    traverseTree(root.id, 1);
  }

  return orderedData;
};
