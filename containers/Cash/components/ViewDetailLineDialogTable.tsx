import { Row } from "react-table";
import { Box } from "@mui/material";
import { useMeasure } from "react-use";
import { useMemo, useState } from "react";

import { useFetch } from "hooks";
import { SAFE_OFFSET } from "constant";
import ViewDetailLineTableItem from "./ViewDetailLineTableItem";

interface Props {
  url: string;
  onGotoHandler: (data: Row<any>) => void;
}

export type PartnerFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
};

const defaultFilterValue: PartnerFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",
};

export default function ViewDetailLineDialogTable({ url, onGotoHandler }: Props) {
  const [filter, setFilter] = useState(defaultFilterValue);
  const [ref, { height }] = useMeasure();

  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<any>(url);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const render = useMemo(() => {
    if (data == undefined) return null;
    return (
      <ViewDetailLineTableItem
        data={data ?? []}
        count={itemCount}
        isLoading={isLoading}
        pagination={pagination}
        maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
        onGotoHandler={onGotoHandler}
      />
    );
  }, [data]);
  return <Box ref={ref}>{render}</Box>;
}
