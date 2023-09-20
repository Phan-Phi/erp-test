import get from "lodash/get";
import { string, date } from "yup";

import { compareAsc } from "date-fns";

import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";

export const validatePhoneNumber = () => {
  return string().test({
    test: (value) => {
      if (value) {
        const phoneNumber = parsePhoneNumber(value);

        if (phoneNumber) {
          if (phoneNumber.country !== "VN") {
            return false;
          }
          if (isValidPhoneNumber(phoneNumber.number)) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    message: "Số điện thoại không hợp lệ",
    name: "validate",
  });
};

export const validatePriceIncludeTax = (compareKey) => {
  return string()
    .nullable()
    .when(compareKey, {
      is: true,
      then: (schema) => {
        return schema.required();
      },
    })
    .test({
      name: "validate",
      test: (value, context) => {
        const price = get(context, `parent.${compareKey}`);

        const parsedPrice = parseFloat(price);
        const parsedPriceIncludeTax = parseFloat(value);

        if (isNaN(parsedPrice)) {
          return true;
        }

        if (isNaN(parsedPrice) && parsedPriceIncludeTax) {
          return true;
        }

        if (parsedPrice && isNaN(parsedPriceIncludeTax)) {
          return false;
        }

        if (parsedPriceIncludeTax < parsedPrice) {
          return false;
        }

        return true;
      },
      message: "Giá có thuế phải lớn hơn hoặc bằng giá chưa thuế",
    });
};

export const validateWeight = (compareKey) => {
  return string()
    .nullable()
    .when(compareKey, {
      is: true,
      then: (schema) => {
        return schema.required();
      },
    })
    .transform(function (value) {
      return value === "" ? "0" : value;
    })
    .test({
      name: "validate",
      test: (value, context) => {
        const weight = get(context, `parent.${compareKey}`);

        const parsedWeight = parseFloat(weight);
        const parsedMaximumWeight = parseFloat(value);

        if (isNaN(parsedWeight)) {
          return true;
        }

        if (isNaN(parsedWeight) && parsedMaximumWeight) {
          return true;
        }

        if (parsedWeight && isNaN(parsedMaximumWeight)) {
          return false;
        }

        if (parsedMaximumWeight < parsedWeight) {
          return false;
        }

        return true;
      },
      message: "Khối lượng tối đa phải lớn hơn hoặc bằng khối lượng tối thiểu",
    });
};

export const transformNumberNotEmpty = () => {
  return string().transform(function (value) {
    return value === "" ? "0" : value;
  });
};

export const validateDateEnd = (compareKey) => {
  return date()
    .nullable()
    .test({
      name: "validate",
      test: (value, context) => {
        const dateStart = get(context, `parent.${compareKey}`);
        const dateEnd = value;

        if (dateEnd == null) {
          return true;
        }

        if (compareAsc(dateEnd, dateStart) >= 0) {
          return true;
        } else {
          return false;
        }
      },
      message: "Ngày kết thúc phải sau ngày bắt đầu",
    });
};
