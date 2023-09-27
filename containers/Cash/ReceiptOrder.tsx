import { Row } from "react-table";
import React, { useState, Fragment, useEffect, useCallback, useMemo } from "react";

import { cloneDeep } from "lodash";
import { Box } from "@mui/material";

import { LoadingDynamic as Loading } from "components";
import ReceiptOrderTable from "./table/ReceiptOrderTable";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT } from "__generated__/END_POINT";

type Props = {
  id: number;
  onGotoHandler: (data: Row<any>) => void;
};

export type ReceiptOrderFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  order: number | undefined;
  nested_depth: number;
};

const defaultFilterValue: ReceiptOrderFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  order: undefined,
  nested_depth: 3,
};

export default function ReceiptOrder({ id, onGotoHandler }: Props) {
  const [filter, setFilter] = useState<ReceiptOrderFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch(
    transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT, {
      ...filter,
      order: id,
    })
  );

  useEffect(() => {
    if (id) {
      changeKey(
        transformUrl(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
          {
            ...defaultFilterValue,
            order: id,
          }
        )
      );
    }
  }, [id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
            {
              ...defaultFilterValue,
              order: id,
            }
          )
        );
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (data == undefined) return <Loading />;

  return (
    <Fragment>
      <ReceiptOrderTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        onGotoHandler={onGotoHandler}
        // maxHeight={300}
      />

      <Box padding="10px" />
    </Fragment>
  );
}
