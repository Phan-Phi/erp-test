import React, { useEffect, useState } from "react";

import { Skeleton } from "@mui/material";

import { useAddress } from "hooks";

import WrapperTableCell from "./WrapperTableCell";

interface TableCellWithFullAddress<T> {
  loading?: boolean;
  data: T;
}

const TableCellWithFullAddress = <
  T extends { address: string; province: string; district: string; ward: string }
>(
  props: TableCellWithFullAddress<T>
) => {
  const [fullAddress, setFullAddress] = useState<string>();

  const { data, loading } = props;

  const transformedAddress = useAddress(data);

  useEffect(() => {
    if (transformedAddress == undefined) {
      return;
    }

    const { province, district, ward } = transformedAddress;

    const [, displayProvince] = province;
    const [, displayDistrict] = district;
    const [, displayWard] = ward;

    setFullAddress(
      `${data.address}, ${displayWard}, ${displayDistrict}, ${displayProvince}`
    );
  }, [transformedAddress]);

  if (fullAddress == undefined || loading) {
    return <Skeleton />;
  }

  return <WrapperTableCell title={fullAddress}>{`${fullAddress}`}</WrapperTableCell>;
};

export default TableCellWithFullAddress;
