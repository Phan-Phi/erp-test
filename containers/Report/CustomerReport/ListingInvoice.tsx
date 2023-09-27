import useSWR from "swr";
import { Box } from "@mui/material";
import { Fragment, useMemo } from "react";

import { useFetch } from "hooks";
import { transformUrl } from "libs";
import { ORDER_INVOICE, CASH_DEBT_RECORD } from "apis";
import { ORDER_INVOICE_ITEM, CASH_DEBT_RECORD_ITEM } from "interfaces";

import ColumnDetail from "./ColumnDetail";

interface ListingInvoiceProps {
  receiver: number;
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "debt";
  beginningDebtAmount: number;
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

/* eslint react/jsx-key: off */

const ListingInvoice = (props: ListingInvoiceProps) => {
  const {
    filter,
    viewType,
    receiver,
    beginningDebtAmount,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { data } = useSWR(() => {
    if (viewType === "profit") {
      return transformUrl(ORDER_INVOICE, {
        receiver,
        date_created_start: filter.date_start,
        date_created_end: filter.date_end,
        shipping_status: "Delivered",
        with_sum_amount_before_discounts_incl_tax: true,
        with_sum_base_amount_incl_tax: true,
        with_sum_amount_incl_tax: true,
      });
    }
  });

  const { data: debtRecordData } = useSWR(() => {
    if (viewType === "debt") {
      return transformUrl(CASH_DEBT_RECORD, {
        creditor_id: receiver,
        date_created_start: filter.date_start,
        date_created_end: filter.date_end,
        creditor_type: "customer.customer",
        page_size: 1,
      });
    }
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
  } = useFetch<ORDER_INVOICE_ITEM>(
    transformUrl(ORDER_INVOICE, {
      receiver,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
      with_sum_amount_before_discounts_incl_tax: true,
    })
  );
  const {
    data: dataTableDebt,
    isLoading: isLoadingDebt,
    itemCount: itemCountDebt,
  } = useFetch<CASH_DEBT_RECORD_ITEM>(
    transformUrl(CASH_DEBT_RECORD, {
      creditor_id: receiver,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      creditor_type: "customer.customer",
    })
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  let component: React.ReactNode = null;

  if (viewType === "sale") {
    component = (
      <Fragment>
        <ColumnDetail
          filter={filter}
          type={viewType}
          count={itemCount}
          isLoading={isLoading}
          data={dataTable ? dataTable : []}
          dataInvoice={data ? [data] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
        />
      </Fragment>
    );
  } else if (viewType === "debt") {
    component = (
      <Fragment>
        <ColumnDetail
          filter={filter}
          type={viewType}
          count={itemCountDebt}
          isLoading={isLoadingDebt}
          data={dataTableDebt ? dataTableDebt : []}
          dataInvoice={debtRecordData ? [debtRecordData] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          beginningDebtAmount={beginningDebtAmount}
          // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
        />
      </Fragment>
    );
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
