const { MixedSchema } = require("yup/lib/mixed");

const { parse } = require("@babel/parser");
const _traverse = require("@babel/traverse");
const _template = require("@babel/template");
const _generate = require("@babel/generator");
const fsPromise = require("node:fs/promises");

const { StringSchema, object, string, date, number, mixed } = require("yup");
const { parseJSON, isValid, compareAsc } = require("date-fns");
const { isValidPhoneNumber, parsePhoneNumber } = require("react-phone-number-input");
const Chance = require("chance");
const { yupResolver } = require("@hookform/resolvers/yup");

const process = require("node:process");

const generate = _generate.default;
const traverse = _traverse.default;
const template = _template.default;
// el[0] value
// el[1] display_value

const _test = string().notRequired().oneOf(["", "Male", "Female", "Other"]);

// _test.validate("1").then(() => {
//   console.log("?");
// });

// type User = InferType<typeof userSchema>;

// const testFormat = (th, key, errorMessa) => {
//   th.base = th.base.test({
//     test: (value, context) => {
//       const { parent, createError } = context;

//       const comparedPrice = parent[key];

//       const parsedComparedPrice = parseFloat(comparedPrice);
//       const parsedPriceIncludeTax = parseFloat(value);

//       if (isNaN(parsedComparedPrice) || isNaN(parsedPriceIncludeTax)) {
//         return createError({
//           message: errorMessage,
//         });
//       }

//       return true;
//     },
//   });
// };

// const testCompareValue = (th, key, errorMessage) => {
//   th.base = th.base.test({
//     test: (value, context) => {
//       const { parent, createError } = context;

//       const comparedPrice = parent[key];

//       const parsedComparedPrice = parseFloat(comparedPrice);
//       const parsedPriceIncludeTax = parseFloat(value);

//       if (parsedPriceIncludeTax < parsedComparedPrice) {
//         return createError({
//           message: errorMessage,
//         });
//       }

//       return true;
//     },
//   });
// };

// const CONFIG = {
//   postConvert(th) {
//     const { key, constraints, properties, validator } = th;

//     // * add logic for validate number
//     if (key.includes("phone_number")) {
//       th.base = th.base.test({
//         message: "Số điện thoại không hợp lệ",
//         test(value) {
//           if (!value) return false;

//           const phoneNumber = parsePhoneNumber(value);

//           if (!phoneNumber) return false;

//           if (phoneNumber.country !== "VN") return false;

//           if (!isValidPhoneNumber(phoneNumber.number)) return false;

//           return true;
//         },
//       });
//     }

//     // * convert "" to "0" for decimal format
//     if (constraints.format === "decimal") {
//       th.base = th.base.transform(function (value) {
//         return value === "" ? "0" : value;
//       });
//     }

//     // * add more test for _incl_tax properties
//     if (key.includes("_incl_tax")) {
//       let symmetricKey = "";

//       //* [price, price_incl_tax]
//       //* [amount, amount_incl_tax]
//       //* [shipping_incl_tax, shipping_excl_tax]

//       if (key === "price_incl_tax") {
//         symmetricKey = "price";
//       } else if (key === "amount_incl_tax") {
//         symmetricKey = "amount";
//       } else if (key === "shipping_incl_tax") {
//         symmetricKey = "shipping_excl_tax";
//       }

//       if (symmetricKey in properties) {
//         th.base = th.base.when(symmetricKey, {
//           is: true,
//           then: (schema) => {
//             return schema.required();
//           },
//         });

//         testFormat(th, symmetricKey, "Không đúng định dạng");
//         testCompareValue(
//           th,
//           symmetricKey,
//           "Giá có thuế phải lớn hơn hoặc bằng giá chưa thuế"
//         );
//       }
//     }

//     // * add more test for maximum_order properties
//     if (key.includes("maximum_order")) {
//       let symmetricKey = "";

//       //* [minimum_order_price, maximum_order_price]
//       //* [minimum_order_weight, maximum_order_weight]

//       if (key === "maximum_order_price") {
//         symmetricKey = "minimum_order_price";
//       } else if (key === "maximum_order_weight") {
//         symmetricKey = "minimum_order_weight";
//       }

//       if (symmetricKey in properties) {
//         th.base = th.base.when(symmetricKey, {
//           is: true,
//           then: (schema) => {
//             return schema.required();
//           },
//         });

//         testFormat(th, symmetricKey, "Không đúng định dạng");

//         if (key === "maximum_order_weight") {
//           testCompareValue(
//             th,
//             symmetricKey,
//             "Khối lượng tối đa phải lớn hơn hoặc bằng khối lượng tối thiểu"
//           );
//         } else if (key === "maximum_order_price") {
//           testCompareValue(
//             th,
//             symmetricKey,
//             "Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu"
//           );
//         }
//       }
//     }

//     // * Tranform date-time from string schema to date schema
//     if (constraints.format === "date-time") {
//       th.base = th.base.test({
//         test(value, context) {
//           const date = parseJSON(value);
//           const { createError } = context;

//           if (!isValid(date)) {
//             return createError({
//               message: "Không đúng định dạng",
//             });
//           }

//           return true;
//         },
//         message: "Không đúng định dạng",
//       });

//       if (key === "date_end" && "date_start" in properties) {
//         th.base = th.base.test({
//           test(value, context) {
//             const { parent, createError } = context;

//             const dateStart = parseJSON(parent["date_start"] ?? "");
//             const dateEnd = value;

//             if (dateEnd == null) return true;

