import useSWR from "swr";
import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useUpdateEffect } from "react-use";
import { useCallback, useRef, Fragment, useState, useMemo, useEffect } from "react";

import { alpha, Box, Stack } from "@mui/material";

import get from "lodash/get";

import CustomerReportColumnByDebt from "./CustomerReportColumnByDebt";
import CustomerReportColumnBySale from "./CustomerReportColumnBySale";
import CustomerReportColumnByProfit from "./CustomerReportColumnByProfit";

import {
  TableRow,
  TableCell,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
  TableView,
} from "components/TableV2";

import { setFilterValue, transformUrl } from "libs";
import { BackButton, LoadingDynamic as Loading, NumberFormat } from "components";
import { REPORT_CUSTOMER_WITH_REVENUE, REPORT_CUSTOMER_WITH_DEBT_AMOUNT } from "apis";

import {
  REPORT_CUSTOMER_WITH_REVENUE_ITEM,
  REPORT_CUSTOMER_WITH_DEBT_AMOUNT_ITEM,
} from "interfaces";
import { useFetch, useFetchAllData } from "hooks";
import Column from "./Column";
import { cloneDeep } from "lodash";

const ListingInvoice = dynamic(() => import("./ListingInvoice"), {
  loading: Loading,
});

interface SaleReportByTableProps {
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "debt";
  isPrinting: boolean;
  onPageChange: any;
  onPageSizeChange: any;
  onIsDoneHandler: () => void;
}

type ViewType = "general" | "listingInvoice";

