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
import { formatDate, printStyle } from "libs";
import { ConvertTimeFrameType, convertTimeFrame } from "libs/dateUtils";
import FilterByPurchaseChannel from "../components/FilterByPurchaseChannel";

export interface FilterProps {
  date_start: number | null;
  date_end: number | null;
  timeFrame: ConvertTimeFrameType;
  purchase_channel?: string;
}

const SaleReport = () => {
  const { messages } = useIntl();
  const printComponentRef = useRef(null);

  const { open, onOpen, onClose } = useToggle();
  const { open: isPrinting, toggle: setIsPrinting } = useToggle();

  const { hasPermission } = usePermission("export_invoice_quantity");

  const promiseResolveRef = useRef<(value?: any) => void>();

  const [filter, setFilter] = useState<FilterProps>({
    timeFrame: "this_week",
    ...convertTimeFrame("this_week"),
  });

  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");

  const [viewType, setViewType] = useState<"time" | "profit" | "discount">("time");

  const printHandler = useReactToPrint({
    content: () => printComponentRef.current,
    onBeforeGetContent: () => {
      if (displayType === "chart") return;

      return new Promise((resolve) => {
        onOpen();
        setIsPrinting(true);
        promiseResolveRef.current = resolve;
      });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  const onGotoExportFileHandler = useCallback(() => {
    window.open(`/${EXPORTS}/${INVOICE}`, "_blank");
  }, []);

  const onSetFilterHandler = useCallback((newFilter: Partial<FilterProps>) => {
    setFilter((prev) => {
      return {
        ...prev,
        ...newFilter,
      };
    });
  }, []);

  const onIsDoneHandler = useCallback(() => {
    promiseResolveRef.current?.();
    onClose();
  }, []);

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
            {filter.date_start
              ? formatDate(filter.date_start * 1000, "dd/MM/yyyy")
              : null}
          </Typography>
          {" - "}
          <Typography component="span" variant="body2" fontWeight="700">
            {filter.date_end
              ? formatDate(filter.date_end * 1000 - 1, "dd/MM/yyyy")
              : null}
          </Typography>
        </Typography>
      </Stack>
    );
  }, [viewType, filter]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Stack spacing={3}>
          <Typography fontWeight="700">{messages["saleReport"]}</Typography>

          {/* {hasPermission && <ExportButton onClick={onGotoExportFileHandler} />} */}

          <FilterByPurchaseChannel onChange={onSetFilterHandler} />

          <DisplayCard value={displayType} onChange={setDisplayType} />

          <ViewTypeForSale value={viewType} onChange={setViewType} />

          <TimeFrame
            value={filter.timeFrame}
            onChange={(value: ConvertTimeFrameType) => {
              onSetFilterHandler({
                ...convertTimeFrame(value),
                timeFrame: value,
              });
            }}
            onTimeFrameChange={(props) => {
              onSetFilterHandler({
                date_start: props.date_start,
                date_end: props.date_end,
                timeFrame: "",
              });
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={10}>
        <Stack position="relative" rowGap={2} ref={printComponentRef}>
          <Box position="absolute" right={0} top={0}>
            <PrintButton
              onClick={printHandler}
              sx={{
                pointerEvents: isPrinting ? "none" : "unset",
              }}
            />
            <style type="text/css" media="print">
              {printStyle()}
            </style>
          </Box>

          {renderTitle}

          {displayType === "chart" ? (
            <SaleReportByChart filter={filter} viewType={viewType} />
          ) : (
            <SaleReportByTable
              filter={{
                date_start: filter.date_start,
                date_end: filter.date_end,
                period: 3600 * 24,
              }}
              viewType={viewType}
              isPrinting={isPrinting}
              onIsDoneHandler={onIsDoneHandler}
            />
          )}
        </Stack>
      </Grid>
      <LoadingDialog open={open} />
    </Grid>
  );
};

export default SaleReport;
