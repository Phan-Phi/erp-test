const t = require("@babel/types");
const { MIXED_LIST } = require("../excludeKeyList");
const { generateExpressionNode } = require("../utils");

const generateNumberType = (key, value, object) => {
  let schema = t.callExpression(t.identifier("number"), []);

  const nullable = value.nullable ?? false;
  const required = value.required ?? false;

  const minLength = value.minimum;
  const maxLength = value.maximum;

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

  if (minLength) {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("min")), [
      t.numericLiteral(minLength),
    ]);
  }

  if (maxLength) {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("max")), [
      t.numericLiteral(maxLength),
    ]);
  }

  if (MIXED_LIST.includes(key)) {
    const result = generateExpressionNode(
      "mixed().notRequired().nullable().transform(transformObjectToId)"
    );

    schema = result;
  }

  if (/maximum_order/g.test(key)) {
    let symmetricKey = "";

    //* [minimum_order_price, maximum_order_price]
    //* [minimum_order_weight, maximum_order_weight]

    if (key === "maximum_order_price") {
      symmetricKey = "minimum_order_price";
    } else if (key === "maximum_order_weight") {
      symmetricKey = "minimum_order_weight";
    }

    if (symmetricKey in object) {
      schema = t.callExpression(t.memberExpression(schema, t.identifier("test")), [
        t.callExpression(t.identifier("testFormat"), [t.stringLiteral(symmetricKey)]),
      ]);

      if (key === "maximum_order_weight") {
        schema = t.callExpression(t.memberExpression(schema, t.identifier("test")), [
          t.callExpression(t.identifier("testCompareValue"), [
            t.stringLiteral(symmetricKey),
            t.stringLiteral(
              "Khối lượng tối đa phải lớn hơn hoặc bằng khối lượng tối thiểu"
            ),
          ]),
        ]);
      } else if (key === "maximum_order_price") {
        schema = t.callExpression(t.memberExpression(schema, t.identifier("test")), [
          t.callExpression(t.identifier("testCompareValue"), [
            t.stringLiteral(symmetricKey),
            t.stringLiteral("Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu"),
          ]),
        ]);
      }
    }
  }

  return schema;
};

module.exports = {
  generateNumberType,
};
