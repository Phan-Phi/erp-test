import useSWR from "swr";
import { Row } from "react-table";
import { Stack, Box } from "@mui/material";
import { useMeasure, useUpdateEffect } from "react-use";
import { useCallback, useState, Fragment, useMemo, useEffect } from "react";

import { REPORT_PRODUCT_WITH_REVENUE_ITEM } from "interfaces";
import { REPORT_PRODUCT_WITH_REVENUE, REPORT_PRODUCT_WITH_IO_INVENTORY } from "apis";

import { transformUrl } from "libs";
import { useFetch, useLayout } from "hooks";
import { ListingInvoice } from "./ListingInvoice";
import { ListingWarehouse } from "./ListingWarehouse";
import { BackButton, LoadingDynamic as Loading } from "components";

import Column from "./Column";

interface ProductReportByTableProps {
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "warehouse_value" | "import_export_stock";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

type TView = "general" | "listingByTime";

export const ProductReportByTable = (props: ProductReportByTableProps) => {
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

  const [variantData, setVariantData] = useState<REPORT_PRODUCT_WITH_REVENUE_ITEM>();
  const [variantSku, setVariantSku] = useState<string>();

  const { data } = useSWR(() => {
    if (props.viewType === "sale" || props.viewType === "profit") {
      return transformUrl(REPORT_PRODUCT_WITH_REVENUE, {
        ...filter,
        with_sum_net_revenue_incl_tax: true,
        with_sum_revenue_incl_tax: true,
        with_sum_base_amount_incl_tax: true,
        with_sum_quantity: true,
        page_size: 1,
      });
    }
  });

  const { data: reportProductWithIoInventoryData } = useSWR(() => {
    if (
      props.viewType === "warehouse_value" ||
      props.viewType === "import_export_stock"
    ) {
      return transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY, {
        ...filter,
        page_size: 1,
        with_sum_input_quantity: true,
        with_sum_output_quantity: true,
        with_sum_beginning_amount: true,
        with_sum_beginning_quantity: true,
        with_sum_total_input_amount: true,
        with_sum_total_output_amount: true,
        with_sum_current_price_incl_tax: true,
        with_sum_current_base_price_incl_tax: true,
        with_total_current_price_incl_tax_till_date_end: true,
        with_total_current_base_price_incl_tax_till_date_end: true,
      });
    }
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<any>(transformUrl(REPORT_PRODUCT_WITH_REVENUE, filter));

  const [viewType, setViewType] = useState<TView>("general");

  useEffect(() => {
    if (_viewType === "sale" || _viewType === "profit") {
      changeKey(transformUrl(REPORT_PRODUCT_WITH_REVENUE, filter));
    }

    if (_viewType === "warehouse_value" || _viewType === "import_export_stock") {
      changeKey(transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY, filter));
    }
  }, [filter, _viewType]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    setViewType("general");
    setVariantSku(undefined);

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

  const onViewDetailHandler = useCallback(
    (row: Row<REPORT_PRODUCT_WITH_REVENUE_ITEM>) => {
      const sku = row.original.sku;

      setVariantData(row.original);

      setVariantSku(sku);

      setViewType("listingByTime");
    },
    []
  );

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
      if (data == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Fragment>
            <Column
              type={_viewType}
              count={itemCount}
              isLoading={isLoading}
              data={dataTable ?? []}
              dataTotal={data ? [data] : []}
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              onViewDetailHandler={onViewDetailHandler}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
            />
          </Fragment>
        );
      }
    } else if (
      props.viewType === "warehouse_value" ||
      props.viewType === "import_export_stock"
    ) {
      if (reportProductWithIoInventoryData == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Fragment>
            <Column
              type={_viewType}
              count={itemCount}
              isLoading={isLoading}
              data={dataTable ?? []}
              dataTotal={
                reportProductWithIoInventoryData ? [reportProductWithIoInventoryData] : []
              }
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              onViewDetailHandler={onViewDetailHandler}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
            />
          </Fragment>
        );
      }
    }

    return (
      <Fragment>
        <Box display={isPrinting ? "none" : "block"}>{component}</Box>
      </Fragment>
    );
  } else if (viewType === "listingByTime") {
    if (!variantSku) return null;

    let component: React.ReactNode = null;

    if (props.viewType === "sale") {
      component = (
        <ListingInvoice
          variantSku={variantSku}
          filter={filter}
          viewType={props.viewType}
          isPrinting={isPrinting}
          onIsDoneHandler={onIsDoneHandler}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      );
    } else if (props.viewType === "warehouse_value" && variantData) {
      component = (
        <ListingWarehouse
          variantSku={variantSku}
          filter={filter}
          viewType={props.viewType}
          data={variantData}
          isPrinting={isPrinting}
          onIsDoneHandler={onIsDoneHandler}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      );
    }

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
        {component}
      </Stack>
    );
  }

  return null;
};
