import useSWR from "swr";
import { Row } from "react-table";
import { Box, Stack } from "@mui/material";
import { useUpdateEffect } from "react-use";
import { useCallback, Fragment, useState, useMemo, useEffect } from "react";

import get from "lodash/get";
import Column from "./Column";
import dynamic from "next/dynamic";

import { useFetch } from "hooks";
import { transformUrl } from "libs";
import { REPORT_CUSTOMER_WITH_REVENUE_ITEM } from "interfaces";
import { BackButton, LoadingDynamic as Loading } from "components";
import { REPORT_CUSTOMER_WITH_REVENUE, REPORT_CUSTOMER_WITH_DEBT_AMOUNT } from "apis";

const ListingInvoice = dynamic(() => import("./ListingInvoice"), {
  loading: Loading,
});

interface SaleReportByTableProps {
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "debt";
  isPrinting: boolean;
  onPageChange: any;
  onPageSizeChange: any;
  onIsDoneHandler: () => void;
}

type ViewType = "general" | "listingInvoice";

export const CustomerReportByTable = (props: SaleReportByTableProps) => {
  const {
    filter,
    isPrinting,
    onIsDoneHandler,
    viewType: _viewType,
    onPageSizeChange,
    onPageChange,
  } = props;

  const [reload, setReload] = useState(false);

  const [receiver, setReceiver] = useState<number>();
  const [beginningDebtAmount, setBeginningDebtAmount] = useState<number>();

  const [viewType, setViewType] = useState<ViewType>("general");

  const { data } = useSWR(() => {
    if (props.viewType === "profit" || props.viewType === "sale") {
      return transformUrl(REPORT_CUSTOMER_WITH_REVENUE, {
        ...filter,
        with_sum_net_revenue_incl_tax: true,
        with_sum_revenue_incl_tax: true,
        with_sum_base_amount_incl_tax: true,
        page_size: 1,
      });
    }
  });

  const { data: customerWithDebtAmountdata } = useSWR(() => {
    if (props.viewType === "debt") {
      return transformUrl(REPORT_CUSTOMER_WITH_DEBT_AMOUNT, {
        ...filter,
        with_sum_credit: true,
        with_sum_debit: true,
        with_sum_beginning_debt_amount: true,
        page_size: 1,
      });
    }
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<any>(transformUrl(REPORT_CUSTOMER_WITH_REVENUE, filter));

  useEffect(() => {
    if (_viewType === "sale" || _viewType === "profit") {
      changeKey(transformUrl(REPORT_CUSTOMER_WITH_REVENUE, filter));
    }

    if (_viewType === "debt") {
      changeKey(transformUrl(REPORT_CUSTOMER_WITH_DEBT_AMOUNT, filter));
    }
  }, [filter, _viewType]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    setViewType("general");
    setReceiver(undefined);
    setBeginningDebtAmount(undefined);

    timer = setTimeout(() => {
      setReload(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [props.viewType]);

  const onViewDetailHandler = useCallback(
    (row: Row<REPORT_CUSTOMER_WITH_REVENUE_ITEM>) => {
      const receiverId = row.original.id;

      const beginningDebtAmount = parseFloat(
        get(row, "original.beginning_debt_amount.incl_tax")
      );

      setBeginningDebtAmount(beginningDebtAmount);

      setReceiver(receiverId);

      setViewType("listingInvoice");
    },
    []
  );

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
    let component: React.ReactNode = null;

    if (props.viewType === "sale" || props.viewType === "profit") {
      if (data == undefined && dataTable == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Column
            type={_viewType}
            count={itemCount}
            isLoading={isLoading}
            data={dataTable ?? []}
            // dataTotal={[data] ?? []}
            dataTotal={data ? [data] : []}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onViewDetailHandler={onViewDetailHandler}
          />
        );
      }
    } else if (props.viewType === "debt") {
      if (customerWithDebtAmountdata == undefined && dataTable == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Column
            type={_viewType}
            count={itemCount}
            isLoading={isLoading}
            data={dataTable ?? []}
            dataTotal={customerWithDebtAmountdata ? [customerWithDebtAmountdata] : []}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onViewDetailHandler={onViewDetailHandler}
            // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
          />
        );
      }
    }

    return (
      <Fragment>
        <Box display={isPrinting ? "none" : "block"}>{component}</Box>
      </Fragment>
    );
  } else if (
    viewType === "listingInvoice" &&
    receiver != undefined &&
    beginningDebtAmount != undefined
  ) {
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
          receiver={receiver}
          viewType={props.viewType}
          beginningDebtAmount={beginningDebtAmount}
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
