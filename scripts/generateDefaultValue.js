const fs = require("node:fs");
const path = require("node:path");
const t = require("@babel/types");
const { parse } = require("@babel/parser");
const _traverse = require("@babel/traverse");
const _template = require("@babel/template");
const _generate = require("@babel/generator");
const fsPromise = require("node:fs/promises");
const { promisify } = require("node:util");
const { exec } = require("node:child_process");

const { generateStringValue } = require("./defaultValue/generateStringValue");
const { generateNumberValue } = require("./defaultValue/generateNumberValue");
const { generateArrayValue } = require("./defaultValue/generateArrayValue");
const { generateBooleanValue } = require("./defaultValue/generateBooleanValue");
const { generateFileValue } = require("./defaultValue/generateFileValue");

const generate = _generate.default;
const traverse = _traverse.default;
const template = _template.default;

const postSchemaPath = path.resolve(process.cwd(), "__generated__", "POST.ts");
const postDefaultValuePath = path.resolve(
  process.cwd(),
  "__generated__",
  "POST_DEFAULT_VALUE.ts"
);

// const patchSchemaPath = path.resolve(process.cwd(), "__generated__", "PATCH.ts");
// const patchFakeDataPath = path.resolve(process.cwd(), "__generated__", "PATCH_FAKER.ts");

const preconfigPath = path.resolve(process.cwd(), "scripts", "preconfigJSF.js");
const excludeListPath = path.resolve(process.cwd(), "scripts", "excludeKeyList.js");

let excludeKeyList;
let preconfigCode;

{
  const uniqList = new Set();

  const excludeListContent = fs.readFileSync(excludeListPath, "utf8");

  /** @type {import('@babel/traverse').TraverseOptions} **/
  const traverseOptions = {
    VariableDeclaration(path) {
      const elements = path.get("declarations")[0].node.init.elements;

      if (!elements) return;

      elements.forEach((element) => {
        uniqList.add(element);
      });
    },
  };

  traverse(parse(excludeListContent, { sourceType: "module" }), traverseOptions);

  excludeKeyList = t.arrayExpression([...uniqList]);
}

{
  const preconfigContent = fs.readFileSync(preconfigPath, "utf8");

  /** @type {import('@babel/traverse').TraverseOptions} **/
  const traverseOptions = {
    CallExpression(path) {
      const isJSF = path.get("callee.object").isIdentifier({ name: "jsf" });
      const isJSFOption = path.get("callee.property").isIdentifier({ name: "option" });

      if (isJSF && isJSFOption) {
        const properties = path.get("arguments")[0].node.properties;

        const newProperty = t.objectProperty(
          t.identifier("ignoreProperties"),
          excludeKeyList
        );

        properties.push(newProperty);
      }
    },
  };

  const ast = parse(preconfigContent, { sourceType: "module" });

  traverse(ast, traverseOptions);

  preconfigCode = `${generate(ast).code}\n`;
}

