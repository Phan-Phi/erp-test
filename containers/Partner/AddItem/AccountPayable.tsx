import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Stack } from "@mui/material";

import { cloneDeep } from "lodash";

import { SearchField } from "components";
import AccountPayableTab from "./table/AccountPayableTab";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";
import { ADMIN_CASH_DEBT_RECORDS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type AccountPayableFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  creditor_type: string;
  creditor_id: string | undefined;
  search: string;
};

const defaultFilterValue: AccountPayableFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  creditor_type: "partner.partner",
  creditor_id: undefined,
  search: "",
};

const AccountPayable = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<AccountPayableFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1>(
      transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
        ...filter,
        creditor_id: router.query.id,
      })
    );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
          ...defaultFilterValue,
          creditor_id: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
            ...cloneFilter,
            creditor_id: router.query.id,
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
    <Stack spacing={2}>
      <SearchField
        initSearch={filter.search}
        onChange={onFilterChangeHandler("search")}
      />

      <AccountPayableTab
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
