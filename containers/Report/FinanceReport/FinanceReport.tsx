import { useReactToPrint } from "react-to-print";
import { Grid, Typography, Stack, Box } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { startOfYear, endOfYear, millisecondsToSeconds, addMilliseconds } from "date-fns";

import { useIntl } from "react-intl";
import { usePermission } from "hooks";
import { PrintButton } from "components";
import { EXPORTS, INVOICE } from "routes";
import { DisplayCard } from "../components/DisplayCard";
import ExportButton from "components/Button/ExportButton";
import { ViewTypeForFinance } from "./ViewTypeForFinance";
import { FinanceReportByChart } from "./FinanceReportByChart";
import { FinanceReportByTable } from "./FinanceReportByTable";
import { ConvertPeriodTimeType, formatDate, printStyle } from "libs";

const FinanceReport = () => {
  const { messages } = useIntl();

  const printComponentRef = useRef(null);

  const printHandler = useReactToPrint({
    content: () => printComponentRef.current,
  });

  const { hasPermission } = usePermission("export_invoice_quantity");

  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");

  const [filter, setFilter] = useState<{
    date_start: null | number;
    date_end: null | number;
    period: ConvertPeriodTimeType;
  }>({
    date_start: millisecondsToSeconds(startOfYear(new Date()).getTime()),
    date_end: millisecondsToSeconds(addMilliseconds(endOfYear(new Date()), 1).getTime()),
    period: "month",
  });

  const onGotoExportFileHandler = useCallback(() => {
    window.open(`/${EXPORTS}/${INVOICE}`, "_blank");
  }, []);

  const renderTitle = useMemo(() => {
    let theme = "";
    const period = filter.period;

    if (period === "month") {
      theme = "tháng";
    } else if (period === "quarter") {
      theme = "quý";
    } else if (period === "year") {
      theme = "năm";
    }

    return (
      <Stack alignItems="center">
        <Typography variant="h6">{`Báo cáo tài chính`}</Typography>
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
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Stack spacing={3}>
          <Typography fontWeight="700">{messages["financeReport"]}</Typography>

          {/* {hasPermission && <ExportButton onClick={onGotoExportFileHandler} />} */}

          <DisplayCard
            value={displayType}
            onChange={(value) => {
              setDisplayType(value);
            }}
          />

          <ViewTypeForFinance
            onChange={(value) => {
              setFilter((prev) => {
                return {
                  ...prev,
                  period: value,
                };
              });
            }}
            onTimeFrameChange={({ date_start, date_end }) => {
              setFilter((prev) => {
                return {
                  ...prev,
                  date_start,
                  date_end,
                };
              });
            }}
            value={filter.period}
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
            <FinanceReportByChart filter={filter} />
          ) : (
            <FinanceReportByTable filter={filter} />
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default FinanceReport;
