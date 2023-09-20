const gulp = require("gulp");
const { glob } = require("glob");
const { spawn, exec } = require("node:child_process");
const { promisify } = require("node:util");

const { series } = gulp;

function getJsonSchema() {
  console.log("Start to get JSON Schema");

  return spawn("node", ["./scripts/getSchemaJson.js"])
    .once("exit", () => {
      console.log("Finish to generate type for GET request\n");
    })
    .once("error", (err) => {
      console.log("Error at generateTypeForGet", err);
    });
}

function generateTypeForGetRequest() {
  console.log("Start to generate type for GET request");

  return spawn("node", ["./scripts/generateGetResponseType.js"])
    .once("exit", () => {
      console.log("Finish to generate type for GET request\n");
    })
    .once("error", (err) => {
      console.log("Error at generateTypeForGet", err);
    });
}

function generateJsonSchema() {
  return spawn("node ./scripts/generateJsonSchema.js", {
    shell: true,
  })
    .once("exit", () => {
      console.log("Finish to generate JSON Schema\n");
    })
    .once("error", (err) => {
      console.log("Error at generateJsonSchema", err);
    });
}

function generateYupSchema() {
  return spawn("node", ["./scripts/generateYupSchema.js"], {
    shell: true,
  })
    .on("exit", () => {
      console.log("Finish to generate Yup Schema\n");
    })
    .on("error", (err) => {
      console.log("Error at generateYupSchema", err);
      process.exit(1);
    });
}

function generateDefaultValue() {
  return exec(
    "node ./scripts/generateDefaultValue.js",
    { shell: true },
    (err, stdout, stderr) => {
      if (err) throw err;
      console.log("Finish to generate Default Value Data");
    }
  );
}

async function prettierFile() {
  const files = await glob("__generated__/*.{js,ts}");

  await Promise.all(
    files.map((el) => {
      return promisify(exec)(`npx prettier ${el} --write`);
    })
  );

  console.log("Finish prettize file!");
}

exports.default = series(
  getJsonSchema,
  generateTypeForGetRequest,
  generateJsonSchema,
  generateYupSchema,
  generateDefaultValue,
  prettierFile
);
