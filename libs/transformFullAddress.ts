import { convertValueToTupleForAddress } from "./convertValueToTupleForAddress";

export const transformFullAddress = async <
  T extends { address: string; province: string; district?: string; ward?: string }
>(
  data: T
): Promise<string> => {
  const { address } = data;

  return convertValueToTupleForAddress(data).then((resData) => {
    if (resData) {
      const { province, district, ward } = resData;

      const [, displayProvince] = province;
      const [, displayDistrict] = district;
      const [, displayWard] = ward;

      return `${address}, ${displayWard}, ${displayDistrict}, ${displayProvince}`;
    }

    return address;
  });
};
