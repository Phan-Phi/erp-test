import chunk from "lodash/chunk";
import axios from "../axios.config";

export default async (url, data) => {
  let resList = [];
  let chunkData = chunk(data, 5);

  for await (let list of chunkData) {
    const temp = await Promise.all(
      list.map(async (id) => {
        return await axios.delete(`${url}${id}/`);
      })
    );

    resList = [...resList, ...temp];
  }

  return resList;
};
