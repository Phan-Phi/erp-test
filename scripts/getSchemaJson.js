const axios = require("axios");
const url = require("node:url");
const path = require("node:path");

const fsPromise = require("node:fs/promises");

const URL_LIST = [
  "https://erp-demo.t-solution.vn/api/v1/swagger/",
  "https://erp-demo.t-solution.vn/api/v2/swagger/",
];

// const __dirname = path.dirname(url.fileURLToPath(new url.URL(import.meta.url)));

const tempFile = path.resolve(__dirname, "_temp.txt");

const regex = /\/static\/.*.json/;

console.log("RUNNING GET SCHEMA JSON");

const jsonSchemaList = [];

Promise.all(
  URL_LIST.map((el) =>
    axios.get(el).then(({ data }) => {
      const result = data.match(regex);
      if (!result) throw new Error("Can't found JSON URL");
      const jsonSchemaUrl = new url.URL(result[0], el).toString();
      jsonSchemaList.push(jsonSchemaUrl);
    })
  )
).then(async () => {
  await fsPromise.writeFile(tempFile, JSON.stringify(jsonSchemaList));
});
