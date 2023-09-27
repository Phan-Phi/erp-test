const t = require("@babel/types");

const {
  PROVINCE_DISTRICT_WARD_LIST,
  EMPTY_LIST,
  NULL_LIST,
  PHONE_NUMBER_KEY_REG,
  DESCRIPTION_KEY_REG,
  ADDRESS_KEY_REG,
  NAME_KEY_REG,
  MIXED_LIST,
} = require("../excludeKeyList");
const { generateExpressionNode, generateObjectProperty } = require("../utils");

const chanceIdentifier = t.identifier("chance");

const generateStringValue = (key, value) => {
  let defaultValue = generateObjectProperty(key, t.stringLiteral(""));
  let randomValue = generateObjectProperty(key, t.stringLiteral(""));

  const format = value.format;

  if ("enum" in value) {
    const params = generateExpressionNode(value.enum);

    const chance = t.callExpression(
      t.memberExpression(chanceIdentifier, t.identifier("pickone")),
      [params]
    );

    randomValue = generateObjectProperty(key, chance);
    defaultValue = generateObjectProperty(key, t.stringLiteral(value.enum[0]));
  }

  if ("format" in value) {
    let params;
    let chance;
    switch (format) {
      case "decimal":
        params = generateExpressionNode({
          min: 0,
          fixed: 2,
          max: 1000000,
        });

        chance = t.callExpression(
          t.memberExpression(chanceIdentifier, t.identifier("floating")),
          [params]
        );
        chance = t.callExpression(
          t.memberExpression(chance, t.identifier("toString")),
          []
        );

        randomValue = generateObjectProperty(key, chance);

        break;
      case "date-time":
        params = generateExpressionNode(
          `new Date(
            chance.date({
              year: 2023,
            })
          ).toISOString()`
        );

        defaultValue = generateObjectProperty(key, t.nullLiteral());
        randomValue = generateObjectProperty(key, params);

        break;
      case "uri":
        params = generateExpressionNode({});

        chance = t.callExpression(
          t.memberExpression(chanceIdentifier, t.identifier("url")),
          [params]
        );
        randomValue = generateObjectProperty(key, chance);

        break;
      case "email":
        params = generateExpressionNode({ domain: "gmail.com" });

        chance = t.callExpression(
          t.memberExpression(chanceIdentifier, t.identifier("email")),
          [params]
        );

        randomValue = generateObjectProperty(key, chance);

        break;

      default:
    }
  }

  //* OVERRIDE

  if (key === "country") {
    defaultValue = generateObjectProperty(key, t.stringLiteral("VN"));
    randomValue = generateObjectProperty(key, t.stringLiteral("VN"));
  }

  if (PROVINCE_DISTRICT_WARD_LIST.includes(key)) {
    defaultValue = generateObjectProperty(key, t.nullLiteral());
    if (key === "province") {
      randomValue = generateObjectProperty(
        key,
        generateExpressionNode(["P_79", "Thành phố Hồ Chí Minh"])
      );
    } else if (key === "district") {
      randomValue = generateObjectProperty(
        key,
        generateExpressionNode(["D_772", "Quận 11"])
      );
    } else if (key === "ward") {
      randomValue = generateObjectProperty(
        key,
        generateExpressionNode(["W_27211", "Phường 05"])
      );
    }
  }

  if (PHONE_NUMBER_KEY_REG.test(key)) {
    const result = generateExpressionNode(`"+84".concat(chance.integer({
      "min": 770000000,
      "max": 779999999
    }).toString())`);

    defaultValue = generateObjectProperty(key, t.stringLiteral("+84"));
    randomValue = generateObjectProperty(key, result);
  }

  if (NAME_KEY_REG.test(key)) {
    let chance;
    switch (key) {
      case "first_name":
        chance = t.callExpression(
          t.memberExpression(chanceIdentifier, t.identifier("first")),
          []
        );

        randomValue = generateObjectProperty(key, chance);

        break;
      case "last_name":
        chance = t.callExpression(
          t.memberExpression(chanceIdentifier, t.identifier("last")),
          []
        );

        randomValue = generateObjectProperty(key, chance);

        break;
      default:
        chance = t.callExpression(
          t.memberExpression(chanceIdentifier, t.identifier("name")),
          []
        );

        randomValue = generateObjectProperty(key, chance);
    }
  }

  if (DESCRIPTION_KEY_REG.test(key)) {
    const params = generateExpressionNode({
      words: 10,
    });
    const chance = t.callExpression(
      t.memberExpression(chanceIdentifier, t.identifier("sentence")),
      [params]
    );

    randomValue = generateObjectProperty(key, chance);
  }

  if (ADDRESS_KEY_REG.test(key)) {
    const chance = t.callExpression(
      t.memberExpression(chanceIdentifier, t.identifier("address")),
      []
    );
    randomValue = generateObjectProperty(key, chance);
  }

  if (/status/g.test(key) && "enum" in value) {
    randomValue = generateObjectProperty(key, t.stringLiteral(value.default));
  }

  if (key.includes("date_start")) {
    const result = generateExpressionNode(`new Date().toISOString()`);
    randomValue = generateObjectProperty(key, result);
  }

  if (key.includes("date_end") || key === "expiration_date") {
    const result = generateExpressionNode(
      `new Date(chance.date({year: parseInt(chance.exp_year())})).toISOString()`
    );
    randomValue = generateObjectProperty(key, result);
  }

  if (key === "birthday") {
    const result = generateExpressionNode(`new Date(chance.birthday()).toISOString()`);
    randomValue = generateObjectProperty(key, result);
  }

  if (["publication_date", "available_for_purchase"].includes(key)) {
    const result = generateExpressionNode(`new Date().toISOString()`);
    randomValue = generateObjectProperty(key, result);
  }

  if (key === "tax_rate") {
    const result = generateExpressionNode(
      "chance.floating({min: 0, fixed: 2, max: 100}).toString()"
    );

    randomValue = generateObjectProperty(key, result);
  }

  if (EMPTY_LIST.includes(key)) {
    defaultValue = generateObjectProperty(key, t.stringLiteral(""));
    randomValue = generateObjectProperty(key, t.stringLiteral(""));
  }

  if (NULL_LIST.includes(key)) {
    defaultValue = generateObjectProperty(key, t.nullLiteral());
    randomValue = generateObjectProperty(key, t.nullLiteral());
  }

  return {
    defaultValue,
    randomValue,
  };
};

module.exports = {
  generateStringValue,
};
