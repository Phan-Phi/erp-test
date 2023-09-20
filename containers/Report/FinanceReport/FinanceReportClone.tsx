// import { useIntl } from "react-intl";
// import React, { useCallback, useMemo, useRef, useState } from "react";
// import { startOfYear, endOfYear, millisecondsToSeconds, addMilliseconds } from "date-fns";

// import { Grid, Typography, Stack, Box } from "@mui/material";

// import { ConvertPeriodTimeType } from "libs/dateUtils";
// import { DisplayCard } from "../components/DisplayCard";
// import { ViewTypeForFinance } from "./ViewTypeForFinance";

// import { FinanceReportByChart } from "./FinanceReportByChart";
// import { FinanceReportByTable } from "./FinanceReportByTable";
// import { formatDate, printStyle } from "libs";
// import ExportButton from "components/Button/ExportButton";
// import { usePermission } from "hooks";
// import { EXPORTS, INVOICE } from "routes";
// import { useReactToPrint } from "react-to-print";
// import { PrintButton } from "components";

// const FinanceReportClone = () => {
//   const { messages } = useIntl();

//   const printComponentRef = useRef(null);

//   const printHandler = useReactToPrint({
//     content: () => printComponentRef.current,
//   });

//   const { hasPermission } = usePermission("export_invoice_quantity");

//   const [displayType, setDisplayType] = useState<"chart" | "table">("chart");

//   const [filter, setFilter] = useState<{
//     date_start: null | number;
//     date_end: null | number;
//     period: ConvertPeriodTimeType;
//   }>({
//     date_start: millisecondsToSeconds(startOfYear(new Date()).getTime()),
//     date_end: millisecondsToSeconds(addMilliseconds(endOfYear(new Date()), 1).getTime()),
//     period: "month",
//   });

//   const onGotoExportFileHandler = useCallback(() => {
//     window.open(`/${EXPORTS}/${INVOICE}`, "_blank");
//   }, []);

//   const renderTitle = useMemo(() => {
//     let theme = "";
//     const period = filter.period;

//     if (period === "month") {
//       theme = "tháng";
//     } else if (period === "quarter") {
//       theme = "quý";
//     } else if (period === "year") {
//       theme = "năm";
//     }

//     return (
//       <Stack alignItems="center">
//         <Typography variant="h6">{`Báo cáo tài chính`}</Typography>
//         <Typography>
//           {"Thời gian: "}
//           <Typography component="span" variant="body2" fontWeight="700">
//             {filter.date_start
//               ? formatDate(filter.date_start * 1000, "dd/MM/yyyy")
//               : null}
//           </Typography>
//           {" - "}
//           <Typography component="span" variant="body2" fontWeight="700">
//             {filter.date_end
//               ? formatDate(filter.date_end * 1000 - 1, "dd/MM/yyyy")
//               : null}
//           </Typography>
//         </Typography>
//       </Stack>
//     );
//   }, [filter]);

//   return (
//     <Grid container>
//       <Grid item xs={2}>
//         <Stack spacing={3}>
//           <Typography fontWeight="700">{messages["financeReport"]}</Typography>

//           {/* {hasPermission && <ExportButton onClick={onGotoExportFileHandler} />} */}

//           <DisplayCard
//             value={displayType}
//             onChange={(value) => {
//               setDisplayType(value);
//             }}
//           />

//           <ViewTypeForFinance
//             onChange={(value) => {
//               setFilter((prev) => {
//                 return {
//                   ...prev,
//                   period: value,
//                 };
//               });
//             }}
//             onTimeFrameChange={({ date_start, date_end }) => {
//               setFilter((prev) => {
//                 return {
//                   ...prev,
//                   date_start,
//                   date_end,
//                 };
//               });
//             }}
//             value={filter.period}
//           />
//         </Stack>
//       </Grid>
//       <Grid item xs={10}>
//         <Stack position="relative" rowGap={2} ref={printComponentRef}>
//           <Box position="absolute" right={0} top={0}>
//             <PrintButton onClick={printHandler} />
//             <style type="text/css" media="print">
//               {printStyle()}
//             </style>
//           </Box>

//           {renderTitle}

//           {displayType === "chart" ? (
//             <FinanceReportByChart filter={filter} />
//           ) : (
//             <FinanceReportByTable filter={filter} />
//           )}
//         </Stack>
//       </Grid>
//     </Grid>
//   );
// };

// export default FinanceReportClone;

import { useIntl } from "react-intl";
import { Range } from "react-date-range";
import { useReactToPrint } from "react-to-print";
import { cloneDeep, get, omit, set } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import { startOfYear, endOfYear, millisecondsToSeconds, addMilliseconds } from "date-fns";

