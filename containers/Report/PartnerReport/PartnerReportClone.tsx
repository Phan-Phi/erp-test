import { omit } from "lodash";
import { Range } from "react-date-range";
import { useReactToPrint } from "react-to-print";
import { useCallback, useMemo, useRef, useState } from "react";

import { useIntl } from "react-intl";
import { EXPORTS, INVOICE } from "routes";
import { SearchBox } from "../components/SearchBox";
import { TimeFrame } from "../components/TimeFrame";
import { DisplayCard } from "../components/DisplayCard";
import { ViewTypeForPartner } from "./ViewTypeForPartner";
import { useFetch, usePermission, useToggle } from "hooks";
import { formatDate, printStyle, transformUrl } from "libs";
import { Grid, Typography, Stack, Box } from "@mui/material";
import { PartnerReportByChart } from "./PartnerReportByChart";
import { PartnerReportByTable } from "./PartnerReportByTable";
import { PrintButton, ExportButton, LoadingDialog } from "components";
import { ConvertTimeFrameType, convertTimeFrame } from "libs/dateUtils";
import { ADMIN_STOCK_WAREHOUSE_VIEW_TYPE } from "__generated__/apiType_v1";
import { ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT } from "__generated__/END_POINT";

export type CustomerReportFilterType = {
  page: 1;
  page_size: 25;
  with_count: boolean;
  search?: string;
  range: Range;
  flow_type: string;
  source_type: string;
};

const defaultFilterValue: CustomerReportFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  flow_type: "",
  source_type: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

const CustomerReportClone = () => {
  const { messages } = useIntl();
  const printComponentRef = useRef(null);

  const { open, onOpen, onClose } = useToggle();
  const { open: isPrinting, toggle: setIsPrinting } = useToggle();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { hasPermission } = usePermission("export_invoice_quantity");
  const promiseResolveRef = useRef<(value?: any) => void>();

  const [filter, setFilter] = useState<{
    date_start: number | null;
    date_end: number | null;
    timeFrame: ConvertTimeFrameType;
    name: string;
  }>({
    timeFrame: "this_week",
    ...convertTimeFrame("this_week"),
    name: "",
  });

  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");

  const [viewType, setViewType] = useState<"import" | "debt">("import");

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_STOCK_WAREHOUSE_VIEW_TYPE>(
      transformUrl(ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT, {
        use_cache: false,
      })
    );

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

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(
        ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT,
        omit(defaultFilterValue, "range")
      )
    );
  }, [filter]);

  const renderTitle = useMemo(() => {
    let theme = "";

    if (viewType === "import") {
      theme = "nhập hàng";
    } else if (viewType === "debt") {
      theme = "công nợ";
    }

    return (
      <Stack alignItems="center">
        <Typography variant="h6">{`Báo cáo nhà cung cấp theo ${theme}`}</Typography>
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
          <Typography fontWeight="700">{messages["partnerReport"]}</Typography>

          {/* {hasPermission && <ExportButton onClick={onGotoExportFileHandler} />} */}

          <DisplayCard value={displayType} onChange={setDisplayType} />

          <ViewTypeForPartner value={viewType} onChange={setViewType} />

          <TimeFrame
            value={filter.timeFrame}
            onChange={(value: ConvertTimeFrameType) => {
              setFilter((prev) => {
                return {
                  ...prev,
                  ...convertTimeFrame(value),
                  timeFrame: value,
                };
              });
            }}
            onTimeFrameChange={(props) => {
              setFilter((prev) => {
                return {
                  ...prev,
                  date_start: props.date_start,
                  date_end: props.date_end,
                  timeFrame: "",
                };
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
            <PartnerReportByChart filter={filter} viewType={viewType} />
          ) : (
            <PartnerReportByTable
              filter={{
                date_start: filter.date_start,
                date_end: filter.date_end,
                period: 3600 * 24,
                name: filter.name,
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

export default CustomerReportClone;
