import useSWR from "swr";
import get from "lodash/get";
import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useMeasure, useUpdateEffect } from "react-use";
import { useCallback, useRef, Fragment, useState, useMemo, useEffect } from "react";

import { alpha, Box, Stack } from "@mui/material";

import PartnerReportColumnByDebt from "./PartnerReportColumnByDebt";
import PartnerReportColumnByImport from "./PartnerReportColumnByImport";

import {
  TableRow,
  TableCell,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
  TableView,
} from "components/TableV2";

import { BackButton, LoadingDynamic as Loading, NumberFormat } from "components";

import {
  REPORT_PARTNER_WITH_DEBT_AMOUNT,
  REPORT_PARTNER_WITH_PURCHASE_AMOUNT,
} from "apis";
import {
  REPORT_PARTNER_WITH_DEBT_AMOUNT_ITEM,
  REPORT_PARTNER_WITH_PURCHASE_AMOUNT_ITEM,
} from "interfaces";

import { transformUrl } from "libs";
import { useFetch, useFetchAllData, useLayout } from "hooks";
import {
  ADMIN_REPORTS_PARTNER_WITH_DEBT_AMOUNT_END_POINT,
  ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT,
} from "__generated__/END_POINT";
import Column from "./Column";

const ListingInvoice = dynamic(() => import("./ListingInvoice"), {
  loading: Loading,
});