import { Grid, Typography, Stack, Box } from "@mui/material";

import { ConvertPeriodTimeType, getPeriodUnitFromTimeObj } from "libs/dateUtils";
import { DisplayCard } from "../components/DisplayCard";
import { ViewTypeForFinance } from "./ViewTypeForFinance";
import { FinanceReportByChart } from "./FinanceReportByChart";
import { FinanceReportByTable } from "./FinanceReportByTable";
import {
  formatDate,
  printStyle,
  setFilterValue,
  transformDate,
  transformUrl,
} from "libs";
import ExportButton from "components/Button/ExportButton";
import { useFetch, usePermission } from "hooks";
import { EXPORTS, INVOICE } from "routes";
import { PrintButton } from "components";
import { ADMIN_REPORTS_CASH_END_POINT } from "__generated__/END_POINT";

export type PartnerFilterType = {
  period: string;
  range: Range;
  period_unit: any;
  get_all: boolean;
  with_count: boolean;
};

const defaultFilterValue: PartnerFilterType = {
  period: "month",
  with_count: true,
  range: {
    startDate: startOfYear(new Date()),
    endDate: endOfYear(new Date()),
    // date_start: millisecondsToSeconds(startOfYear(new Date()).getTime()),
    // date_end: millisecondsToSeconds(addMilliseconds(endOfYear(new Date()), 1).getTime()),
    key: "range",
  },
  period_unit: getPeriodUnitFromTimeObj({
    date_start: millisecondsToSeconds(startOfYear(new Date()).getTime()),
    date_end: millisecondsToSeconds(addMilliseconds(endOfYear(new Date()), 1).getTime()),
  }),
  get_all: true,
};

const FinanceReport = () => {
  const { messages } = useIntl();

  const printComponentRef = useRef(null);

  const printHandler = useReactToPrint({
    content: () => printComponentRef.current,
  });

  const { hasPermission } = usePermission("export_invoice_quantity");

  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");

  const [filter, setFilter] = useState(defaultFilterValue);

  const { resData, isLoading, itemCount, changeKey, refreshData } = useFetch<any>(
    transformUrl(ADMIN_REPORTS_CASH_END_POINT, {
      date_start: transformDate(filter.range.startDate, "date_start"),
      date_end: transformDate(filter.range.endDate, "date_end"),
      ...omit(filter, "range"),
      period: filter.period === "year" ? 12 : filter.period === "quarter" ? 3 : 1,
    })
  );

  const onGotoExportFileHandler = useCallback(() => {
    window.open(`/${EXPORTS}/${INVOICE}`, "_blank");
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);
        if (key === "range") return;

        const params = cloneDeep(cloneFilter);
        set(params, "period", get(params, "period"));

        const dateStart = transformDate(filter.range.startDate, "date_start");
        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(ADMIN_REPORTS_CASH_END_POINT, {
            ...omit(params, "range"),
            offset: 0,

            date_start: filter.range.startDate ? dateStart : undefined,
            date_end: filter.range.endDate ? dateEnd : undefined,

            period: filter.period === "year" ? 12 : filter.period === "quarter" ? 3 : 1,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(
    (key: string) => {
      const cloneFilter = cloneDeep(filter);

      let dateStart: any = get(filter, "range.startDate");
      let dateEnd: any = get(filter, "range.endDate");

      dateStart = transformDate(dateStart, "date_start");
      dateEnd = transformDate(dateEnd, "date_end");

      set(cloneFilter, "period", get(cloneFilter, "period"));

      changeKey(
        transformUrl(ADMIN_REPORTS_CASH_END_POINT, {
          ...omit(cloneFilter, "range"),
          date_start: dateStart,
          date_end: dateEnd,
          period:
            cloneFilter.period === "year" ? 12 : cloneFilter.period === "quarter" ? 3 : 1,
        })
      );
    },
    [filter]
  );

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
                  transformDate(filter.range.endDate, "date_end") * 1000 - 1,
                  "dd/MM/yyyy"
                )
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
            onPeriod={onFilterChangeHandler("period")}
            // onChange={(value) => {
            //   setFilter((prev) => {
            //     return {
            //       ...prev,
            //       period: value,
            //     };
            //   });
            // }}
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
            filter={filter}
            onFilterByTime={onClickFilterByTime}
            onDateRangeChange={onFilterChangeHandler("range")}
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
            <FinanceReportByChart filter={filter} data={resData} />
          ) : (
            <FinanceReportByTable filter={filter} data={resData} />
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default FinanceReport;
