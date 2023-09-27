const t = require("@babel/types");

const { generateExpressionNode } = require("../utils");

const generateArrayType = (key, value) => {
  const itemObj = value.items;

  const { type: itemType, enum: enumList } = itemObj;

  let schema = generateExpressionNode("array(mixed().required()).required().default([])");

  if (itemType === "string") {
    if (enumList) {
      schema = generateExpressionNode(
        `array(string().required().oneOf(${JSON.stringify(
          enumList
        )})).required().default([])`
      );
    } else {
      schema = generateExpressionNode(
        "array(string().required()).required().default([])"
      );
    }
  } else if (itemType === "integer") {
    schema = generateExpressionNode("array(number().required()).required().default([])");
  }

  //* OVERRIDE

  return schema;
};

module.exports = {
  generateArrayType,
};
