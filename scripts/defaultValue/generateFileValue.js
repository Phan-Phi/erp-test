const t = require("@babel/types");

const { generateObjectProperty } = require("../utils");

const generateFileValue = (key) => {
  //* OVERRIDE

  return {
    defaultValue: generateObjectProperty(key, t.nullLiteral()),
    randomValue: generateObjectProperty(key, t.nullLiteral()),
  };
};

module.exports = {
  generateFileValue,
};