export const CustomerReportByTable = (props: SaleReportByTableProps) => {
  const {
    filter,
    isPrinting,
    onIsDoneHandler,
    viewType: _viewType,
    onPageSizeChange,
    onPageChange,
  } = props;

  const [reload, setReload] = useState(false);

  const [receiver, setReceiver] = useState<number>();
  const [beginningDebtAmount, setBeginningDebtAmount] = useState<number>();

  const [viewType, setViewType] = useState<ViewType>("general");

  const { data } = useSWR(() => {
    if (props.viewType === "profit" || props.viewType === "sale") {
      return transformUrl(REPORT_CUSTOMER_WITH_REVENUE, {
        ...filter,
        with_sum_net_revenue_incl_tax: true,
        with_sum_revenue_incl_tax: true,
        with_sum_base_amount_incl_tax: true,
        page_size: 1,
      });
    }
  });

  const { data: customerWithDebtAmountdata } = useSWR(() => {
    if (props.viewType === "debt") {
      return transformUrl(REPORT_CUSTOMER_WITH_DEBT_AMOUNT, {
        ...filter,
        with_sum_credit: true,
        with_sum_debit: true,
        with_sum_beginning_debt_amount: true,
        page_size: 1,
      });
    }
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<any>(transformUrl(REPORT_CUSTOMER_WITH_REVENUE, filter));

  const tableInstance = useRef<ExtendableTableInstanceProps<any>>();

  const { data: reportDataForPrinting, setUrl, isDone } = useFetchAllData();

  useEffect(() => {
    if (_viewType === "sale" || _viewType === "profit") {
      changeKey(transformUrl(REPORT_CUSTOMER_WITH_REVENUE, filter));
    }

    if (_viewType === "debt") {
      changeKey(transformUrl(REPORT_CUSTOMER_WITH_DEBT_AMOUNT, filter));
    }
  }, [filter, _viewType]);

  useUpdateEffect(() => {
    if (viewType === "listingInvoice") return;

    if (!isPrinting) return;

    tableInstance.current && setUrl(tableInstance.current.url);
  }, [isPrinting, viewType]);

  useUpdateEffect(() => {
    if (viewType === "listingInvoice") return;

    isDone && onIsDoneHandler();
  }, [isDone, viewType]);

  const passHandler = useCallback((_tableInstance: ExtendableTableInstanceProps<any>) => {
    tableInstance.current = _tableInstance;
  }, []);

  useUpdateEffect(() => {
    if (viewType === "general" && tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;

      if (props.viewType === "sale" || props.viewType === "profit") {
        setUrl(transformUrl(REPORT_CUSTOMER_WITH_REVENUE, filter));
      } else if (props.viewType === "debt") {
        setUrl(transformUrl(REPORT_CUSTOMER_WITH_DEBT_AMOUNT, filter));
      }
    }
  }, [filter]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    setViewType("general");
    setReceiver(undefined);
    setBeginningDebtAmount(undefined);

    timer = setTimeout(() => {
      setReload(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [props.viewType]);

  const onViewDetailHandler = useCallback(
    (row: Row<REPORT_CUSTOMER_WITH_REVENUE_ITEM>) => {
      const receiverId = row.original.id;

      const beginningDebtAmount = parseFloat(
        get(row, "original.beginning_debt_amount.incl_tax")
      );

      setBeginningDebtAmount(beginningDebtAmount);

      setReceiver(receiverId);

      setViewType("listingInvoice");
    },
    []
  );

  const onBackToGeneralHandler = useCallback(() => {
    setViewType("general");
  }, []);

  const columnFn = useMemo(() => {
    const viewType = props.viewType;

    if (viewType === "sale") {
      return CustomerReportColumnBySale;
    } else if (viewType === "profit") {
      return CustomerReportColumnByProfit;
    } else if (viewType === "debt") {
      return CustomerReportColumnByDebt;
    } else {
      return CustomerReportColumnBySale;
    }
  }, [props.viewType]);

  const renderTotal = useMemo(() => {
    const viewType = props.viewType;

    if (viewType === "sale") {
      if (data == undefined) return null;

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
            {"SL khách hàng: "}
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
                  get(data, "sum_revenue_incl_tax") -
                  get(data, "sum_net_revenue_incl_tax")
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
      if (data == undefined) return null;

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
            {"SL khách hàng: "}
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
    } else if (viewType === "debt") {
      if (customerWithDebtAmountdata == undefined) return null;

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
            {"SL khách hàng: "}
            <NumberFormat value={get(customerWithDebtAmountdata, "count")} suffix="" />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                get(customerWithDebtAmountdata, "sum_beginning_debt_amount")
              )}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(get(customerWithDebtAmountdata, "sum_credit"))}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(get(customerWithDebtAmountdata, "sum_debit"))}
            />
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
                  parseFloat(
                    get(customerWithDebtAmountdata, "sum_beginning_debt_amount")
                  ) +
                  parseFloat(get(customerWithDebtAmountdata, "sum_credit")) -
                  parseFloat(get(customerWithDebtAmountdata, "sum_debit"))
                ).toFixed(2)
              )}
            />
          </TableCell>
        </TableRow>
      );
    }

    return null;
  }, [data, customerWithDebtAmountdata, props.viewType]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (reload) return <Loading />;

  if (viewType === "general") {
    let component: React.ReactNode = null;

    if (props.viewType === "sale" || props.viewType === "profit") {
      if (data == undefined && dataTable == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Column
            type={_viewType}
            count={itemCount}
            isLoading={isLoading}
            data={dataTable ?? []}
            // dataTotal={[data] ?? []}
            dataTotal={data ? [data] : []}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onViewDetailHandler={onViewDetailHandler}
          />
          // <CompoundTableWithFunction<REPORT_CUSTOMER_WITH_REVENUE_ITEM>
          //   url={transformUrl(REPORT_CUSTOMER_WITH_REVENUE, filter)}
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
    } else if (props.viewType === "debt") {
      if (customerWithDebtAmountdata == undefined && dataTable == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Column
            type={_viewType}
            count={itemCount}
            isLoading={isLoading}
            data={dataTable ?? []}
            dataTotal={customerWithDebtAmountdata ? [customerWithDebtAmountdata] : []}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onViewDetailHandler={onViewDetailHandler}
            // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
          />
          // <CompoundTableWithFunction<REPORT_CUSTOMER_WITH_DEBT_AMOUNT_ITEM>
          //   url={transformUrl(REPORT_CUSTOMER_WITH_DEBT_AMOUNT, filter)}
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
    }

    return (
      <Fragment>
        <Box display={isPrinting ? "none" : "block"}>{component}</Box>

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
  } else if (
    viewType === "listingInvoice" &&
    receiver != undefined &&
    beginningDebtAmount != undefined
  ) {
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
          filter={filter}
          receiver={receiver}
          viewType={props.viewType}
          beginningDebtAmount={beginningDebtAmount}
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
