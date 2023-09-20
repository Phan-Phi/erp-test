const fs = require("node:fs");
const path = require("node:path");
const t = require("@babel/types");
const { parse } = require("@babel/parser");
const _traverse = require("@babel/traverse");
const _template = require("@babel/template");
const _generate = require("@babel/generator");
const fsPromise = require("node:fs/promises");
const {
  STRING_EXCLUDE_KEY,
  PHONE_NUMBER_KEY_REG,
  NAME_LIST,
  DESCRIPTION_LIST,
  ADDRESS_LIST,
  PROVINCE_DISTRICT_WARD_LIST,
  TRANSFORM_NUMBER_TO_MIXED_TYPE_LIST,
} = require("./excludeKeyList");

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

const generateExpressionNode = (expression) => {
  const TEMPLATE = `const TEMPLATE = ${JSON.stringify(expression)}`;

  const ast = parse(TEMPLATE, { sourceType: "module" });
  const item = ast.program.body[0].declarations[0].init;

  return item;
};

const generateObjectProperty = (key, value) => {
  return t.objectProperty(t.identifier(key), value);
};

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
          `export const %%DEFAULT_NAME%% = process.env.NODE_ENV === 'production' ? %%DEFAULT_VALUE%% :  %%FAKE_DATA%%`
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
            const chanceObject = t.objectExpression([]);
            const defaultObject = t.objectExpression([]);

            for (const [key, value] of Object.entries(_temp)) {
              const type = value.type;
              const format = value.format;

              if (type === "string") {
                if (STRING_EXCLUDE_KEY.includes(key)) continue;

                uniqDefaultValueObject.set(
                  key,
                  generateObjectProperty(key, t.stringLiteral(""))
                );

                if ("enum" in value) {
                  let params = generateExpressionNode(value.enum);

                  if (key === "country") {
                    params = generateExpressionNode(["VN"]);
                  }

                  if (key === "status") {
                    params = generateExpressionNode(["Draft"]);
                  }

                  let chance = t.callExpression(
                    t.memberExpression(chanceIdentifier, t.identifier("pickone")),
                    [params]
                  );

                  if (key === "country") {
                    uniqDefaultValueObject.set(
                      key,
                      generateObjectProperty(key, t.stringLiteral("VN"))
                    );
                  } else {
                    uniqDefaultValueObject.set(
                      key,
                      generateObjectProperty(key, t.stringLiteral(value.enum[0]))
                    );
                  }

                  chanceObject.properties.push(generateObjectProperty(key, chance));
                  continue;
                }

                if ("format" in value) {
                  let params;
                  let chance;

                  switch (format) {
                    case "decimal":
                      params = generateExpressionNode({
                        min: 0,
                        fixed: 2,
                        max: key === "tax_rate" ? 200 : 999999999,
                      });

                      chance = t.callExpression(
                        t.memberExpression(chanceIdentifier, t.identifier("floating")),
                        [params]
                      );

                      chance = t.callExpression(
                        t.memberExpression(chance, t.identifier("toString")),
                        []
                      );

                      chanceObject.properties.push(
                        t.objectProperty(t.identifier(key), chance)
                      );

                      break;
                    case "date-time":
                      params = generateExpressionNode({ year: new Date().getFullYear() });

                      chance = t.newExpression(t.identifier("Date"), [
                        t.callExpression(
                          t.memberExpression(chanceIdentifier, t.identifier("date")),
                          [params]
                        ),
                      ]);

                      chance = t.callExpression(
                        t.memberExpression(chance, t.identifier("toISOString")),
                        []
                      );

                      if (key === "date_start") {
                        uniqDefaultValueObject.set(
                          key,
                          generateObjectProperty(
                            key,
                            parse("new Date().toISOString()").program.body[0].expression
                          )
                        );
                      } else {
                        uniqDefaultValueObject.set(
                          key,
                          generateObjectProperty(key, t.nullLiteral())
                        );
                      }

                      chanceObject.properties.push(
                        t.objectProperty(t.identifier(key), chance)
                      );

                      break;
                    case "uri":
                      params = generateExpressionNode({ domain: "facebook.com" });

                      chance = t.callExpression(
                        t.memberExpression(chanceIdentifier, t.identifier("url")),
                        [params]
                      );

                      chanceObject.properties.push(
                        t.objectProperty(t.identifier(key), chance)
                      );

                      break;
                    case "email":
                      params = generateExpressionNode({ domain: "gmail.com" });

                      chance = t.callExpression(
                        t.memberExpression(chanceIdentifier, t.identifier("email")),
                        [params]
                      );

                      chanceObject.properties.push(
                        t.objectProperty(t.identifier(key), chance)
                      );

                      break;
                  }

                  continue;
                }

                if (PHONE_NUMBER_KEY_REG.test(key)) {
                  const params = generateExpressionNode({
                    min: 770000000,
                    max: 779999999,
                  });

                  let chance = t.callExpression(
                    t.memberExpression(chanceIdentifier, t.identifier("integer")),
                    [params]
                  );

                  const mergeValue = t.callExpression(
                    t.memberExpression(t.stringLiteral("+84"), t.identifier("concat")),
                    [
                      t.callExpression(
                        t.memberExpression(chance, t.identifier("toString")),
                        []
                      ),
                    ]
                  );

                  chanceObject.properties.push(
                    t.objectProperty(t.identifier(key), mergeValue)
                  );

                  continue;
                }

                if (NAME_LIST.includes(key)) {
                  let chance;

                  switch (key) {
                    case "first_name":
                      chance = t.callExpression(
                        t.memberExpression(chanceIdentifier, t.identifier("first")),
                        []
                      );

                      chanceObject.properties.push(
                        t.objectProperty(t.identifier(key), chance)
                      );

                      break;

                    case "last_name":
                      chance = t.callExpression(
                        t.memberExpression(chanceIdentifier, t.identifier("last")),
                        []
                      );

                      chanceObject.properties.push(
                        t.objectProperty(t.identifier(key), chance)
                      );

                      break;

                    default:
                      chance = t.callExpression(
                        t.memberExpression(chanceIdentifier, t.identifier("name")),
                        []
                      );

                      chanceObject.properties.push(
                        t.objectProperty(t.identifier(key), chance)
                      );
                  }

                  continue;
                }

                if (DESCRIPTION_LIST.includes(key)) {
                  const params = generateExpressionNode({
                    words: 10,
                  });

                  const chance = t.callExpression(
                    t.memberExpression(chanceIdentifier, t.identifier("sentence")),
                    [params]
                  );

                  chanceObject.properties.push(
                    t.objectProperty(t.identifier(key), chance)
                  );

                  continue;
                }

                if (ADDRESS_LIST.includes(key)) {
                  const chance = t.callExpression(
                    t.memberExpression(chanceIdentifier, t.identifier("address")),
                    []
                  );

                  chanceObject.properties.push(
                    t.objectProperty(t.identifier(key), chance)
                  );

                  continue;
                }

                if (PROVINCE_DISTRICT_WARD_LIST.includes(key)) {
                  if (key === "province") {
                    chanceObject.properties.push(
                      t.objectProperty(
                        t.identifier(key),
                        parse(`["P_79", "Thành phố Hồ Chí Minh"]`).program.body[0]
                          .expression
                      )
                    );
                  } else if (key === "district") {
                    chanceObject.properties.push(
                      t.objectProperty(
                        t.identifier(key),
                        parse(`["D_772", "Quận 11"]`).program.body[0].expression
                      )
                    );
                  } else if (key === "ward") {
                    chanceObject.properties.push(
                      t.objectProperty(
                        t.identifier(key),
                        parse(`["W_27211", "Phường 05"]`).program.body[0].expression
                      )
                    );
                  }

                  continue;
                }

                chanceObject.properties.push(
                  t.objectProperty(t.identifier(key), t.stringLiteral(""))
                );

                continue;
              }
              if (type === "integer" || type === "number") {
                if (TRANSFORM_NUMBER_TO_MIXED_TYPE_LIST.includes(key)) {
                  chanceObject.properties.push(
                    t.objectProperty(t.identifier(key), t.nullLiteral())
                  );

                  defaultObject.properties.push(
                    generateObjectProperty(key, t.nullLiteral())
                  );

                  continue;
                }

                const minLength = value.minimum;
                const maxLength = value.maximum;

                const params = generateExpressionNode({
                  min: minLength,
                  max: maxLength,
                });

                let chance = t.callExpression(
                  t.memberExpression(chanceIdentifier, t.identifier("integer")),
                  [params]
                );

                if (minLength) {
                  defaultObject.properties.push(
                    generateObjectProperty(key, t.numericLiteral(minLength))
                  );
                } else {
                  defaultObject.properties.push(
                    generateObjectProperty(key, t.numericLiteral(0))
                  );
                }

                chanceObject.properties.push(t.objectProperty(t.identifier(key), chance));
              }

              if (type === "array") {
                const item = value.items;

                defaultObject.properties.push(
                  generateObjectProperty(key, t.arrayExpression([]))
                );

                if ("enum" in item) {
                  let params = generateExpressionNode(item.enum);

                  const chance = t.callExpression(
                    t.memberExpression(chanceIdentifier, t.identifier("pickone")),
                    [params]
                  );

                  chanceObject.properties.push(
                    t.objectProperty(t.identifier(key), t.arrayExpression([chance]))
                  );
                }
              }

              if (type === "boolean") {
                let chance = t.callExpression(
                  t.memberExpression(chanceIdentifier, t.identifier("bool")),
                  []
                );

                defaultObject.properties.push(
                  generateObjectProperty(key, t.booleanLiteral(false))
                );

                chanceObject.properties.push(t.objectProperty(t.identifier(key), chance));
              }

              if (type === "file") {
                defaultObject.properties.push(
                  generateObjectProperty(key, t.nullLiteral())
                );

                chanceObject.properties.push(
                  generateObjectProperty(key, t.nullLiteral())
                );
              }
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
    console.log("GENERATE DEFAULT VALUE COMPLETELY");
  });
} catch (err) {
  console.log("🚀 ~ file: generateDefaultValue.js:459 ~ err:", err);
}
