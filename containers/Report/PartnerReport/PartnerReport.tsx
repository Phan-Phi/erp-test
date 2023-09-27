import { Range } from "react-date-range";
import { cloneDeep, get, omit } from "lodash";
import { useReactToPrint } from "react-to-print";
import { endOfWeek, startOfWeek } from "date-fns";
import { Grid, Typography, Stack, Box } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";

import { useToggle } from "hooks";
import { useIntl } from "react-intl";
import { EXPORTS, INVOICE } from "routes";
import { DisplayCard } from "../components/DisplayCard";
import { PrintButton, LoadingDialog } from "components";
import { ViewTypeForPartner } from "./ViewTypeForPartner";
import { PartnerReportByChart } from "./PartnerReportByChart";
import { PartnerReportByTable } from "./PartnerReportByTable";
import { formatDate, printStyle, setFilterValue, transformDate } from "libs";

import Filter from "./Filter";

export type CustomerReportFilterType = {
  search?: string;
  range: Range;
  with_count: boolean;
  page: number;
  page_size: number;
};

const defaultFilterValue: CustomerReportFilterType = {
  search: "",
  with_count: true,

  page: 1,
  page_size: 25,
  range: {
    startDate: startOfWeek(Date.now(), {
      weekStartsOn: 1,
    }),
    endDate: endOfWeek(Date.now(), {
      weekStartsOn: 1,
    }),
    key: "range",
  },
};

const CustomerReportClone = () => {
  const { messages } = useIntl();
  const printComponentRef = useRef(null);

  const { open, onOpen, onClose } = useToggle();
  const { open: isPrinting, toggle: setIsPrinting } = useToggle();

  const [filter, setFilter] = useState(defaultFilterValue);
  const [filterDate, setFilterDate] = useState(defaultFilterValue);
  const [viewType, setViewType] = useState<"import" | "debt">("import");
  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");

  const promiseResolveRef = useRef<(value?: any) => void>();

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
        let cloneFilter = cloneDeep(filterDate);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);
        if (key === "range") return;
      };
    },
    [filter]
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
      return <PartnerReportByChart filter={filter} viewType={viewType} />;
    } else {
      return (
        <PartnerReportByTable
          filter={{
            date_start: transformDate(filter.range?.startDate, "date_start"),
            date_end: transformDate(filter.range?.endDate, "date_end"),
            period: 3600 * 24,
            name: filter.search,
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
  }, [filter, viewType, isPrinting, displayType, onIsDoneHandler]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Stack spacing={3}>
          <Typography fontWeight="700">{messages["partnerReport"]}</Typography>

          <DisplayCard value={displayType} onChange={setDisplayType} />

          <ViewTypeForPartner value={viewType} onChange={setViewType} />

          <Filter
            filter={filter}
            filterDate={filterDate}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onSearch={onFilterChangeHandler("search")}
            onDateRangeChange={onFilterChangeHandler("range")}
            onFilterDateHandler={onFilterDateHandler("range")}
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
          {renderContent}
        </Stack>
      </Grid>
      <LoadingDialog open={open} />
    </Grid>
  );
};

export default CustomerReportClone;
