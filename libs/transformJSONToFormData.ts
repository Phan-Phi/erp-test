export const transformJSONToFormData = (data: object, objectKey?: object) => {
  let formData = new FormData();

  if (objectKey == undefined) {
    objectKey = data;
  }

  for (const key of Object.keys(objectKey)) {
    if (data[key] == null) {
      continue;
    }

    if (Array.isArray(data[key])) {
      for (const el of data[key]) {
        formData.append(key, el);
      }

      continue;
    }

    formData.set(key, data[key]);
  }

  return formData;
};
