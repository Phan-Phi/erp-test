import useSWR from "swr";
import dynamic from "next/dynamic";
import { useMeasure, useUpdateEffect } from "react-use";
import { useCallback, useRef, Fragment, useState, useMemo, useEffect } from "react";
import { parseISO, startOfDay, endOfDay, millisecondsToSeconds } from "date-fns";

import get from "lodash/get";
import SaleReportColumnByTime from "./SaleReportColumnByTime";
import SaleReportColumnByProfit from "./SaleReportColumnByProfit";
import SaleReportColumnByDiscount from "./SaleReportColumnByDiscount";

import { Row } from "react-table";
import { setFilterValue, transformUrl } from "libs";
import { useIntl } from "react-intl";
import { REPORT_REVENUE } from "apis";
import { useFetch, useFetchAllData, useLayout } from "hooks";
import { FilterProps } from "./SaleReport";
import { REPORT_REVENUE_ITEM } from "interfaces";
import { alpha, Box, Stack } from "@mui/material";
import { BackButton, LoadingDynamic as Loading, NumberFormat } from "components";

import {
  TableRow,
  TableCell,
  TableView,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
} from "components/TableV2";
import Column from "./Column";
import { cloneDeep } from "lodash";

/* eslint react/jsx-key: off */

const ListingInvoice = dynamic(() => import("./ListingInvoice"), {
  loading: Loading,
});

