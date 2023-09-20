import axios from "../axios.config";

import chunk from "lodash/chunk";
import unset from "lodash/unset";

export default async (url, data) => {
  let resList = [];
  let chunkData = chunk(data, 5);

  for await (let list of chunkData) {
    const temp = await Promise.all(
      list.map(async (el) => {
        const { id } = el;

        unset(el, "id");

        return await axios.patch(`${url}${id}/`, el);
      })
    );

    resList = [...resList, ...temp];
  }

  return resList;
};
