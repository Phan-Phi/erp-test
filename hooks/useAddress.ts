import useSWR from "swr";
import { useMemo } from "react";

import { CHOICE_CONVERT_DIVISION } from "apis";

import { transformUrl } from "libs";

import pick from "lodash/pick";
import { DistrictTuple, ProvinceTuple, WardTuple } from "interfaces";

interface ProvinceDistrictWardProps {
  ward: WardTuple;
  district: DistrictTuple;
  province: ProvinceTuple;
}

type UseAddressProps = {
  province: string;
  district?: string;
  ward?: string;
};
export const useAddress = (
  data: UseAddressProps
): ProvinceDistrictWardProps | undefined => {
  const { data: addressData } = useSWR<
    [ward: string, district: string, province: string]
  >(() => {
    if (data?.province == undefined) {
      return;
    }

    const body = pick(data, ["province", "district", "ward"]);

    return transformUrl(CHOICE_CONVERT_DIVISION, {
      ...body,
      country: "vn",
    });
  });

  const memo = useMemo(() => {
    if (addressData == undefined) {
      return undefined;
    }

    let newObj: ProvinceDistrictWardProps = {} as ProvinceDistrictWardProps;

    newObj.ward = [data["ward"] ?? "", addressData[0]];
    newObj.district = [data["district"] ?? "", addressData[1]];
    newObj.province = [data["province"] ?? "", addressData[2]];

    return newObj;
  }, [data, addressData]);

  return memo;
};
