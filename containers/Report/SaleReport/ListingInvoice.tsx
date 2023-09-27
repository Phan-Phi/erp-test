import useSWR from "swr";
import { Box } from "@mui/material";
import { Fragment, useMemo } from "react";

import ColumnDetail from "./ColumnDetail";

import { useFetch } from "hooks";
import { transformUrl } from "libs";
import { LoadingDynamic as Loading, WrapperTable } from "components";
import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_INVOICES_END_POINT } from "__generated__/END_POINT";

interface ListingInvoiceProps {
  filter: Record<string, any>;
  viewType: "time" | "profit" | "discount";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

const ListingInvoice = (props: ListingInvoiceProps) => {
  const {
    filter,
    viewType,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { data } = useSWR(() => {
    return transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
      with_sum_amount_before_discounts_incl_tax: true,
      with_sum_base_amount_incl_tax: true,
      with_sum_amount_incl_tax: true,
    });
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
  } = useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
    transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
      with_sum_amount_before_discounts_incl_tax: true,
    })
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (data == undefined) return <Loading />;

  return (
    <Fragment>
      <Box display={isPrinting ? "none" : "block"} displayPrint="none">
        <WrapperTable>
          <ColumnDetail
            filter={filter}
            type={viewType}
            count={itemCount}
            isLoading={isLoading}
            data={dataTable ? dataTable : []}
            dataTotal={data ? [data] : []}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
          />
        </WrapperTable>
      </Box>
    </Fragment>
  );
};

export default ListingInvoice;
