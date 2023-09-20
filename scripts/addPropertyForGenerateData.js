const { NUMBER_EXCLUDE_KEY, STRING_EXCLUDE_KEY } = require("./excludeKeyList.js");

const PHONE_NUMBER_KEY_REG = /phone/g;
const NAME_KEY_REG = /name/g;

const DESCRIPTION_KEY_REG = /(description|note|alt|)/g;

const ADDRESS_KEY_REG = /(address|line)/g;

function addChanceProperty(properties) {
  for (const [key, value] of Object.entries(properties)) {
    const { type } = value;

    if (type === "string") stringBuilder(key, value);
    if (type === "integer") numberBuilder(key, value);
  }
}

function stringBuilder(key, obj) {
  const { format } = obj;

  if (STRING_EXCLUDE_KEY.includes(key)) return;

  if ("enum" in obj) return;

  if ("format" in obj) {
    switch (format) {
      case "decimal":
        obj.chance = {
          float: {
            fixed: 2,
            min: 10000,
            max: 1000000,
          },
        };

        break;
      case "date-time":
        obj.chance = {
          date: {
            year: new Date().getFullYear(),
          },
        };

        break;
      case "uri":
        obj.chance = {
          url: {
            domain: "facebook.com",
          },
        };

        break;
      case "email":
        obj.chance = {
          email: {
            domain: "gmail.com",
          },
        };

        break;
    }

    return;
  }

  if (PHONE_NUMBER_KEY_REG.test(key)) {
    obj.chance = {
      phone: {
        formatted: false,
        country: "us",
        mobile: true,
      },
    };
    return;
  }

  if (NAME_KEY_REG.test(key)) {
    if (key === "first_name") {
      obj.chance = "first";
    } else if (key === "last_name") {
      obj.chance = "last";
    } else {
      obj.chance = "name";
    }

    return;
  }

  if (DESCRIPTION_KEY_REG.test(key)) {
    obj.chance = {
      sentence: {
        words: 10,
      },
    };
    return;
  }

  if (ADDRESS_KEY_REG.test(key)) {
    obj.chance = "address";
    return;
  }
}

function numberBuilder(key, obj) {
  if (NUMBER_EXCLUDE_KEY.includes(key)) return;

  obj.chance = {
    integer: {
      min: 1,
      max: 20,
    },
  };
}

module.exports = { addChanceProperty };
