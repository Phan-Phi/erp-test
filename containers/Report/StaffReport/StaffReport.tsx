import { useIntl } from "react-intl";
import { Range } from "react-date-range";
import { useReactToPrint } from "react-to-print";
import { endOfWeek, startOfWeek } from "date-fns";
import { cloneDeep, get, omit, set } from "lodash";
import { Grid, Typography, Stack, Box } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";

import { EXPORTS, INVOICE } from "routes";
import { usePermission, useToggle } from "hooks";
import { PrintButton, ExportButton, LoadingDialog } from "components";
import { formatDate, printStyle, setFilterValue, transformDate } from "libs";

import Filter from "./Filter";
import { ConvertTimeFrameType } from "libs/dateUtils";
import { ViewTypeForStaff } from "./ViewTypeForStaff";
import { DisplayCard } from "../components/DisplayCard";
import { StaffReportByTable } from "./StaffReportByTable";
import { StaffReportByChart } from "./StaffReportByChart";

export interface FilterProps {
  date_start: number | null;
  date_end: number | null;
  timeFrame: ConvertTimeFrameType;
  name: string;
  purchase_channel: string | null;
}

export type PartnerFilterType = {
  search?: string;
  range: Range;
  page: number;
  page_size: number;
  purchase_channel: any;
  with_count: boolean;
};

const defaultFilterValue: PartnerFilterType = {
  purchase_channel: null,
  with_count: true,

  page: 1,
  page_size: 25,
  search: "",
  range: {
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
    key: "range",
  },
};

const StaffReport = () => {
  const { messages } = useIntl();

  const printComponentRef = useRef(null);

  const { open, onOpen, onClose } = useToggle();
  const { open: isPrinting, toggle: setIsPrinting } = useToggle();

  const { hasPermission } = usePermission("export_invoice_quantity");

  const promiseResolveRef = useRef<(value?: any) => void>();

  const [filter, setFilter] = useState(defaultFilterValue);
  const [filterDate, setFilterDate] = useState(defaultFilterValue);
  const [viewType, setViewType] = useState<"sale" | "profit">("sale");
  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");

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
    content: () => {
    
      return printComponentRef.current;
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

      // dateStart = transformDate(dateStart, "date_start");
      // dateEnd = transformDate(dateEnd, "date_end");
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
      return <StaffReportByChart filter={filter} viewType={viewType} />;
    } else {
      return (
        <StaffReportByTable
          filter={{
            date_start: transformDate(filter.range?.startDate, "date_start"),
            date_end: transformDate(filter.range?.endDate, "date_end"),
            period: 3600 * 24,
            name: filter.search,
            purchase_channel: filter.purchase_channel
              ? filter.purchase_channel.id
              : undefined,

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
  }, [filter, viewType, isPrinting, displayType, , printComponentRef, onIsDoneHandler]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Stack spacing={3}>
          <Typography fontWeight="700">{messages["staffReport"]}</Typography>

          {hasPermission && <ExportButton onClick={onGotoExportFileHandler} />}
          <DisplayCard value={displayType} onChange={setDisplayType} />

          {/* <FilterByPurchaseChannel onChange={onSetFilterHandler} /> */}

          <ViewTypeForStaff value={viewType} onChange={setViewType} />
          <Filter
            resetFilter={resetFilterHandler}
            filter={filter}
            filterDate={filterDate}
            onFilterByTime={onClickFilterByTime}
            onDateRangeChange={onFilterChangeHandler("range")}
            onFilterDateHandler={onFilterDateHandler("range")}
            onSearch={onFilterChangeHandler("search")}
            onCategoryChange={onFilterChangeHandler("purchase_channel")}
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
          {renderContent}
        </Stack>
      </Grid>
      <LoadingDialog open={open} />
    </Grid>
  );
};

export default StaffReport;