interface SaleReportByTableProps {
  filter: Partial<FilterProps> & { period: number; page: number; page_size: number };
  viewType: "time" | "profit" | "discount";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

type TView = "general" | "listingInvoice";

export const SaleReportByTable = (props: SaleReportByTableProps) => {
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

  const [selectedDate, setSelectedDate] = useState<{
    date_start: number | null;
    date_end: number | null;
  }>({
    date_start: null,
    date_end: null,
  });

  const [viewType, setViewType] = useState<TView>("general");

  const { data } = useSWR(
    transformUrl(REPORT_REVENUE, {
      ...filter,
      with_sum_net_revenue_incl_tax: true,
      with_sum_revenue_incl_tax: true,
      with_sum_base_amount_incl_tax: true,
      with_sum_invoice_count: true,
    })
  );

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<REPORT_REVENUE_ITEM>(transformUrl(REPORT_REVENUE, filter));

  const tableInstance = useRef<ExtendableTableInstanceProps<REPORT_REVENUE_ITEM>>();

  const { data: reportDataForPrinting, setUrl, isDone } = useFetchAllData();

  useEffect(() => {
    changeKey(transformUrl(REPORT_REVENUE, filter));
  }, [filter]);

  useUpdateEffect(() => {
    if (!isPrinting) return;

    tableInstance.current && setUrl(tableInstance.current.url);
  }, [isPrinting]);

  useUpdateEffect(() => {
    isDone && onIsDoneHandler();
  }, [isDone]);

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<REPORT_REVENUE_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        return;
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        if (key === "range") return;

        const params = cloneDeep(cloneFilter);
        changeKey(transformUrl(REPORT_REVENUE, { ...params, page: 1 }));
      };
    },
    [filter]
  );

  useUpdateEffect(() => {
    if (tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;

      setUrl(transformUrl(REPORT_REVENUE, filter));
    }
  }, [filter]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    timer = setTimeout(() => {
      setReload(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [props.viewType]);

  const onViewDetailHandler = useCallback((row: Row<REPORT_REVENUE_ITEM>) => {
    const dateStart = get(row, "original.date_start");

    const milliseconds = parseISO(dateStart).getTime();

    setSelectedDate({
      date_start: millisecondsToSeconds(startOfDay(milliseconds).getTime()),
      date_end: millisecondsToSeconds(endOfDay(milliseconds).getTime()),
    });

    setViewType("listingInvoice");
  }, []);

  const onBackToGeneralHandler = useCallback(() => {
    setViewType("general");
  }, []);

  const columnFn = useMemo(() => {
    const viewType = props.viewType;

    if (viewType === "time") {
      return SaleReportColumnByTime;
    } else if (viewType === "profit") {
      return SaleReportColumnByProfit;
    } else if (viewType === "discount") {
      return SaleReportColumnByDiscount;
    } else {
      return SaleReportColumnByTime;
    }
  }, [props.viewType]);

  const renderTotal = useMemo(() => {
    const viewType = props.viewType;

    if (data == undefined) return null;

    if (viewType === "time") {
      return (
        <TableRow
          sx={{
            backgroundColor: ({ palette }) => {
              return `${alpha(palette.primary2.main, 0.25)} !important`;
            },
          }}
        >
          <TableCell></TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_revenue_incl_tax"))} />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_net_revenue_incl_tax"))} />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "profit") {
      return (
        <TableRow
          sx={{
            backgroundColor: ({ palette }) => {
              return `${alpha(palette.primary2.main, 0.25)} !important`;
            },
          }}
        >
          <TableCell></TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_revenue_incl_tax"))} />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                (
                  get(data, "sum_revenue_incl_tax") -
                  get(data, "sum_net_revenue_incl_tax")
                ).toFixed(2)
              )}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_net_revenue_incl_tax"))} />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_base_amount_incl_tax"))} />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                (
                  get(data, "sum_net_revenue_incl_tax") -
                  get(data, "sum_base_amount_incl_tax")
                ).toFixed(2)
              )}
            />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "discount") {
      return (
        <TableRow
          sx={{
            backgroundColor: ({ palette }) => {
              return `${alpha(palette.primary2.main, 0.25)} !important`;
            },
          }}
        >
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
            colSpan={2}
          >
            <NumberFormat value={parseFloat(get(data, "sum_invoice_count"))} suffix="" />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_net_revenue_incl_tax"))} />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                (
                  get(data, "sum_revenue_incl_tax") -
                  get(data, "sum_net_revenue_incl_tax")
                ).toFixed(2)
              )}
            />
          </TableCell>
        </TableRow>
      );
    }

    return null;
  }, [data, props.viewType]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (reload) return <Loading />;

  if (viewType === "general") {
    if (data == undefined) return <Loading />;

    return (
      <Fragment>
        <Box ref={ref}>
          <Column
            type={_viewType}
            count={itemCount}
            isLoading={isLoading}
            data={dataTable ?? []}
            dataTotal={[data] ?? []}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onViewDetailHandler={onViewDetailHandler}
            maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
          />
          {/* <CompoundTableWithFunction<REPORT_REVENUE_ITEM>
            url={transformUrl(REPORT_REVENUE, filter)}
            columnFn={columnFn}
            messages={messages}
            passHandler={passHandler}
            onViewDetailHandler={onViewDetailHandler}
            renderBodyItem={(rows, tableInstance) => {
              if (rows == undefined) return null;

              return (
                <Fragment>
                  {renderTotal}

                  {rows.map((row, i) => {
                    tableInstance.prepareRow(row);

                    return (
                      <TableRow {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <TableCell
                              {...cell.getCellProps()}
                              {...(cell.column.colSpan && {
                                colSpan: cell.column.colSpan,
                              })}
                              sx={{
                                width: cell.column.width,
                                minWidth: cell.column.minWidth,
                                maxWidth: cell.column.maxWidth,
                              }}
                            >
                              {cell.render("Cell")}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </Fragment>
              );
            }}
          /> */}
        </Box>
        <Box display={isPrinting ? "block" : "none"}>
          {isDone && (
            <TableView
              columns={columnFn()}
              data={reportDataForPrinting}
              prependChildren={renderTotal}
            />
          )}
        </Box>
      </Fragment>
    );
  } else if (viewType === "listingInvoice") {
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

        <ListingInvoice
          filter={selectedDate}
          viewType={props.viewType}
          isPrinting={isPrinting}
          onIsDoneHandler={onIsDoneHandler}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Stack>
    );
  }

  return null;
};
