import pick from "lodash/pick";
import { AxiosRequestConfig } from "axios";

import axios from "axios.config";

import { transformUrl } from "libs";
import { CHOICE_CONVERT_DIVISION } from "apis";
import { ProvinceTuple, DistrictTuple, WardTuple } from "interfaces";

interface ProvinceDistrictWardProps {
  ward: WardTuple;
  district: DistrictTuple;
  province: ProvinceTuple;
}

export const convertValueToTupleForAddress = async <
  T extends { province: string; district?: string; ward?: string }
>(
  data: T,
  options?: AxiosRequestConfig
): Promise<ProvinceDistrictWardProps | undefined> => {
  const body = pick(data, ["province", "district", "ward"]);

  try {
    const { data: resData } = await axios.get<
      [ward: string, district: string, province: string]
    >(transformUrl(CHOICE_CONVERT_DIVISION, { ...body, country: "vn" }), options);

    let newObj: ProvinceDistrictWardProps = {} as ProvinceDistrictWardProps;

    newObj.ward = [body["ward"] ?? "", resData[0]];
    newObj.district = [body["district"] ?? "", resData[1]];
    newObj.province = [body["province"] ?? "", resData[2]];

    return newObj;
  } catch (err) {}
};
