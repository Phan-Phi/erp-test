const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");
const { generateApi } = require("swagger-typescript-api");

//* login for get key before request schema

const tempFile = path.resolve(__dirname, "_temp.txt");

if (!fs.existsSync(tempFile)) {
  throw new Error("_temp.txt doesn't exist!");
}

const outputPath = path.resolve(process.cwd(), "__generated__");

try {
  const content = fs.readFileSync(tempFile, { encoding: "utf8" });

  const parsedContent = JSON.parse(content);

  let sequencePromise = Promise.resolve();

  parsedContent.forEach((el, idx) => {
    sequencePromise = sequencePromise.then(() => {
      const { pathname } = new URL(el);

      const VERSION = pathname.split("/").slice(-1)[0].split(".")[0];

      return generateType({
        url: el,
        outputPath,
        name: `apiType_${VERSION}.ts`,
        version: VERSION.toUpperCase(),
      });
    });
  });

  sequencePromise;

  console.log("===== GENERATE SUCCESSFULLY =====");
} catch (err) {
  console.log("🚀 ~ file: generateGetResponseType.js:39 ~ childProcess.on ~ err:", err);
}

const generateType = ({ url, outputPath, name, version }) => {
  return generateApi({
    url,
    name,
    output: outputPath,
    generateResponses: false,
    generateClient: false,
    hooks: {
      onFormatTypeName: (typeName, rawTypeName, schemaType) => {
        const rawTypeNameList = rawTypeName.split(".");

        const seperatorIdx = rawTypeNameList.findIndex((el) => {
          return el === "serializers";
        });

        if (seperatorIdx === -1) return typeName;

        let newTypeNameList = rawTypeNameList.slice(seperatorIdx + 1);

        const lastIdx = newTypeNameList.length - 1;

        const transformedTypeNameList = [];

        newTypeNameList.forEach((el, idx) => {
          if (idx === lastIdx) {
            return el.split(/(?=[A-Z])/).forEach((el) => {
              transformedTypeNameList.push(el.toUpperCase());
            });
          }
          transformedTypeNameList.push(el.toUpperCase().trim());
        });

        return transformedTypeNameList.join("_").concat("_TYPE").concat(`_${version}`);
      },
    },
  });
};
