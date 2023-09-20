import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import React, { useCallback, useMemo, useRef, useState } from "react";

import { Grid, Typography, Stack, Box } from "@mui/material";

import { TimeFrame } from "../components/TimeFrame";
import { ViewTypeForSale } from "./ViewTypeForSale";
import { SaleReportByTable } from "./SaleReportByTable";
import { SaleReportByChart } from "./SaleReportByChart";
import { DisplayCard } from "../components/DisplayCard";

import { PrintButton, ExportButton, LoadingDialog } from "components";

import { usePermission, useToggle } from "hooks";
import { EXPORTS, INVOICE } from "routes";
import { formatDate, printStyle, setFilterValue, transformDate } from "libs";
import { ConvertTimeFrameType, convertTimeFrame } from "libs/dateUtils";
import FilterByPurchaseChannel from "../components/FilterByPurchaseChannel";
import { cloneDeep, get, omit, set } from "lodash";
import { Range } from "react-date-range";
import { endOfWeek, startOfWeek } from "date-fns";
import Filter from "./Filter";

export interface FilterProps {
  date_start: number | null;
  date_end: number | null;
  timeFrame: ConvertTimeFrameType;
  purchase_channel?: string;
}

export type PartnerFilterType = {
  with_count: boolean;
  page: number;
  page_size: number;
  range: Range;
  purchase_channel: string | null;
};

const defaultFilterValue: PartnerFilterType = {
  with_count: true,
  page: 1,
  page_size: 25,
  purchase_channel: null,
  range: {
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
    key: "range",
  },
};

const SaleReport = () => {
  const { messages } = useIntl();
  const printComponentRef = useRef(null);

  const { open, onOpen, onClose } = useToggle();
  const { open: isPrinting, toggle: setIsPrinting } = useToggle();

  const { hasPermission } = usePermission("export_invoice_quantity");

  const promiseResolveRef = useRef<(value?: any) => void>();

  const [filter, setFilter] = useState(defaultFilterValue);
  const [filterDate, setFilterDate] = useState(defaultFilterValue);
  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");
  const [viewType, setViewType] = useState<"time" | "profit" | "discount">("time");

  // const printHandler = useReactToPrint({
  //   content: () => printComponentRef.current,
  //   onBeforeGetContent: () => {
  //     if (displayType === "chart") return;

  //     return new Promise((resolve) => {
  //       onOpen();
  //       setIsPrinting(true);
  //       promiseResolveRef.current = resolve;
  //     });
  //   },
  //   onAfterPrint: () => {
  //     setIsPrinting(false);
  //   },
  // });

  const printHandler = useReactToPrint({
    content: () => printComponentRef.current,
  });

  const onGotoExportFileHandler = useCallback(() => {
    window.open(`/${EXPORTS}/${INVOICE}`, "_blank");
  }, []);

  const onIsDoneHandler = useCallback(() => {
    promiseResolveRef.current?.();
    onClose();
  }, []);

  const onFilterDateHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);
        cloneFilter = setFilterValue(cloneFilter, key, value);
        setFilterDate(cloneFilter);
      };
    },
    [filter]
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        // let cloneFilter = cloneDeep(filterDate);
        let cloneFilter = cloneDeep({
          ...omit(filter, "range"),
          range: filterDate.range,
        });
        cloneFilter = setFilterValue(cloneFilter, key, value);
        const params = cloneDeep(cloneFilter);
        set(params, "purchase_channel", get(params, "purchase_channel"));
        setFilter(params);
        if (key === "range") return;
      };
    },
    [filter, filterDate]
  );
  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);
    setFilterDate(defaultFilterValue);
  }, []);

  const onClickFilterByTime = useCallback(
    (key: string) => {
      let dateStart: any = get(filterDate, "range.startDate");
      let dateEnd: any = get(filterDate, "range.endDate");

      setFilter({
        ...omit(filter, "range"),
        range: {
          startDate: dateStart,
          endDate: dateEnd,
          key: "range",
        },
      });
    },
    [filterDate, filter]
  );

  const renderTitle = useMemo(() => {
    let theme = "";

    if (viewType === "time") {
      theme = "thời gian";
    } else if (viewType === "profit") {
      theme = "lợi nhuận";
    } else if (viewType === "discount") {
      theme = "giảm giá hóa đơn";
    }

    return (
      <Stack alignItems="center">
        <Typography variant="h6">{`Báo cáo bán hàng theo ${theme}`}</Typography>
        <Typography>
          {"Thời gian: "}
          <Typography component="span" variant="body2" fontWeight="700">
            {filter.range.startDate
              ? formatDate(
                  transformDate(filter.range.startDate, "date_start") * 1000,
                  "dd/MM/yyyy"
                )
              : null}
          </Typography>
          {" - "}
          <Typography component="span" variant="body2" fontWeight="700">
            {filter.range.endDate
              ? formatDate(
                  transformDate(filter.range.endDate, "date_start") * 1000 - 1,
                  "dd/MM/yyyy"
                )
              : null}
          </Typography>
        </Typography>
      </Stack>
    );
  }, [viewType, filter]);

  const renderContent = useMemo(() => {
    if (displayType === "chart") {
      return <SaleReportByChart filter={filter} viewType={viewType} />;
    } else {
      return (
        <SaleReportByTable
          filter={{
            date_start: transformDate(filter.range?.startDate, "date_start"),
            date_end: transformDate(filter.range?.endDate, "date_end"),
            period: 3600 * 24,
            page: filter.page,
            page_size: filter.page_size,
          }}
          viewType={viewType}
          isPrinting={isPrinting}
          onIsDoneHandler={onIsDoneHandler}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
        />
      );
    }
  }, [filter, viewType, isPrinting, displayType, printComponentRef, onIsDoneHandler]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Stack spacing={3}>
          <Typography fontWeight="700">{messages["saleReport"]}</Typography>

          {hasPermission && <ExportButton onClick={onGotoExportFileHandler} />}

          <DisplayCard value={displayType} onChange={setDisplayType} />

          <ViewTypeForSale value={viewType} onChange={setViewType} />
          <Filter
            filter={filter}
            resetFilter={resetFilterHandler}
            filterDate={filterDate}
            onFilterByTime={onClickFilterByTime}
            onDateRangeChange={onFilterChangeHandler("range")}
            onFilterDateHandler={onFilterDateHandler("range")}
            onPurchaseChannelChange={onFilterChangeHandler("purchase_channel")}
          />
        </Stack>
      </Grid>
      <Grid item xs={10}>
        <Stack position="relative" rowGap={2} ref={printComponentRef}>
          {/* <Box position="absolute" right={0} top={0}>
            <PrintButton
              onClick={printHandler}
              sx={{
                pointerEvents: isPrinting ? "none" : "unset",
              }}
            />
            <style type="text/css" media="print">
              {printStyle()}
            </style>
          </Box> */}

          <Box position="absolute" right={0} top={0}>
            <PrintButton onClick={printHandler} />
            <style type="text/css" media="print">
              {printStyle()}
            </style>
          </Box>

          {renderTitle}
          {renderContent}
        </Stack>
      </Grid>
      <LoadingDialog open={open} />
    </Grid>
  );
};

export default SaleReport;
