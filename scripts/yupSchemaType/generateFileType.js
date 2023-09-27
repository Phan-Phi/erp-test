const t = require("@babel/types");

const generateFileType = (key, value) => {
  const nullable = value.nullable ?? false;
  const required = value.trong ?? false;

  let schema = t.callExpression(t.identifier("mixed"), []);

  if (nullable) {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("nullable")), []);
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
  generateFileType,
};
