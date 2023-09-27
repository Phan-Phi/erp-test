const t = require("@babel/types");
const { parse } = require("@babel/parser");
const { PROVINCE_DISTRICT_WARD_LIST, MIXED_LIST } = require("../excludeKeyList");
const { generateExpressionNode } = require("../utils");

const generateStringType = (key, value, object) => {
  const format = value.format;
  const enumList = value.enum;

  const minLength = value.minLength;
  const maxLength = value.maxLength;

  const nullable = value.nullable ?? false;
  const required = value.required ?? false;
  const defaultValue = value.default;

  let schema = t.callExpression(t.identifier("string"), []);

  if (defaultValue) {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("default")), [
      t.stringLiteral(defaultValue),
    ]);
  }

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
      t.identifier(minLength.toString()),
    ]);
  }

  if (maxLength) {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("max")), [
      t.identifier(maxLength.toString()),
    ]);
  }

  if (format) {
    if (format === "decimal") {
      schema = t.callExpression(t.memberExpression(schema, t.identifier("transform")), [
        t.identifier("transformDecimal"),
      ]);
    } else if (format === "date-time") {
      const resultNode = generateExpressionNode(
        "mixed().nullable().test(testFormatDate)"
      );

      schema = resultNode;

      if (key === "date_end" && "date_start" in object) {
        schema = t.callExpression(t.memberExpression(schema, t.identifier("test")), [
          t.callExpression(t.identifier("testCompareDate"), [
            t.stringLiteral("date_start"),
          ]),
        ]);
      }
    } else if (format === "uri") {
      schema = t.callExpression(t.memberExpression(schema, t.identifier("url")), []);
    } else if (format === "email") {
      schema = t.callExpression(t.memberExpression(schema, t.identifier("email")), []);
    }
  }

  if (enumList) {
    const arrayExpression = [];

    if (key === "country") {
      arrayExpression.push("VN");
    } else if (key === "currency") {
      arrayExpression.push("VND");
    } else {
      arrayExpression.push("");

      enumList.forEach((el) => {
        arrayExpression.push(el);
      });
    }

    const result = generateExpressionNode(
      `mixed().notRequired().oneOf(${JSON.stringify(
        arrayExpression
      )}).transform(transformArrayToString)`
    );

    schema = result;
  }

  //* OVERRIDE DATA

  if (/phone_number/g.test(key)) {
    let result = generateExpressionNode(
      `string()
      .notRequired()
      .test(testPhoneNumber)`
    );

    if (required) {
      result = generateExpressionNode(
        `string()
        .required()
        .test(testPhoneNumber)`
      );
    }

    schema = result;
  }

  if (key === "confirm_password") {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("test")), [
      t.identifier("testConfirmPassword"),
    ]);
  }

  if (/_incl_tax/g.test(key)) {
    let symmetricKey = "";

    //   //* [price, price_incl_tax]
    //   //* [amount, amount_incl_tax]
    //   //* [shipping_incl_tax, shipping_excl_tax]

    if (key === "price_incl_tax") {
      symmetricKey = "price";
    } else if (key === "amount_incl_tax") {
      symmetricKey = "amount";
    } else if (key === "shipping_incl_tax") {
      symmetricKey = "shipping_excl_tax";
    }

    if (symmetricKey in object) {
      schema = t.callExpression(t.memberExpression(schema, t.identifier("when")), [
        t.stringLiteral(symmetricKey),
        t.identifier("whenRequired"),
      ]);

      schema = t.callExpression(t.memberExpression(schema, t.identifier("test")), [
        t.callExpression(t.identifier("testFormat"), [t.stringLiteral(symmetricKey)]),
      ]);

      schema = t.callExpression(t.memberExpression(schema, t.identifier("test")), [
        t.callExpression(t.identifier("testCompareValue"), [
          t.stringLiteral(symmetricKey),
        ]),
      ]);
    }
  }

  if (PROVINCE_DISTRICT_WARD_LIST.includes(key)) {
    const result = generateExpressionNode(
      `mixed().notRequired().nullable().transform(transformProvinceDistrictWard)`
    );

    schema = result;
  }

  if (MIXED_LIST.includes(key)) {
    const result = generateExpressionNode(
      "mixed().nullable().notRequired().test(testEmptyString)"
    );

    schema = result;
  }

  return schema;
};

module.exports = {
  generateStringType,
};
