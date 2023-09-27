import { Row } from "react-table";
import { cloneDeep } from "lodash";
import { Box } from "@mui/material";
import { useState, Fragment, useEffect, useCallback, useMemo } from "react";

import InvoiceTable from "./table/InvoiceTable";
import { LoadingDynamic as Loading } from "components";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";
import { ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT } from "__generated__/END_POINT";

type Props = {
  id: number;
  onGotoHandler: (data: Row<any>) => void;
};

export type InvoiceFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  invoice: number | undefined;
  nested_depth: number;
};

const defaultFilterValue: InvoiceFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  invoice: undefined,
  nested_depth: 3,
};

export default function Invoice({ id, onGotoHandler }: Props) {
  const [filter, setFilter] = useState<InvoiceFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch(
    transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
      ...filter,
      invoice: id,
    })
  );

  useEffect(() => {
    if (id) {
      changeKey(
        transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
          ...defaultFilterValue,
          invoice: id,
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
          transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
            ...defaultFilterValue,
            invoice: id,
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
      <InvoiceTable
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
