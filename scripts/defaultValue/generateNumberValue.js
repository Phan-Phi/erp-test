const t = require("@babel/types");

const { EMPTY_LIST, MIXED_LIST } = require("../excludeKeyList");
const { generateExpressionNode, generateObjectProperty } = require("../utils");

const chanceIdentifier = t.identifier("chance");

const generateNumberValue = (key, value) => {
  const minLength = value.minimum;
  const maxLength = Math.min(value.maximum ?? 1000000, 1000000);

  let defaultValue = generateObjectProperty(key, t.numericLiteral(0));
  let randomValue = generateObjectProperty(key, t.numericLiteral(0));

  const params = generateExpressionNode({
    min: minLength,
    max: maxLength,
  });

  const chance = t.callExpression(
    t.memberExpression(chanceIdentifier, t.identifier("integer")),
    [params]
  );

  randomValue = generateObjectProperty(key, chance);

  if (minLength) {
    defaultValue = generateObjectProperty(key, t.numericLiteral(minLength));
  }

  //* OVERRIDE

  if (EMPTY_LIST.includes(key)) {
    defaultValue = generateObjectProperty(key, t.stringLiteral(""));
    randomValue = generateObjectProperty(key, t.stringLiteral(""));
  }

  if (/quantity/g.test(key)) {
    const result = generateExpressionNode("chance.integer({min: 0, max: 50})");
    randomValue = generateObjectProperty(key, result);
  }

  if (MIXED_LIST.includes(key)) {
    defaultValue = generateObjectProperty(key, t.nullLiteral());
    randomValue = generateObjectProperty(key, t.nullLiteral());
  }

  return {
    defaultValue,
    randomValue,
  };
};

module.exports = {
  generateNumberValue,
};
