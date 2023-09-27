import useSWR from "swr";
import { Box } from "@mui/material";
import { Fragment, useMemo } from "react";

import { useFetch } from "hooks";
import { useIntl } from "react-intl";
import { transformUrl } from "libs";
import { Loading } from "components";
import { PartnerWithPurchaseAmountReport } from "__generated__/apiType_v1";

import ColumnDetail from "./ColumnDetail";

import {
  CASH_DEBT_RECORD_ITEM,
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM,
} from "interfaces";

import {
  ADMIN_CASH_DEBT_RECORDS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
} from "__generated__/END_POINT";

interface ListingInvoiceProps {
  filter: Record<string, any>;
  viewType: "import" | "debt";
  partner: PartnerWithPurchaseAmountReport;
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

const ListingInvoice = (props: ListingInvoiceProps) => {
  const {
    partner,
    filter,
    viewType,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { messages } = useIntl();

  const { data } = useSWR(() => {
    if (viewType === "import") {
      return transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT, {
        date_created_start: filter.date_start,
        date_created_end: filter.date_end,
        statuses: "Confirmed,Partial_paid,Paid,Over_paid",
        partner: partner.id,
        page_size: 1,
      });
    }
  });

  const { data: debtRecordData } = useSWR(() => {
    if (viewType === "debt") {
      return transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
        creditor_id: partner.id,
        date_created_start: filter.date_start,
        date_created_end: filter.date_end,
        creditor_type: "partner.partner",
        page_size: 1,
      });
    }
  });

  const {
    data: dataWarehouse,
    isLoading,
    itemCount,
  } = useFetch<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM>(
    transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT, {
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      statuses: "Confirmed,Partial_paid,Paid,Over_paid",
      partner: partner.id,
    })
  );

  const {
    data: dataCashDebt,
    isLoading: isLoadingCashDebt,
    itemCount: itemCountCashDebt,
    changeKey: changeKeyCashDebt,
  } = useFetch<CASH_DEBT_RECORD_ITEM>(
    transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
      creditor_id: partner.id,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      creditor_type: "partner.partner",
    })
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  let component: React.ReactNode = null;

  if (viewType === "import") {
    component = (
      <Fragment>
        <ColumnDetail
          partner={partner}
          filter={filter}
          type={viewType}
          count={itemCount}
          isLoading={isLoading}
          // data={dataTable ?? []}
          data={dataWarehouse ? dataWarehouse : []}
          dataTotal={data ? [data] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
        />
      </Fragment>
    );
  }

  if (viewType === "debt") {
    if (debtRecordData == undefined && dataCashDebt == undefined) {
      component = <Loading />;
    } else {
      component = (
        <Fragment>
          <ColumnDetail
            partner={partner}
            filter={filter}
            type={viewType}
            count={itemCountCashDebt}
            isLoading={isLoadingCashDebt}
            // data={dataTable ?? []}
            data={dataCashDebt ? dataCashDebt : []}
            dataTotal={debtRecordData ? [debtRecordData] : []}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
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
};

export default ListingInvoice;
