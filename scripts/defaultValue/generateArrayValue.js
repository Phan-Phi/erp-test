const t = require("@babel/types");

const { generateExpressionNode, generateObjectProperty } = require("../utils");

const chanceIdentifier = t.identifier("chance");

const generateArrayValue = (key, value) => {
  let defaultValue = generateObjectProperty(key, t.arrayExpression([]));
  let randomValue = generateObjectProperty(key, t.arrayExpression([]));

  const item = value.items;

  if ("enum" in item) {
    const params = generateExpressionNode(item.enum);

    const chance = t.callExpression(
      t.memberExpression(chanceIdentifier, t.identifier("pickone")),
      [params]
    );

    randomValue = generateObjectProperty(key, t.arrayExpression([chance]));
  }

  //* OVERRIDE

  return {
    defaultValue,
    randomValue,
  };
};

module.exports = {
  generateArrayValue,
};

// defaultObject.properties.push(
//   generateObjectProperty(key, t.arrayExpression([]))
// );

// if ("enum" in item) {
//   let params = generateExpressionNode(item.enum);

//   const chance = t.callExpression(
//     t.memberExpression(chanceIdentifier, t.identifier("pickone")),
//     [params]
//   );

//   chanceObject.properties.push(
//     t.objectProperty(t.identifier(key), t.arrayExpression([chance]))
//   );
// }
