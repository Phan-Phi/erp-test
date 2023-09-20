import {
  isEmpty,
  set,
  cloneDeep,
  isEqual,
  unset,
  createRequest,
  updateRequest,
  deleteRequest,
} from "libs";

export const updateOption = async ({ url, data, deleteData, defaultData, id }) => {
  let newOption = {};
  let updateOption = {};
  let resList = [];

  for (let key of Object.keys(data)) {
    if (defaultData[key]) {
      if (!isEqual(data[key], defaultData[key])) {
        set(updateOption, key, data[key]);
      }
    } else {
      if (key === "" && data[key].name !== "") {
        set(newOption, key, data[key]);
      } else if (key !== "") {
        set(newOption, key, data[key]);
      }
    }
  }

  if (!isEmpty(newOption)) {
    const transformedOption = Object.values(newOption).map((el) => {
      return {
        ...el,
        attribute: id,
      };
    });

    const results = await createRequest(url, transformedOption);

    resList = [...resList, ...results];
  }

  // update options

  if (!isEmpty(updateOption)) {
    const transformedOption = Object.values(updateOption).map((el) => {
      const body = cloneDeep(el);
      unset(body, "is_used");
      unset(body, "originalValue");

      return body;
    });

    const results = await updateRequest(url, transformedOption);

    resList = [...resList, ...results];
  }

  // delete options

  if (!isEmpty(deleteData)) {
    const transformedOption = Object.values(deleteData).map((el) => {
      return el.id;
    });

    const results = await deleteRequest(url, transformedOption);

    resList = [...resList, ...results];
  }

  return resList;
};