//             if (
//               compareAsc(parseJSON(dateEnd).getTime(), parseJSON(dateStart).getTime()) >=
//               0
//             ) {
//               return true;
//             } else {
//               return createError({
//                 message: "Ngày kết thúc phải sau ngày bắt đầu",
//               });
//             }
//           },
//           message: "Ngày kết thúc phải sau ngày bắt đầu",
//         });
//       }
//     }

//     //* avatar | image

//     if (["avatar", "image"].includes(key)) {
//       console.log(key, constraints);

//       let base = validator.mixed();

//       for (const [key, value] of Object.entries(constraints)) {
//         if (key === "required" && value) {
//           base = base.required();
//         }

//         if (key === "nullable" && value) {
//           base = base.nullable();
//         }
//       }

//       th.base = base;
//     }
//   },
// };

// const chance = new Chance();

// jsf.JSONSchemaFaker.extend("chance", () => chance);

// jsf.option({
//   alwaysFakeOptionals: true,
//   ignoreProperties: ["image", "avatar", "token", "csrf_token", "refresh_token"],
//   failOnInvalidFormat: false,
//   failOnInvalidTypes: false,
// });

// jsf.format("interger", () => {
//   return chance.integer({ min: 0 });
// });

// jsf.format("decimal", () => {
//   return chance.floating({ fixed: 2, min: 100000, max: 1000000 });
// });

// jsf.format("email", () => {
//   return chance.email({ length: 15, domain: "gmail.com" });
// });

// const ADMIN_PARTNERS_ITEMS_POST_SCHEMA = {
//   type: "object",
//   properties: {
//     partner_sku: {
//       required: true,
//       type: "string",
//       maxLength: 255,
//       minLength: 1,
//     },
//     price: {
//       required: true,
//       type: "string",
//       format: "decimal",
//     },
//     price_incl_tax: {
//       required: true,
//       type: "string",
//       format: "decimal",
//     },
//     partner: {
//       required: true,
//       type: "integer",
//     },

//     shipping_incl_tax: {
//       required: true,
//       type: "string",
//       format: "decimal",
//     },
//     shipping_excl_tax: {
//       required: true,
//       type: "string",
//       format: "decimal",
//     },
//     amount: {
//       required: true,
//       type: "string",
//       format: "decimal",
//     },
//     amount_incl_tax: {
//       required: true,
//       type: "string",
//       format: "decimal",
//     },
//     minimum_order_weight: {
//       required: true,
//       type: "number",
//       minimum: 0,
//     },
//     maximum_order_weight: {
//       required: true,
//       type: "number",
//       nullable: true,
//     },
//     minimum_order_price: {
//       required: true,
//       type: "string",
//       format: "decimal",
//     },
//     maximum_order_price: {
//       required: true,
//       type: "string",
//       format: "decimal",
//       nullable: true,
//     },
//     avatar: {
//       required: false,
//       type: "file",
//       nullable: true,
//     },
//     image: {
//       required: false,
//       type: "file",
//       nullable: true,
//     },
//     date_start: {
//       required: false,
//       type: "string",
//       format: "date-time",
//       default: "2023-05-24T15:06:31.078354+07:00",
//     },
//     date_end: {
//       required: false,
//       type: "string",
//       format: "date-time",
//       default: "2023-05-25T15:06:31.079128+07:00",
//     },
//     target_id: {
//       required: false,
//       type: "integer",
//       maximum: 9223372036854776000,
//       minimum: 0,
//       nullable: true,
//     },
//     discount_type: {
//       required: true,
//       type: "string",
//       enum: ["Percentage", "Absolute"],
//     },
//     email: {
//       required: false,
//       type: "string",
//       format: "email",
//       maxLength: 254,
//     },
//   },
//   additionalProperties: false,
// };

// // console.log(jsf.generate(ADMIN_PARTNERS_ITEMS_POST_SCHEMA));

// const schema = buildYup(ADMIN_PARTNERS_ITEMS_POST_SCHEMA, CONFIG);

// const myData = {
//   partner_sku: "est",
//   price: "300",
//   price_incl_tax: "1111",
//   partner: 52930675,
//   variant: 29446430,
//   shipping_incl_tax: "",
//   shipping_excl_tax: "",
//   amount: "",
//   amount_incl_tax: "",
//   minimum_order_weight: 33026031.690581758,
//   maximum_order_weight: 88583838.4595711,
//   minimum_order_price: "888.2",
//   maximum_order_price: "999.2",
//   date_end: "2023-05-27T15:06:31.079128+07:00",
//   date_start: "2023-05-26T15:06:31.079128+07:00",
// };

// const test = object({});

// const test2 = yupResolver(schema);

// test2(myData).then((el) => {
//   console.log(el);
// });

// schema
//   .validate(myData)
//   .then((value) => {
//     console.log("🚀 ~ file: test.ts:70 ~ schema.validate ~ value:", value);
//   })
//   .catch((err) => {
//     console.log("🚀 ~ file: test.ts:73 ~ schema.validate ~ err:", err.errors);
//   });

const test = object().shape({
  // province: string().transform(function (value, originalValue) {
  //   if (!this.isType(value)) {
  //     return value[0];
  //   }
  //   return value;
  // }),

  num: number().required(),
  str: string()
    .nullable()
    .transform((value) => {
      console.log(typeof value);

      return value;
    }),

  dat: date().transform((value) => {
    return value;
  }),
});

// const dataSample = {
//   province: ["P_1", "Thành phố Hà Nội"],
//   customerType: {
//     id: 1,
//     name: "Văn Phòng",
//     description: "",
//     parent: null,
//     level: 0,
//     full_name: "Văn Phòng",
//   },
//   num: 0,
// };

// test.validate(dataSample).then((result) => {
//   console.log("🚀 ~ file: test.js:418 ~ test.validate ~ result:", result);
// });
