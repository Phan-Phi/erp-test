const t = require("@babel/types");
const { parse } = require("@babel/parser");

const generateExpressionNode = (expression) => {
  let _expression = expression;

  if (typeof _expression !== "string") {
    _expression = JSON.stringify(_expression);
  }

  const TEMPLATE = `const TEMPLATE = ${_expression}`;

  const ast = parse(TEMPLATE, { sourceType: "module" });
  const item = ast.program.body[0].declarations[0].init;

  return item;
};

const generateObjectProperty = (key, value) => {
  return t.objectProperty(t.identifier(key), value);
};

module.exports = {
  generateExpressionNode,
  generateObjectProperty,
};
