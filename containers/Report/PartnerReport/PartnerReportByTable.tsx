import useSWR from "swr";
import { Row } from "react-table";
import { Box, Stack } from "@mui/material";
import { useMeasure, useUpdateEffect } from "react-use";
import { useCallback, Fragment, useState, useMemo, useEffect } from "react";

import get from "lodash/get";
import Column from "./Column";
import dynamic from "next/dynamic";

import { transformUrl } from "libs";
import { useFetch, useLayout } from "hooks";
import { BackButton, LoadingDynamic as Loading } from "components";

import {
  ADMIN_REPORTS_PARTNER_WITH_DEBT_AMOUNT_END_POINT,
  ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT,
} from "__generated__/END_POINT";
import { PartnerWithPurchaseAmountReport } from "__generated__/apiType_v1";

const ListingInvoice = dynamic(() => import("./ListingInvoice"), {
  loading: Loading,
});

interface PartnerReportByTableProps {
  filter: Record<string, any>;
  viewType: "import" | "debt";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

type TView = "general" | "listingInvoice";

export const PartnerReportByTable = (props: PartnerReportByTableProps) => {
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

  const [partner, setPartner] = useState<PartnerWithPurchaseAmountReport>();

  const [viewType, setViewType] = useState<TView>("general");

  const { data } = useSWR(() => {
    if (props.viewType === "import") {
      return transformUrl(ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT, {
        ...filter,
        page_size: 1,
        with_sum_purchase_amount_incl_tax: true,
        with_sum_return_amount_incl_tax: true,
      });
    }
  });

  const { data: partnerWithDebtRecordData } = useSWR(() => {
    if (props.viewType === "debt") {
      return transformUrl(ADMIN_REPORTS_PARTNER_WITH_DEBT_AMOUNT_END_POINT, {
        ...filter,
        page_size: 1,
        with_sum_beginning_debt_amount: true,
        with_sum_credit: true,
        with_sum_debit: true,
      });
    }
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<PartnerWithPurchaseAmountReport>(
    transformUrl(ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT, filter)
  );

  useEffect(() => {
    if (_viewType === "import") {
      changeKey(
        transformUrl(ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT, filter)
      );
    }
    if (_viewType === "debt") {
      changeKey(transformUrl(ADMIN_REPORTS_PARTNER_WITH_DEBT_AMOUNT_END_POINT, filter));
    }
  }, [filter, _viewType]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    onBackToGeneralHandler();

    timer = setTimeout(() => {
      setReload(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [props.viewType]);

  const onViewDetailHandler = useCallback((row: Row<PartnerWithPurchaseAmountReport>) => {
    const partner = get(row, "original");
    setPartner(partner);
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
    let component: React.ReactNode = null;

    if (props.viewType === "import") {
      if (data == undefined && dataTable == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Fragment>
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
          </Fragment>
        );
      }
    } else if (props.viewType === "debt") {
      if (partnerWithDebtRecordData == undefined && dataTable == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Fragment>
            <Column
              onViewDetailHandler={onViewDetailHandler}
              type={_viewType}
              count={itemCount}
              isLoading={isLoading}
              data={dataTable ?? []}
              // dataTotal={[partnerWithDebtRecordData] ?? []}
              dataTotal={partnerWithDebtRecordData ? [partnerWithDebtRecordData] : []}
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
            />
          </Fragment>
        );
      }
    }

    return (
      <Fragment>
        <Box
          display={isPrinting ? "none" : "block"}
          // displayPrint="none"
        >
          {component}
        </Box>
      </Fragment>
    );
  } else if (viewType === "listingInvoice" && partner) {
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
          partner={partner}
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
