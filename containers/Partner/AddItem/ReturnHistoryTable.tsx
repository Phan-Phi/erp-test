import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep } from "lodash";
import { Stack } from "@mui/material";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";
import ReturnOrderTabTable from "./table/ReturnOrderTabTable";
import { SearchField, LoadingDynamic as Loading } from "components";

const ViewDetailLineDialogOfReturn = dynamic(
  () => import("./ViewDetailLineDialogOfReturn"),
  {
    loading: () => <Loading />,
  }
);

interface OrderHistoryTabProps {
  noteUrl: string;
  noteLineUrl: string;
}

export type OrderHistoryTabFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  partner: string | undefined;
  search: string;
};

const defaultFilterValue: OrderHistoryTabFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  partner: undefined,
  search: "",
};

const ReturnHistoryTable = ({ noteUrl, noteLineUrl }: OrderHistoryTabProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);
  const [selectedNote, setSelectedNote] = useState<number>();

  const [filter, setFilter] = useState<OrderHistoryTabFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch(
    transformUrl(noteUrl, {
      ...filter,
      partner: router.query.id,
    })
  );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(noteUrl, {
          ...defaultFilterValue,
          partner: router.query.id,
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
          transformUrl(noteUrl, {
            ...cloneFilter,
            partner: router.query.id,
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

  const onViewNoteHandler = useCallback((row: Row<any>) => {
    setSelectedNote(row.original.id);
    toggle(true);
  }, []);

  if (data == undefined) return <Loading />;

  return (
    <Stack spacing={3}>
      <SearchField
        initSearch={filter.search}
        onChange={onFilterChangeHandler("search")}
      />

      <ReturnOrderTabTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        maxHeight={300}
        messages={messages}
        onViewNoteHandler={onViewNoteHandler}
      />

      {open && (
        <ViewDetailLineDialogOfReturn
          {...{
            open,
            toggle,
            url: transformUrl(noteLineUrl, {
              order: selectedNote,
            }),
          }}
        />
      )}
    </Stack>
  );
};

export default ReturnHistoryTable;
