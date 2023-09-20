import { cloneDeep } from "lodash";
import { Stack } from "@mui/material";
import { useContext, useCallback, useState, useEffect, useMemo } from "react";

import { SearchField } from "components";
import AccountPayableTable from "./AccountPayableTable";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";
import { Context as CustomerContext } from "./context";
import { ADMIN_CASH_DEBT_RECORDS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type AccountPayableFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search?: string;
  creditor_type: string;
  creditor_id: number | undefined;
};

const defaultFilterValue: AccountPayableFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  creditor_type: "customer.customer",
  creditor_id: undefined,
};

const AccountPayable = () => {
  const context = useContext(CustomerContext);

  const [filter, setFilter] = useState<AccountPayableFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1>(
      transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
        ...filter,
        creditor_id: context.state.id,
      })
    );

  useEffect(() => {
    changeKey(
      transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
        ...filter,
        creditor_id: context.state.id,
      })
    );
  }, [context.state.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
            ...cloneFilter,
            creditor_id: context.state.id,
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

  return (
    <Stack spacing={3}>
      <SearchField
        initSearch={filter.search}
        onChange={onFilterChangeHandler("search")}
      />

      <AccountPayableTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        maxHeight={300}
      />
    </Stack>
  );
};

export default AccountPayable;
