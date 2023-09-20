import { parseJSON, isValid, compareAsc } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  StringSchema,
  TestContext,
  object,
  string,
  number,
  mixed,
  array,
  TestConfig,
  boolean,
  NumberSchema,
  InferType,
} from "yup";
import { TransformFunction } from "yup/lib/types";

import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { MixedSchema } from "yup/lib/mixed";

function transformDecimal(value: any): TransformFunction<StringSchema> {
  return value === "" ? "0" : value;
}

function transformProvinceDistrictWard(value: any): TransformFunction<StringSchema> {
  if (!string().isType(value) && Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function transformObjectToId(value: any): TransformFunction<MixedSchema> {
  if (mixed().isType(value) && value != null && typeof value === "object") {
    return value.id;
  }

  return value;
}

const testPhoneNumber = {
  message: "Số điện thoại không hợp lệ",
  test(value: any) {
    if (!value) return false;

    const phoneNumber = parsePhoneNumber(value);

    if (!phoneNumber) return false;

    if (phoneNumber.country !== "VN") return false;

    if (!isValidPhoneNumber(phoneNumber.number)) return false;

    return true;
  },
};

const whenRequired = {
  is: true,
  then: (schema: StringSchema) => {
    return schema.required();
  },
};

const testFormat = (key: string, errMessage?: string): TestConfig => {
  return {
    message: "Không đúng định dạng",
    test: (value: any, context: TestContext) => {
      const { parent, createError } = context;
      const comparedPrice = parent[key] as string;
      const parsedComparedPrice = parseFloat(comparedPrice);
      const parsedPriceIncludeTax = parseFloat(value);
      if (isNaN(parsedComparedPrice) || isNaN(parsedPriceIncludeTax)) {
        if (errMessage)
          return createError({
            message: errMessage,
          });

        return false;
      }
      return true;
    },
  };
};

const testCompareValue = (key: string, errMessage?: string): TestConfig => {
  return {
    message: "Giá có thuế phải lớn hơn hoặc bằng giá chưa thuế",
    test: (value: any, context: TestContext) => {
      const { parent, createError } = context;

      const comparedPrice = parent[key] as string;

      const parsedComparedPrice = parseFloat(comparedPrice);
      const parsedPriceIncludeTax = parseFloat(value);

      if (parsedPriceIncludeTax < parsedComparedPrice) {
        if (errMessage)
          return createError({
            message: errMessage,
          });

        return false;
      }

      return true;
    },
  };
};

const testFormatDate: TestConfig = {
  test(value: any, context: TestContext) {
    const date = parseJSON(new Date(value));

    if (!isValid(date)) return false;

    return true;
  },
  message: "Không đúng định dạng",
};

const testCompareDate = (key: string, errMessage?: string): TestConfig => {
  return {
    test(value: any, context: TestContext) {
      const { parent, createError } = context;

      const dateStart = parseJSON(parent[key] ?? "");
      const dateEnd = value;

      if (dateEnd == null) return true;

      if (compareAsc(parseJSON(dateEnd).getTime(), parseJSON(dateStart).getTime()) >= 0) {
        return true;
      } else {
        return createError({
          message: "Ngày kết thúc phải sau ngày bắt đầu",
        });
      }
    },
    message: "Ngày kết thúc phải sau ngày bắt đầu",
  };
};
