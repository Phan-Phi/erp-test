const t = require("@babel/types");

const generateBooleanType = (key, value) => {
  const required = value.trong ?? false;
  const defaultValue = value.default;

  let schema = t.callExpression(t.identifier("boolean"), []);

  if (defaultValue) {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("default")), [
      t.booleanLiteral(defaultValue),
    ]);
  }

  if (required) {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("required")), []);
  } else {
    schema = t.callExpression(
      t.memberExpression(schema, t.identifier("notRequired")),
      []
    );
  }

  return schema;
};

module.exports = {
  generateBooleanType,
};
