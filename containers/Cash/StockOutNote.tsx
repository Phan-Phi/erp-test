import { Row } from "react-table";
import React, { useState, Fragment, useEffect, useCallback, useMemo } from "react";

import { cloneDeep } from "lodash";
import { Box } from "@mui/material";

import { LoadingDynamic as Loading } from "components";
import StockOutNoteTable from "./table/StockOutNoteTable";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";
import { ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT } from "__generated__/END_POINT";

type Props = {
  id: number;
  onGotoHandler: (data: Row<any>) => void;
};

export type StockOutNoteFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  stock_out_note: number | undefined;
  nested_depth: number;
};

const defaultFilterValue: StockOutNoteFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  stock_out_note: undefined,
  nested_depth: 3,
};

export default function StockOutNote({ id, onGotoHandler }: Props) {
  const [filter, setFilter] = useState<StockOutNoteFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch(
    transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, {
      ...filter,
      stock_out_note: id,
    })
  );

  useEffect(() => {
    if (id) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, {
          ...defaultFilterValue,
          stock_out_note: id,
        })
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
          transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, {
            ...defaultFilterValue,
            stock_out_note: id,
          })
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
      <StockOutNoteTable
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
