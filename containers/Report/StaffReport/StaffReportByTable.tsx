import useSWR from "swr";
import { Row } from "react-table";
import { useMeasure, useUpdateEffect } from "react-use";
import React, {
  useCallback,
  useRef,
  useState,
  Fragment,
  useMemo,
  useEffect,
} from "react";

import { Stack, alpha, Box } from "@mui/material";

import get from "lodash/get";

import { REPORT_STAFF_WITH_REVENUE } from "apis";
import { REPORT_STAFF_WITH_REVENUE_ITEM } from "interfaces";

import {
  TableRow,
  TableView,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
} from "components/TableV2";

import {
  TableCell,
  BackButton,
  NumberFormat,
  LoadingDynamic as Loading,
} from "components";

import { transformUrl } from "libs";
import { ListingInvoice } from "./ListingInvoice";
import StaffReportColumnBySale from "./StaffReportColumnBySale";
import StaffReportColumnByProfit from "./StaffReportColumnByProfit";

import { FilterProps } from "./StaffReport";
import { useFetch, useFetchAllData, useLayout } from "hooks";
import Column from "./Column";

interface StaffReportByTableProps {
  filter: Partial<FilterProps> & { period: number };
  viewType: "sale" | "profit";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

type TView = "general" | "listingByTime";

export const StaffReportByTable = (props: any) => {
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

  const [owner, setOwner] = useState<number>();

  const { data } = useSWR(
    transformUrl(REPORT_STAFF_WITH_REVENUE, {
      ...filter,
      with_sum_revenue_incl_tax: true,
      with_sum_base_amount_incl_tax: true,
      with_sum_net_revenue_incl_tax: true,
    })
  );

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<REPORT_STAFF_WITH_REVENUE_ITEM>(
    transformUrl(REPORT_STAFF_WITH_REVENUE, filter)
  );
  const [viewType, setViewType] = useState<TView>("general");

  const tableInstance =
    useRef<ExtendableTableInstanceProps<REPORT_STAFF_WITH_REVENUE_ITEM>>();

  const { data: reportDataForPrinting, setUrl, isDone } = useFetchAllData();

  useEffect(() => {
    changeKey(transformUrl(REPORT_STAFF_WITH_REVENUE, filter));
  }, [filter]);

  useUpdateEffect(() => {
    if (viewType === "listingByTime") return;

    if (!isPrinting) return;

    tableInstance.current && setUrl(tableInstance.current.url);
  }, [isPrinting, viewType]);

  useUpdateEffect(() => {
    if (viewType === "listingByTime") return;

    isDone && onIsDoneHandler();
  }, [isDone, viewType]);

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<REPORT_STAFF_WITH_REVENUE_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

  useUpdateEffect(() => {
    if (tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;
      setUrl(transformUrl(REPORT_STAFF_WITH_REVENUE, filter));
    }
  }, [filter]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    setViewType("general");
    setOwner(undefined);

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

  const onViewDetailHandler = useCallback((row: Row<REPORT_STAFF_WITH_REVENUE_ITEM>) => {
    const id = row.original.id;

    setOwner(id);

    setViewType("listingByTime");
  }, []);

  const columnFn = useMemo(() => {
    const viewType = props.viewType;

    if (viewType === "sale") {
      return StaffReportColumnBySale;
    } else if (viewType === "profit") {
      return StaffReportColumnByProfit;
    } else {
      return StaffReportColumnBySale;
    }
  }, [props.viewType]);

  const renderTotal = useMemo(() => {
    const viewType = props.viewType;

    if (data == undefined) return null;

    if (viewType === "sale") {
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
              fontWeight: 700,
            }}
          >
            {"SL người bán: "}

            <NumberFormat value={get(data, "count")} suffix="" />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_revenue_incl_tax"))} />
          </TableCell>
          {/* <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                (
                  parseFloat(get(data, "sum_revenue_incl_tax")) -
                  parseFloat(get(data, "sum_net_revenue_incl_tax"))
                ).toFixed(2)
              )}
            />
          </TableCell> */}
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
          <TableCell
            sx={{
              fontWeight: 700,
            }}
          >
            {"SL người bán: "}

            <NumberFormat value={get(data, "count")} suffix="" />
          </TableCell>
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
                  parseFloat(get(data, "sum_revenue_incl_tax")) -
                  parseFloat(get(data, "sum_net_revenue_incl_tax"))
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
                  parseFloat(get(data, "sum_net_revenue_incl_tax")) -
                  parseFloat(get(data, "sum_base_amount_incl_tax"))
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
    let component: React.ReactNode = null;

    if (data == undefined) {
      component = <Loading />;
    } else {
      component = (
        <Column
          onViewDetailHandler={onViewDetailHandler}
          type={_viewType}
          count={itemCount}
          isLoading={isLoading}
          data={dataTable ?? []}
          // dataTotal={[data] ?? []}
          dataTotal={data ? [data] : []}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
        />
        // <CompoundTableWithFunction<REPORT_STAFF_WITH_REVENUE_ITEM>
        //   url={transformUrl(REPORT_STAFF_WITH_REVENUE, filter)}
        //   columnFn={columnFn}
        //   passHandler={passHandler}
        //   onViewDetailHandler={onViewDetailHandler}
        //   renderBodyItem={(rows, tableInstance) => {
        //     if (rows == undefined) return null;

        //     return (
        //       <Fragment>
        //         {renderTotal}

        //         {rows.map((row, i) => {
        //           tableInstance.prepareRow(row);

        //           return (
        //             <TableRow {...row.getRowProps()}>
        //               {row.cells.map((cell) => {
        //                 return (
        //                   <TableCell
        //                     {...cell.getCellProps()}
        //                     {...(cell.column.colSpan && {
        //                       colSpan: cell.column.colSpan,
        //                     })}
        //                     sx={{
        //                       width: cell.column.width,
        //                       minWidth: cell.column.minWidth,
        //                       maxWidth: cell.column.maxWidth,
        //                     }}
        //                   >
        //                     {cell.render("Cell")}
        //                   </TableCell>
        //                 );
        //               })}
        //             </TableRow>
        //           );
        //         })}
        //       </Fragment>
        //     );
        //   }}
        // />
      );
    }

    return (
      <Fragment>
        <Box display={isPrinting ? "none" : "block"}>{component}</Box>

        {viewType === "general" && (
          <Box display={isPrinting ? "block" : "none"}>
            {isDone && (
              <TableView
                columns={columnFn()}
                data={reportDataForPrinting}
                prependChildren={renderTotal}
              />
            )}
          </Box>
        )}
      </Fragment>
    );
  } else if (viewType === "listingByTime" && owner) {
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
          owner={owner}
          filter={filter}
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