interface PartnerReportByTableProps {
  filter: Record<string, any>;
  viewType: "import" | "debt";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

type TView = "general" | "listingInvoice";

export const PartnerReportByTable = (props: PartnerReportByTableProps) => {
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

  const [partner, setPartner] = useState<REPORT_PARTNER_WITH_PURCHASE_AMOUNT_ITEM>();

  const [viewType, setViewType] = useState<TView>("general");

  const { data } = useSWR(() => {
    if (props.viewType === "import") {
      return transformUrl(ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT, {
        ...filter,
        page_size: 1,
        with_sum_purchase_amount_incl_tax: true,
        with_sum_return_amount_incl_tax: true,
      });
    }
  });

  const { data: partnerWithDebtRecordData } = useSWR(() => {
    if (props.viewType === "debt") {
      return transformUrl(ADMIN_REPORTS_PARTNER_WITH_DEBT_AMOUNT_END_POINT, {
        ...filter,
        page_size: 1,
        with_sum_beginning_debt_amount: true,
        with_sum_credit: true,
        with_sum_debit: true,
      });
    }
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<REPORT_PARTNER_WITH_PURCHASE_AMOUNT_ITEM>(
    transformUrl(ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT, filter)
  );
  const tableInstance = useRef<ExtendableTableInstanceProps<any>>();

  const { data: reportDataForPrinting, setUrl, isDone } = useFetchAllData();

  useEffect(() => {
    if (_viewType === "import") {
      changeKey(transformUrl(REPORT_PARTNER_WITH_PURCHASE_AMOUNT, filter));
    }
    if (_viewType === "debt") {
      changeKey(transformUrl(REPORT_PARTNER_WITH_DEBT_AMOUNT, filter));
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
    if (tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;

      if (viewType !== "general") return;

      if (props.viewType === "import") {
        setUrl(transformUrl(REPORT_PARTNER_WITH_PURCHASE_AMOUNT, filter));
      } else if (props.viewType === "debt") {
        setUrl(transformUrl(REPORT_PARTNER_WITH_DEBT_AMOUNT, filter));
      }
    }
  }, [filter, props.viewType]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    onBackToGeneralHandler();

    timer = setTimeout(() => {
      setReload(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [props.viewType]);

  const onViewDetailHandler = useCallback(
    (row: Row<REPORT_PARTNER_WITH_PURCHASE_AMOUNT_ITEM>) => {
      const partner = get(row, "original");
      setPartner(partner);
      setViewType("listingInvoice");
    },
    []
  );

  const onViewDetailHandler2 = useCallback((value) => {
    const partner = get(value, "original");
    setPartner(partner);
    setViewType("listingInvoice");
  }, []);

  const onBackToGeneralHandler = useCallback(() => {
    setViewType("general");
  }, []);

  const columnFn = useMemo(() => {
    const viewType = props.viewType;

    if (viewType === "import") {
      return PartnerReportColumnByImport;
    } else if (viewType === "debt") {
      return PartnerReportColumnByDebt;
    } else {
      return PartnerReportColumnByImport;
    }
  }, [props.viewType]);

  const renderTotal = useMemo(() => {
    const viewType = props.viewType;

    if (viewType === "import") {
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
            {"SL NCC: "}
            <NumberFormat value={get(data, "count")} suffix="" />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_purchase_amount_incl_tax"))} />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_return_amount_incl_tax"))} />
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
                  parseFloat(get(data, "sum_purchase_amount_incl_tax")) -
                  parseFloat(get(data, "sum_return_amount_incl_tax"))
                ).toFixed(2)
              )}
            />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "debt") {
      if (partnerWithDebtRecordData == undefined) return null;

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
            SL NCC:{" "}
            <NumberFormat value={get(partnerWithDebtRecordData, "count")} suffix="" />
          </TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                get(partnerWithDebtRecordData, "sum_beginning_debt_amount")
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
              value={parseFloat(get(partnerWithDebtRecordData, "sum_credit"))}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(get(partnerWithDebtRecordData, "sum_debit"))}
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
                    get(partnerWithDebtRecordData, "sum_beginning_debt_amount")
                  ) +
                  parseFloat(get(partnerWithDebtRecordData, "sum_credit")) -
                  parseFloat(get(partnerWithDebtRecordData, "sum_debit"))
                ).toFixed(2)
              )}
            />
          </TableCell>
        </TableRow>
      );
    }

    return null;
  }, [data, partnerWithDebtRecordData, props.viewType]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (reload) return <Loading />;

  if (viewType === "general") {
    let component: React.ReactNode = null;

    if (props.viewType === "import") {
      if (data == undefined && dataTable == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Fragment>
            <Column
              onViewDetailHandler={onViewDetailHandler}
              type={_viewType}
              count={itemCount}
              isLoading={isLoading}
              data={dataTable ?? []}
              dataTotal={data ? [data] : []}
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
            />
            {/* <CompoundTableWithFunction<REPORT_PARTNER_WITH_PURCHASE_AMOUNT_ITEM>
              url={transformUrl(REPORT_PARTNER_WITH_PURCHASE_AMOUNT, filter)}
              columnFn={columnFn}
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
          </Fragment>
        );
      }
    } else if (props.viewType === "debt") {
      if (partnerWithDebtRecordData == undefined && dataTable == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Fragment>
            <Column
              onViewDetailHandler={onViewDetailHandler}
              type={_viewType}
              count={itemCount}
              isLoading={isLoading}
              data={dataTable ?? []}
              // dataTotal={[partnerWithDebtRecordData] ?? []}
              dataTotal={partnerWithDebtRecordData ? [partnerWithDebtRecordData] : []}
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
            />
            {/* <CompoundTableWithFunction<REPORT_PARTNER_WITH_DEBT_AMOUNT_ITEM>
              url={transformUrl(REPORT_PARTNER_WITH_DEBT_AMOUNT, filter)}
              columnFn={columnFn}
              onViewDetailHandler={onViewDetailHandler}
              passHandler={passHandler}
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
          </Fragment>
        );
      }
    }

    return (
      <Fragment>
        <Box
          display={isPrinting ? "none" : "block"}
          // displayPrint="none"
        >
          {component}
        </Box>

        <Box display={isPrinting ? "block" : "block"}>
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
  } else if (viewType === "listingInvoice" && partner) {
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
          partner={partner}
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
