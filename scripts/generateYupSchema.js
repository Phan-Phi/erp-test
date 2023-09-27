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

const { generateNumberType } = require("./yupSchemaType/generateNumberType");
const { generateFileType } = require("./yupSchemaType/generateFileType");
const { generateStringType } = require("./yupSchemaType/generateStringType");
const { generateObjectProperty, generateExpressionNode } = require("./utils");
const { generateBooleanType } = require("./yupSchemaType/generateBooleanType");
const { generateArrayType } = require("./yupSchemaType/generateArrayType");

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

      const writableStream = fs.createWriteStream(dest, { encoding: "utf8" });

      return fsPromise
        .readFile(path, "utf8")
        .then((content) => {
          const ast = parse(content, { sourceType: "module" });

          const yupList = [];
          const shapeList = [];
          const importList = [];
          const yupTypeList = [];
          const yupResolverList = [];

          const shapeTemplate = template(`
          export const SHAPE_NAME = SHAPE\n;
          `);

          const yupSchemaTemplate = template(`
            export const YUP_NAME = YUP\n;
          `);

          const yupResolverTemplate = template(`
            export const YUP_RESOLVER_NAME = yupResolver(YUP_SCHEMA);
          `);

          /** @type {import('@babel/traverse').TraverseOptions} **/
          const traverseOptions = {
            VariableDeclaration(path) {
              const varName = path.get("declarations")[0].node.id.name;
              const properties = path.get("declarations")[0].node.init.properties;

              let yupName = varName;
              let yupType = varName;
              let shapeName = varName;
              let yupResolverName = varName;

              if (varName.includes("POST_SCHEMA")) {
                yupName = varName.replace("POST_SCHEMA", "POST_YUP_SCHEMA");
                shapeName = varName.replace("POST_SCHEMA", "POST_SHAPE");
                yupType = varName.replace("POST_SCHEMA", "POST_YUP_SCHEMA_TYPE");
                yupResolverName = varName.replace("POST_SCHEMA", "POST_YUP_RESOLVER");
              } else if (varName.includes("PATCH_SCHEMA")) {
                yupName = varName.replace("PATCH_SCHEMA", "PATCH_YUP_SCHEMA");
                shapeName = varName.replace("PATCH_SCHEMA", "PATCH_SHAPE");
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

              let object;

              eval(`object = ${generate(targetProperty.value).code}`);

              const schema = t.objectExpression([]);

              for (const [key, value] of Object.entries(object)) {
                const type = value.type;

                if (type === "string") {
                  const result = generateStringType(key, value, object);
                  schema.properties.push(generateObjectProperty(key, result));
                }

                if (type === "integer" || type === "number") {
                  const result = generateNumberType(key, value, object);
                  schema.properties.push(generateObjectProperty(key, result));
                }

                if (type === "file") {
                  const result = generateFileType(key, value, object);
                  schema.properties.push(generateObjectProperty(key, result));
                }

                if (type === "array") {
                  const result = generateArrayType(key, value, object);
                  schema.properties.push(generateObjectProperty(key, result));
                }

                if (type === "boolean") {
                  const result = generateBooleanType(key, value, object);
                  schema.properties.push(generateObjectProperty(key, result));
                }
              }

              if (varName.includes("PATCH_SCHEMA")) {
                schema.properties.push(
                  generateObjectProperty(
                    "id",
                    generateExpressionNode("mixed().required()")
                  )
                );
              }

              shapeList.push(
                generate(
                  shapeTemplate({
                    SHAPE_NAME: t.identifier(shapeName),
                    SHAPE: t.identifier(generate(schema).code),
                  })
                ).code
              );

              const buildObj = t.callExpression(
                t.memberExpression(
                  t.callExpression(t.identifier("object"), [t.objectExpression([])]),
                  t.identifier("shape")
                ),
                [t.identifier(shapeName)]
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
            writableStream.write(`${shapeList[i]}\n\n`);

            writableStream.write(`${el}\n\n`);

            writableStream.write(`${yupResolverList[i]}\n\n`);
            writableStream.write(`${yupTypeList[i]}\n\n`);
          });

          writableStream.close();
        })
        .catch((err) => {});
    })
  ).then(async () => {
    await Promise.all(
      [postYupSchemaPath, patchYupSchemaPath].map((el) => {
        return promisify(exec)(`npx prettier ${el} --write`);
      })
    );

    console.log("GENERATE COMPLETE");
  });

  // * BEAUTIFY JS CODE
} catch (err) {
  console.log(err);
}
