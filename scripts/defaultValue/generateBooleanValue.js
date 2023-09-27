const t = require("@babel/types");

const { generateObjectProperty } = require("../utils");

const chanceIdentifier = t.identifier("chance");

const generateBooleanValue = (key, value) => {
  let defaultValue = generateObjectProperty(key, t.booleanLiteral(true));

  const randomValue = generateObjectProperty(
    key,
    t.callExpression(t.memberExpression(chanceIdentifier, t.identifier("bool")), [])
  );

  if (value.default) {
    defaultValue = generateObjectProperty(key, t.booleanLiteral(true));
  }

  //* OVERRIDE

  return {
    defaultValue,
    randomValue,
  };
};

module.exports = {
  generateBooleanValue,
};
