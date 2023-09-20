import { transformUrl } from "../libs";
import { CHOICE_CONVERT_DIVISION } from "../apis";

import axios from "../axios.config";

const convertAddress = async (params, options = {}) => {
  try {
    if (!params?.province) {
      return {};
    }

    const { data: addressData } = await axios.get(
      transformUrl(CHOICE_CONVERT_DIVISION, { ...params, country: "vn" }),
      options
    );

    const { ward, district, province } = params;

    return {
      ward: [ward, addressData[0]],
      district: [district, addressData[1]],
      province: [province, addressData[2]],
    };
  } catch (err) {}
};

export default convertAddress;
