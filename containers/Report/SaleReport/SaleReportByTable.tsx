import useSWR from "swr";
import { Row } from "react-table";
import { parseISO } from "date-fns";
import { Box, Stack } from "@mui/material";
import { useMeasure, useUpdateEffect } from "react-use";
import { useCallback, Fragment, useState, useMemo, useEffect } from "react";

import get from "lodash/get";
import Column from "./Column";
import dynamic from "next/dynamic";

import { transformUrl } from "libs";
import { useFetch, useLayout } from "hooks";
import { RevenueReport } from "__generated__/apiType_v1";
import { BackButton, LoadingDynamic as Loading, WrapperTable } from "components";
import { ADMIN_REPORTS_REVENUE_END_POINT } from "__generated__/END_POINT";

/* eslint react/jsx-key: off */

const ListingInvoice = dynamic(() => import("./ListingInvoice"), {
  loading: Loading,
});

interface SaleReportByTableProps {
  filter: Record<string, any>;
  viewType: "time" | "profit" | "discount";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

type TView = "general" | "listingInvoice";

export const SaleReportByTable = (props: SaleReportByTableProps) => {
  const {
    filter,
    isPrinting,
    onIsDoneHandler,
    viewType: _viewType,
    onPageSizeChange,
    onPageChange,
  } = props;

  const { state: layoutState } = useLayout();
  const [ref, { height }] = useMeasure();

  const [reload, setReload] = useState(false);

  const [viewType, setViewType] = useState<TView>("general");

  const { data } = useSWR(
    transformUrl(ADMIN_REPORTS_REVENUE_END_POINT, {
      ...filter,
      with_sum_net_revenue_incl_tax: true,
      with_sum_revenue_incl_tax: true,
      with_sum_base_amount_incl_tax: true,
      with_sum_invoice_count: true,
    })
  );

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<RevenueReport>(transformUrl(ADMIN_REPORTS_REVENUE_END_POINT, filter));

  useEffect(() => {
    changeKey(transformUrl(ADMIN_REPORTS_REVENUE_END_POINT, filter));
  }, [filter]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    timer = setTimeout(() => {
      setReload(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [props.viewType]);

  const onViewDetailHandler = useCallback((row: Row<RevenueReport>) => {
    const dateStart = get(row, "original.date_start");

    const milliseconds = parseISO(dateStart).getTime();

    setViewType("listingInvoice");
  }, []);

  const onBackToGeneralHandler = useCallback(() => {
    setViewType("general");
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (reload) return <Loading />;

  if (viewType === "general") {
    if (data == undefined) return <Loading />;

    return (
      <Fragment>
        <Box ref={ref}>
          <WrapperTable>
            <Column
              type={_viewType}
              count={itemCount}
              isLoading={isLoading}
              data={dataTable ?? []}
              dataTotal={[data] ?? []}
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              onViewDetailHandler={onViewDetailHandler}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 80}
            />
          </WrapperTable>
        </Box>
      </Fragment>
    );
  } else if (viewType === "listingInvoice") {
    return (
      <Stack spacing={2}>
        <Box displayPrint="none">
          <BackButton
            onClick={onBackToGeneralHandler}
            sx={{
              alignSelf: "flex-start",
            }}
          />
        </Box>

        <ListingInvoice
          filter={filter}
          viewType={props.viewType}
          isPrinting={isPrinting}
          onIsDoneHandler={onIsDoneHandler}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Stack>
    );
  }

  return null;
};
