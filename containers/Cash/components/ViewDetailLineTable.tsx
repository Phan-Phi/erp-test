import React, { Fragment, useCallback, useMemo, useRef, useState } from "react";
import OrderLineMemoColumn from "../column/OrderLineMemoColumn";
import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";
import { WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER } from "apis";
import { cloneDeep } from "lodash";
import { Loading } from "components";
import { Row } from "react-table";

interface Props {
  id: any;
  url: string;
  viewType: string;
  onGotoHandler: (data: Row<any>) => void;
}

export type OrderLineMemoFilterType = {
  with_count: boolean;
  page: number;
  page_size: number;
};

const defaultFilterValue: OrderLineMemoFilterType = {
  with_count: true,
  page: 1,
  page_size: 25,
};

export default function ViewDetailLineTable({ id, url, viewType, onGotoHandler }: Props) {
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<any>(
    transformUrl(url, {
      ...filter,
      invoice: id,
      nested_depth: 3,
    })
  );

  const tableInstance = useRef<any>();

  const passHandler = useCallback((_tableInstance: any) => {
    tableInstance.current = _tableInstance;
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        const params = cloneDeep(cloneFilter);
        changeKey(
          transformUrl(url, {
            ...params,
            invoice: id,
            nested_depth: 3,
          })
        );
      };
    },
    [filter, url, id]
  );
  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const renderTable = useMemo(() => {
    if (data == undefined) return null;

    return (
      <OrderLineMemoColumn
        data={data ?? []}
        count={itemCount}
        passHandler={passHandler}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        onGotoHandler={onGotoHandler}
      />
    );
  }, [data]);

  // return <Fragment>{renderTable}</Fragment>;

  if (viewType === "stock.receiptorder") {
    if (data == undefined) return <Loading />;
    return (
      <OrderLineMemoColumn
        type={viewType}
        data={data ? data : []}
        count={itemCount}
        passHandler={passHandler}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        onGotoHandler={onGotoHandler}
      />
    );
  } else if (viewType === "stock.stockoutnote") {
    if (data == undefined) return <Loading />;
    return (
      <OrderLineMemoColumn
        type={viewType}
        data={data ? data : []}
        count={itemCount}
        passHandler={passHandler}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
      />
    );
  } else if (viewType === "order.invoice") {
    if (data == undefined) return <Loading />;
    return (
      <OrderLineMemoColumn
        type={viewType}
        data={data ? data : []}
        count={itemCount}
        passHandler={passHandler}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        onGotoHandler={onGotoHandler}
      />
    );
  }

  return null;
}
