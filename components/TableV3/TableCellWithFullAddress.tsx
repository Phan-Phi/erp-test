import { useMountedState } from "react-use";
import React, { useEffect, useState } from "react";

import cloneDeep from "lodash/cloneDeep";

import { transformFullAddress } from "libs";

import WrapperTableCell from "./WrapperTableCell";

import { Skeleton } from "@mui/material";

interface TableCellWithFullAddress<T> {
  loading?: boolean;
  data: T;
}

const TableCellWithFullAddress = <
  T extends { address: string; province: string; district: string; ward: string },
>(
  props: TableCellWithFullAddress<T>
) => {
  const [fullAddress, setFullAddress] = useState<string>();

  const isMounted = useMountedState();

  const { data, loading } = props;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (data == undefined) {
      setFullAddress("NaN");
    } else {
      transformFullAddress(cloneDeep(data)).then((address) => {
        if (isMounted()) {
          setFullAddress(address);
        }
      });
    }
  }, [data, loading, isMounted]);

  if (fullAddress == undefined || loading) {
    return <Skeleton />;
  }

  return <WrapperTableCell title={`${fullAddress}`}>{`${fullAddress}`}</WrapperTableCell>;
};

export default TableCellWithFullAddress;