try {
  Promise.all(
    [
      {
        type: "POST",
        path: postSchemaPath,
        dest: postDefaultValuePath,
      },
      // { type: "PATCH", path: patchSchemaPath, dest: patchFakeDataPath },
    ].map(async (el) => {
      const { type: _type, path, dest } = el;
      const writableStream = fs.createWriteStream(dest);

      return fsPromise.readFile(path, "utf8").then((content) => {
        const ast = parse(content, { sourceType: "module" });

        const yupList = [];

        const chanceTemplate = template(`const CHANCE_NAME = CHANCE_VALUE;`);

        const defaultValueTemplate = template(
          `export const %%DEFAULT_NAME%% = process.env.NEXT_PUBLIC_ENV === 'production' ? %%DEFAULT_VALUE%% :  %%FAKE_DATA%%`
        );

        const chanceIdentifier = t.identifier("chance");

        /** @type {import('@babel/traverse').TraverseOptions} **/
        const traverseOptions = {
          VariableDeclaration(path) {
            const varName = path.get("declarations")[0].node.id.name;

            let properties = path.get("declarations")[0].node.init.properties;

            let fakeName = varName;
            let defaultValueName = varName;

            if (varName.includes("POST_SCHEMA")) {
              fakeName = varName.replace("POST_SCHEMA", "POST_FAKE_DATA");
              defaultValueName = varName.replace("POST_SCHEMA", "POST_DEFAULT_VALUE");
            } else if (varName.includes("PATCH_SCHEMA")) {
              fakeName = varName.replace("PATCH_SCHEMA", "PATCH_FAKE_DATA");
            }

            const targetProperty = properties.find((el) => {
              return el.key.name === "properties";
            });

            if (!targetProperty) return;

            let _temp;
            eval(`_temp = ${generate(targetProperty.value).code}`);

            const uniqDefaultValueObject = new Map();
            const uniqRandomValueObject = new Map();
            const chanceObject = t.objectExpression([]);
            const defaultObject = t.objectExpression([]);

            for (const [key, value] of Object.entries(_temp)) {
              const type = value.type;

              if (type === "string") {
                const result = generateStringValue(key, value);

                if (result == undefined) continue;

                const { defaultValue, randomValue } = result;

                uniqDefaultValueObject.set(key, defaultValue);
                uniqRandomValueObject.set(key, randomValue);
              }
              if (type === "integer" || type === "number") {
                const result = generateNumberValue(key, value);

                if (result == undefined) continue;

                const { defaultValue, randomValue } = result;

                uniqDefaultValueObject.set(key, defaultValue);
                uniqRandomValueObject.set(key, randomValue);

                continue;
              }

              if (type === "array") {
                const result = generateArrayValue(key, value);

                if (result == undefined) continue;

                const { defaultValue, randomValue } = result;

                uniqDefaultValueObject.set(key, defaultValue);
                uniqRandomValueObject.set(key, randomValue);

                continue;
              }

              if (type === "boolean") {
                const result = generateBooleanValue(key, value);

                if (result == undefined) continue;

                const { defaultValue, randomValue } = result;

                uniqDefaultValueObject.set(key, defaultValue);
                uniqRandomValueObject.set(key, randomValue);

                continue;
              }

              if (type === "file") {
                const result = generateFileValue(key, value);

                if (result == undefined) continue;

                const { defaultValue, randomValue } = result;

                uniqDefaultValueObject.set(key, defaultValue);
                uniqRandomValueObject.set(key, randomValue);

                continue;
              }
            }

            for (const item of uniqRandomValueObject.values()) {
              chanceObject.properties.push(item);
            }

            yupList.push(
              `${
                generate(
                  chanceTemplate({
                    CHANCE_NAME: t.identifier(fakeName),
                    CHANCE_VALUE: chanceObject,
                  })
                ).code
              }\n\n`
            );

            for (const item of uniqDefaultValueObject.values()) {
              defaultObject.properties.push(item);
            }

            yupList.push(
              `${
                generate(
                  defaultValueTemplate({
                    DEFAULT_NAME: t.identifier(defaultValueName),
                    DEFAULT_VALUE: defaultObject,
                    FAKE_DATA: t.identifier(fakeName),
                  })
                ).code
              }\n\n`
            );
          },
        };

        traverse(ast, traverseOptions);

        writableStream.write(preconfigCode);

        yupList.forEach((el) => {
          writableStream.write(el);
        });

        writableStream.close();
      });
    })
  ).then(async () => {
    await Promise.all(
      [postDefaultValuePath].map((el) => {
        return promisify(exec)(`npx prettier ${el} --write`);
      })
    );

    console.log("GENERATE DEFAULT VALUE COMPLETELY");
  });
} catch (err) {
  console.log("🚀 ~ file: generateDefaultValue.js:459 ~ err:", err);
}
