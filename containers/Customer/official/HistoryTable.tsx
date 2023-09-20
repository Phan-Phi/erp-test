import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useState, useContext, useEffect, useCallback, useMemo } from "react";

import { cloneDeep } from "lodash";
import { Stack } from "@mui/material";

import { useFetch } from "hooks";

import { SearchField } from "components";
import InvoiceTable from "./InvoiceTable";

import { setFilterValue, transformUrl } from "libs";
import { Context as CustomerContext } from "./context";
import ViewDetailLineDialog from "./ViewDetailLineDialog";

interface OrderHistoryTabProps {
  noteUrl: string;
  noteLineUrl: string;
}

export type OrderHistoryTabFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search?: string;
  receiver: number | undefined;
};

const defaultFilterValue: OrderHistoryTabFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  receiver: undefined,
};

const OrderHistoryTab = ({ noteUrl, noteLineUrl }: OrderHistoryTabProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);
  const context = useContext(CustomerContext);

  const [selectedNote, setSeletedNote] = useState<number>();
  const [filter, setFilter] = useState<OrderHistoryTabFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch(
    transformUrl(noteUrl, {
      ...filter,
      receiver: context.state.id,
    })
  );

  useEffect(() => {
    if (context.state.id) {
      changeKey(
        transformUrl(noteUrl, {
          ...filter,
          receiver: context.state.id,
        })
      );
    }
  }, [context.state.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(noteUrl, {
            ...cloneFilter,
            receiver: context.state.id,
            parent: router.query.id,
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
    setSeletedNote(row.original.id);
    toggle(true);
  }, []);

  return (
    <Stack spacing={3}>
      <SearchField
        initSearch={filter.search}
        onChange={onFilterChangeHandler("search")}
      />

      <InvoiceTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        messages={messages}
        onViewNoteHandler={onViewNoteHandler}
        maxHeight={300}
      />

      <ViewDetailLineDialog
        {...{
          open,
          toggle,
          url: transformUrl(noteLineUrl, {
            invoice: selectedNote,
          }),
        }}
      />
    </Stack>
  );
};

export default OrderHistoryTab;
