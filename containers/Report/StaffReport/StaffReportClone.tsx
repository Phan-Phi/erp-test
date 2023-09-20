import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import { useCallback, useMemo, useRef, useState } from "react";

import { Grid, Typography, Stack, Box } from "@mui/material";

import { TimeFrame } from "../components/TimeFrame";
import { SearchBox } from "../components/SearchBox";
import { DisplayCard } from "../components/DisplayCard";

import { ViewTypeForStaff } from "./ViewTypeForStaff";

import { ConvertTimeFrameType, convertTimeFrame } from "libs/dateUtils";

import { EXPORTS, INVOICE } from "routes";
import { formatDate, printStyle } from "libs";
import { usePermission, useToggle } from "hooks";
import { StaffReportByTable } from "./StaffReportByTable";
import { StaffReportByChart } from "./StaffReportByChart";
import { PrintButton, ExportButton, LoadingDialog } from "components";
import FilterByPurchaseChannel from "../components/FilterByPurchaseChannel";

export interface FilterProps {
  date_start: number | null;
  date_end: number | null;
  timeFrame: ConvertTimeFrameType;
  name: string;
  purchase_channel?: string | undefined;
}

const StaffReport = () => {
  const { messages } = useIntl();

  const printComponentRef = useRef(null);

  const { open, onOpen, onClose } = useToggle();
  const { open: isPrinting, toggle: setIsPrinting } = useToggle();

  const { hasPermission } = usePermission("export_invoice_quantity");

  const promiseResolveRef = useRef<(value?: any) => void>();

  const [filter, setFilter] = useState<FilterProps>({
    timeFrame: "this_week",
    name: "",
    ...convertTimeFrame("this_week"),
  });

  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");
  const [viewType, setViewType] = useState<"sale" | "profit">("sale");

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

  const onIsDoneHandler = useCallback(() => {
    promiseResolveRef.current?.();
    onClose();
  }, []);

  const onSetFilterHandler = useCallback((newFilter: Partial<FilterProps>) => {
    setFilter((prev) => {
      return {
        ...prev,
        ...newFilter,
      };
    });
  }, []);

  const renderTitle = useMemo(() => {
    let theme = "";

    if (viewType === "sale") {
      theme = "bán hàng";
    } else if (viewType === "profit") {
      theme = "lợi nhuận";
    }

    return (
      <Stack alignItems="center">
        <Typography variant="h6">{`Báo cáo nhân viên theo ${theme}`}</Typography>
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
          <Typography fontWeight="700">{messages["staffReport"]}</Typography>

          {hasPermission && <ExportButton onClick={onGotoExportFileHandler} />}

          <DisplayCard value={displayType} onChange={setDisplayType} />

          <FilterByPurchaseChannel onChange={onSetFilterHandler} />

          <ViewTypeForStaff value={viewType} onChange={setViewType} />

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

          <SearchBox
            onChange={(value) => {
              setFilter((prev) => {
                return {
                  ...prev,
                  name: value,
                };
              });
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={10}>
        <Stack position="relative" rowGap={2} ref={printComponentRef}>
          <Box position="absolute" right={0} top={0}>
            <PrintButton onClick={printHandler} />
            <style type="text/css" media="print">
              {printStyle()}
            </style>
          </Box>

          {renderTitle}

          {displayType === "chart" ? (
            <StaffReportByChart filter={filter} viewType={viewType} />
          ) : (
            <StaffReportByTable
              filter={{
                date_start: filter.date_start,
                date_end: filter.date_end,
                period: 3600 * 24,
                name: filter.name,
                purchase_channel: filter.purchase_channel,
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

export default StaffReport;
