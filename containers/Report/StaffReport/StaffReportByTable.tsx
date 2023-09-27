import useSWR from "swr";
import { Row } from "react-table";
import { Stack, Box } from "@mui/material";
import { useMeasure, useUpdateEffect } from "react-use";
import { useCallback, useState, Fragment, useMemo, useEffect } from "react";

import { transformUrl } from "libs";
import { useFetch, useLayout } from "hooks";
import { ListingInvoice } from "./ListingInvoice";
import { BackButton, LoadingDynamic as Loading } from "components";
import { CustomerWithRevenueReport } from "__generated__/apiType_v1";
import { ADMIN_REPORTS_STAFF_WITH_REVENUE_END_POINT } from "__generated__/END_POINT";

import Column from "./Column";

type TView = "general" | "listingByTime";

export const StaffReportByTable = (props: any) => {
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

  const [owner, setOwner] = useState<number>();

  const { data } = useSWR(
    transformUrl(ADMIN_REPORTS_STAFF_WITH_REVENUE_END_POINT, {
      ...filter,
      with_sum_revenue_incl_tax: true,
      with_sum_base_amount_incl_tax: true,
      with_sum_net_revenue_incl_tax: true,
    })
  );

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<CustomerWithRevenueReport>(
    transformUrl(ADMIN_REPORTS_STAFF_WITH_REVENUE_END_POINT, filter)
  );
  const [viewType, setViewType] = useState<TView>("general");

  useEffect(() => {
    changeKey(transformUrl(ADMIN_REPORTS_STAFF_WITH_REVENUE_END_POINT, filter));
  }, [filter]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    setViewType("general");
    setOwner(undefined);

    timer = setTimeout(() => {
      setReload(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [props.viewType]);

  const onBackToGeneralHandler = useCallback(() => {
    setViewType("general");
  }, []);

  const onViewDetailHandler = useCallback((row: Row<CustomerWithRevenueReport>) => {
    const id = row.original.id;

    setOwner(id);

    setViewType("listingByTime");
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (reload) return <Loading />;

  if (viewType === "general") {
    let component: React.ReactNode = null;

    if (data == undefined) {
      component = <Loading />;
    } else {
      component = (
        <Column
          onViewDetailHandler={onViewDetailHandler}
          type={_viewType}
          count={itemCount}
          isLoading={isLoading}
          data={dataTable ?? []}
          dataTotal={data ? [data] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
        />
      );
    }

    return (
      <Fragment>
        <Box display={isPrinting ? "none" : "block"}>{component}</Box>
      </Fragment>
    );
  } else if (viewType === "listingByTime" && owner) {
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
          owner={owner}
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
