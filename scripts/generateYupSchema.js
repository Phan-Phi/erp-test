const fs = require("node:fs");
const path = require("node:path");
const t = require("@babel/types");
const { parse } = require("@babel/parser");
const _traverse = require("@babel/traverse");
const _template = require("@babel/template");
const _generate = require("@babel/generator");
const fsPromise = require("node:fs/promises");
const {
  PROVINCE_DISTRICT_WARD_LIST,
  TRANSFORM_NUMBER_TO_MIXED_TYPE_LIST,
} = require("./excludeKeyList");

const generate = _generate.default;
const traverse = _traverse.default;
const template = _template.default;

const postSchemaPath = path.resolve(process.cwd(), "__generated__", "POST.ts");
const postYupSchemaPath = path.resolve(process.cwd(), "__generated__", "POST_YUP.ts");

const patchSchemaPath = path.resolve(process.cwd(), "__generated__", "PATCH.ts");
const patchYupSchemaPath = path.resolve(process.cwd(), "__generated__", "PATCH_YUP.ts");

const prefixYupSchemaPath = path.resolve(
  process.cwd(),
  "scripts",
  "preconfigYupSchema.ts"
);

const prefixContent = fs.readFileSync(prefixYupSchemaPath, { encoding: "utf8" });

try {
  Promise.all(
    [
      {
        type: "POST",
        path: postSchemaPath,
        dest: postYupSchemaPath,
      },
      { type: "PATCH", path: patchSchemaPath, dest: patchYupSchemaPath },
    ].map(async (el) => {
      const { path, dest } = el;

      const writableStream = fs.createWriteStream(dest);

      return fsPromise
        .readFile(path, "utf8")
        .then((content) => {
          const ast = parse(content, { sourceType: "module" });

          const yupList = [];
          const importList = [];
          const yupTypeList = [];
          const yupResolverList = [];

          const yupSchemaTemplate = template(`
            export const YUP_NAME = YUP\n;
          `);

          const yupResolverTemplate = template(`
            export const YUP_RESOLVER_NAME = yupResolver(YUP_SCHEMA);
          `);

          console.log("================================================================");

          /** @type {import('@babel/traverse').TraverseOptions} **/
          const traverseOptions = {
            VariableDeclaration(path) {
              const varName = path.get("declarations")[0].node.id.name;
              const properties = path.get("declarations")[0].node.init.properties;

              let yupName = varName;
              let yupType = varName;
              let yupResolverName = varName;

              if (varName.includes("POST_SCHEMA")) {
                yupName = varName.replace("POST_SCHEMA", "POST_YUP_SCHEMA");
                yupType = varName.replace("POST_SCHEMA", "POST_YUP_SCHEMA_TYPE");
                yupResolverName = varName.replace("POST_SCHEMA", "POST_YUP_RESOLVER");
              } else if (varName.includes("PATCH_SCHEMA")) {
                yupName = varName.replace("PATCH_SCHEMA", "PATCH_YUP_SCHEMA");
                yupType = varName.replace("PATCH_SCHEMA", "PATCH_YUP_SCHEMA_TYPE");
                yupResolverName = varName.replace("PATCH_SCHEMA", "PATCH_YUP_RESOLVER");
              }

              importList.push(
                t.importSpecifier(t.identifier(varName), t.identifier(varName))
              );

              const targetProperty = properties.find((el) => {
                return el.key.name === "properties";
              });

              if (!targetProperty) return;

              let property;

              eval(`property = ${generate(targetProperty.value).code}`);

              const schema = t.objectExpression([]);

              for (const [key, value] of Object.entries(property)) {
                const type = value.type;

                const nullable = value.nullable ?? false;
                const required = value.required ?? false;
                const defaultValue = value.default;

                if (type === "string") {
                  const format = value.format;
                  const enumList = value.enum;

                  const minLength = value.minLength;
                  const maxLength = value.maxLength;

                  let stringSchema = t.callExpression(t.identifier("string"), []);

                  if (defaultValue) {
                    stringSchema = t.callExpression(
                      t.memberExpression(stringSchema, t.identifier("default")),
                      [t.stringLiteral(defaultValue)]
                    );
                  }

                  if (format) {
                    if (format === "decimal") {
                      stringSchema = t.callExpression(
                        t.memberExpression(stringSchema, t.identifier("transform")),
                        [t.identifier("transformDecimal")]
                      );
                    } else if (format === "date-time") {
                      stringSchema = t.callExpression(
                        t.memberExpression(stringSchema, t.identifier("nullable")),
                        []
                      );

                      stringSchema = t.callExpression(
                        t.memberExpression(stringSchema, t.identifier("test")),
                        [t.identifier("testFormatDate")]
                      );

                      if (key === "date_end" && "date_start" in property) {
                        stringSchema = t.callExpression(
                          t.memberExpression(stringSchema, t.identifier("test")),
                          [
                            t.callExpression(t.identifier("testCompareDate"), [
                              t.stringLiteral("date_start"),
                            ]),
                          ]
                        );
                      }
                    } else if (format === "uri") {
                      stringSchema = t.callExpression(
                        t.memberExpression(stringSchema, t.identifier("url")),
                        []
                      );
                    } else if (format === "email") {
                      stringSchema = t.callExpression(
                        t.memberExpression(stringSchema, t.identifier("email")),
                        []
                      );
                    }
                  }

                  if (nullable) {
                    stringSchema = t.callExpression(
                      t.memberExpression(stringSchema, t.identifier("nullable")),
                      []
                    );
                  }

                  if (required) {
                    stringSchema = t.callExpression(
                      t.memberExpression(stringSchema, t.identifier("required")),
                      []
                    );
                  } else {
                    stringSchema = t.callExpression(
                      t.memberExpression(stringSchema, t.identifier("notRequired")),
                      []
                    );
                  }

                  if (minLength) {
                    stringSchema = t.callExpression(
                      t.memberExpression(stringSchema, t.identifier("min")),
                      [t.identifier(minLength.toString())]
                    );
                  }

                  if (maxLength) {
                    stringSchema = t.callExpression(
                      t.memberExpression(stringSchema, t.identifier("max")),
                      [t.identifier(maxLength.toString())]
                    );
                  }

                  if (enumList) {
                    const arrayExpression = t.arrayExpression([]);

                    if (key === "country") {
                      arrayExpression.elements.push(t.stringLiteral("VN"));
                    } else if (key === "currency") {
                      arrayExpression.elements.push(t.stringLiteral("VND"));
                    } else {
                      enumList.forEach((el) => {
                        arrayExpression.elements.push(t.stringLiteral(el));
                      });
                    }

                    stringSchema = t.callExpression(
                      t.memberExpression(stringSchema, t.identifier("oneOf")),
                      [arrayExpression]
                    );
                  }

                  if (/phone_number/g.test(key)) {
                    stringSchema = t.callExpression(
                      t.memberExpression(stringSchema, t.identifier("test")),
                      [t.identifier("testPhoneNumber")]
                    );
                  }

                  // * add more test for _incl_tax properties
                  if (/_incl_tax/g.test(key)) {
                    let symmetricKey = "";

                    //* [price, price_incl_tax]
                    //* [amount, amount_incl_tax]
                    //* [shipping_incl_tax, shipping_excl_tax]

                    if (key === "price_incl_tax") {
                      symmetricKey = "price";
                    } else if (key === "amount_incl_tax") {
                      symmetricKey = "amount";
                    } else if (key === "shipping_incl_tax") {
                      symmetricKey = "shipping_excl_tax";
                    }

                    if (symmetricKey in property) {
                      stringSchema = t.callExpression(
                        t.memberExpression(stringSchema, t.identifier("when")),
                        [t.stringLiteral(symmetricKey), t.identifier("whenRequired")]
                      );

                      stringSchema = t.callExpression(
                        t.memberExpression(stringSchema, t.identifier("test")),
                        [
                          t.callExpression(t.identifier("testFormat"), [
                            t.stringLiteral(symmetricKey),
                          ]),
                        ]
                      );

                      stringSchema = t.callExpression(
                        t.memberExpression(stringSchema, t.identifier("test")),
                        [
                          t.callExpression(t.identifier("testCompareValue"), [
                            t.stringLiteral(symmetricKey),
                          ]),
                        ]
                      );
                    }
                  }

                  if (PROVINCE_DISTRICT_WARD_LIST.includes(key)) {
                    let mixedSchema = t.callExpression(t.identifier("mixed"), []);

                    mixedSchema = t.callExpression(
                      t.memberExpression(mixedSchema, t.identifier("notRequired")),
                      []
                    );

                    mixedSchema = t.callExpression(
                      t.memberExpression(mixedSchema, t.identifier("nullable")),
                      []
                    );

                    mixedSchema = t.callExpression(
                      t.memberExpression(mixedSchema, t.identifier("transform")),
                      [t.identifier("transformProvinceDistrictWard")]
                    );

                    schema.properties.push(
                      t.objectProperty(t.identifier(key), mixedSchema)
                    );

                    continue;
                  }

                  schema.properties.push(
                    t.objectProperty(t.identifier(key), stringSchema)
                  );
                }

                if (type === "integer" || type === "number") {
                  if (TRANSFORM_NUMBER_TO_MIXED_TYPE_LIST.includes(key)) {
                    let newSchema = t.callExpression(t.identifier("mixed"), []);

                    newSchema = t.callExpression(
                      t.memberExpression(newSchema, t.identifier("notRequired")),
                      []
                    );

                    newSchema = t.callExpression(
                      t.memberExpression(newSchema, t.identifier("nullable")),
                      []
                    );

                    newSchema = t.callExpression(
                      t.memberExpression(newSchema, t.identifier("transform")),
                      [t.identifier("transformObjectToId")]
                    );

                    schema.properties.push(
                      t.objectProperty(t.identifier(key), newSchema)
                    );

                    continue;
                  }

                  const minLength = value.minimum;
                  const maxLength = value.maximum;

                  let numberSchema = t.callExpression(t.identifier("number"), []);

                  if (nullable) {
                    numberSchema = t.callExpression(
                      t.memberExpression(numberSchema, t.identifier("nullable")),
                      []
                    );
                  }

                  if (required) {
                    numberSchema = t.callExpression(
                      t.memberExpression(numberSchema, t.identifier("required")),
                      []
                    );
                  } else {
                    numberSchema = t.callExpression(
                      t.memberExpression(numberSchema, t.identifier("notRequired")),
                      []
                    );
                  }

                  if (minLength) {
                    numberSchema = t.callExpression(
                      t.memberExpression(numberSchema, t.identifier("min")),
                      [t.numericLiteral(minLength)]
                    );
                  }

                  if (maxLength) {
                    numberSchema = t.callExpression(
                      t.memberExpression(numberSchema, t.identifier("max")),
                      [t.numericLiteral(maxLength)]
                    );
                  }

                  // * add more test for maximum_order properties
                  if (/maximum_order/g.test(key)) {
                    let symmetricKey = "";

                    //* [minimum_order_price, maximum_order_price]
                    //* [minimum_order_weight, maximum_order_weight]

                    if (key === "maximum_order_price") {
                      symmetricKey = "minimum_order_price";
                    } else if (key === "maximum_order_weight") {
                      symmetricKey = "minimum_order_weight";
                    }

                    if (symmetricKey in property) {
                      numberSchema = t.callExpression(
                        t.memberExpression(numberSchema, t.identifier("test")),
                        [
                          t.callExpression(t.identifier("testFormat"), [
                            t.stringLiteral(symmetricKey),
                          ]),
                        ]
                      );

                      if (key === "maximum_order_weight") {
                        numberSchema = t.callExpression(
                          t.memberExpression(numberSchema, t.identifier("test")),
                          [
                            t.callExpression(t.identifier("testCompareValue"), [
                              t.stringLiteral(symmetricKey),
                              t.stringLiteral(
                                "Khối lượng tối đa phải lớn hơn hoặc bằng khối lượng tối thiểu"
                              ),
                            ]),
                          ]
                        );
                      } else if (key === "maximum_order_price") {
                        numberSchema = t.callExpression(
                          t.memberExpression(numberSchema, t.identifier("test")),
                          [
                            t.callExpression(t.identifier("testCompareValue"), [
                              t.stringLiteral(symmetricKey),
                              t.stringLiteral(
                                "Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu"
                              ),
                            ]),
                          ]
                        );
                      }
                    }
                  }

                  schema.properties.push(
                    t.objectProperty(t.identifier(key), numberSchema)
                  );
                }

                if (type === "file") {
                  let mixedSchema = t.callExpression(t.identifier("mixed"), []);

                  if (nullable) {
                    mixedSchema = t.callExpression(
                      t.memberExpression(mixedSchema, t.identifier("nullable")),
                      []
                    );
                  }

                  if (required) {
                    mixedSchema = t.callExpression(
                      t.memberExpression(mixedSchema, t.identifier("required")),
                      []
                    );
                  } else {
                    mixedSchema = t.callExpression(
                      t.memberExpression(mixedSchema, t.identifier("notRequired")),
                      []
                    );
                  }

                  schema.properties.push(
                    t.objectProperty(t.identifier(key), mixedSchema)
                  );
                }

                if (type === "array") {
                  const itemObj = value.items;
                  const { type: itemType, enum: enumList } = itemObj;

                  let arraySchema = t.callExpression(t.identifier("array"), []);

                  if (required) {
                    arraySchema = t.callExpression(
                      t.memberExpression(arraySchema, t.identifier("required")),
                      []
                    );
                  } else {
                    arraySchema = t.callExpression(
                      t.memberExpression(arraySchema, t.identifier("notRequired")),
                      []
                    );
                  }

                  if (itemType === "string") {
                    if (enumList) {
                      const arrayExpression = t.arrayExpression([]);

                      enumList.forEach((el) => {
                        arrayExpression.elements.push(t.stringLiteral(el));
                      });
                      // arrayExpression
                      arraySchema = t.callExpression(
                        t.memberExpression(arraySchema, t.identifier("of")),
                        [
                          t.callExpression(
                            t.memberExpression(
                              t.callExpression(t.identifier("string"), []),
                              t.identifier("oneOf")
                            ),
                            [arrayExpression]
                          ),
                        ]
                      );
                    } else {
                      arraySchema = t.callExpression(
                        t.memberExpression(arraySchema, t.identifier("of")),
                        [t.callExpression(t.identifier("string"), [])]
                      );
                    }
                  } else if (itemType === "integer") {
                    arraySchema = t.callExpression(
                      t.memberExpression(arraySchema, t.identifier("of")),
                      [t.callExpression(t.identifier("number"), [])]
                    );
                  }

                  schema.properties.push(
                    t.objectProperty(t.identifier(key), arraySchema)
                  );
                }

                if (type === "boolean") {
                  let booleanSchema = t.callExpression(t.identifier("boolean"), []);

                  if (defaultValue) {
                    booleanSchema = t.callExpression(
                      t.memberExpression(booleanSchema, t.identifier("default")),
                      [t.stringLiteral(defaultValue)]
                    );
                  }

                  if (required) {
                    booleanSchema = t.callExpression(
                      t.memberExpression(booleanSchema, t.identifier("required")),
                      []
                    );
                  } else {
                    booleanSchema = t.callExpression(
                      t.memberExpression(booleanSchema, t.identifier("notRequired")),
                      []
                    );
                  }

                  schema.properties.push(
                    t.objectProperty(t.identifier(key), booleanSchema)
                  );
                }
              }

              // type User = InferType<typeof userSchema>;

              const buildObj = t.callExpression(
                t.memberExpression(
                  t.callExpression(t.identifier("object"), [t.objectExpression([])]),
                  t.identifier("shape")
                ),
                [schema]
              );

              yupList.push(
                generate(
                  yupSchemaTemplate({
                    YUP_NAME: t.identifier(yupName),
                    YUP: t.identifier(generate(buildObj).code),
                  })
                ).code
              );

              yupResolverList.push(
                generate(
                  yupResolverTemplate({
                    YUP_RESOLVER_NAME: t.identifier(yupResolverName),
                    YUP_SCHEMA: t.identifier(yupName),
                  })
                ).code
              );

              yupTypeList.push(
                generate(
                  t.exportNamedDeclaration(
                    t.tSTypeAliasDeclaration(
                      t.identifier(yupType),
                      null,
                      t.tsTypeReference(
                        t.identifier("InferType"),
                        t.tsTypeParameterInstantiation([
                          t.tsTypeQuery(t.identifier(yupName)),
                        ])
                      )
                    )
                  ),
                  undefined
                ).code
              );
            },
          };

          traverse(ast, traverseOptions);

          writableStream.write(prefixContent);

          yupList.forEach((el, i) => {
            writableStream.write(`${el}\n\n`);
            writableStream.write(`${yupResolverList[i]}\n\n`);
            writableStream.write(`${yupTypeList[i]}\n\n`);
          });

          writableStream.close();
        })
        .catch((err) => {});
    })
  ).then(async (el) => {
    console.log("GENERATE COMPLETE");
  });

  // * BEAUTIFY JS CODE
} catch (err) {
  console.log(err);
}
