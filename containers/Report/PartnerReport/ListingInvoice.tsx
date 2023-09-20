import useSWR from "swr";
import { useIntl } from "react-intl";
import { Row, TableInstance } from "react-table";
import React, { Fragment, useCallback, useEffect, useMemo, useRef } from "react";

import { alpha, Box, Skeleton } from "@mui/material";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import {
  TableRow,
  TableCell,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
  TableView,
} from "components/TableV2";

import { Loading, NoData, NumberFormat } from "components";

import ListingInvoiceColumnByDebt from "./ListingInvoiceColumnByDebt";
import ListingInvoiceColumnByImport from "./ListingInvoiceColumnByImport";

import {
  CASH_DEBT_RECORD_ITEM,
  REPORT_PARTNER_WITH_PURCHASE_AMOUNT_ITEM,
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM,
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER_ITEM,
} from "interfaces";

import {
  CASH_DEBT_RECORD,
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER,
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER,
} from "apis";

import { formatDate, transformUrl } from "libs";
import { useUpdateEffect } from "react-use";
import { useFetch, useFetchAllData } from "hooks";
import ColumnDetail from "./ColumnDetail";

interface ListingInvoiceProps {
  filter: Record<string, any>;
  viewType: "import" | "debt";
  partner: REPORT_PARTNER_WITH_PURCHASE_AMOUNT_ITEM;
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

const ListingInvoice = (props: ListingInvoiceProps) => {
  const {
    partner,
    filter,
    viewType,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { messages } = useIntl();

  const { data } = useSWR(() => {
    if (viewType === "import") {
      return transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER, {
        date_created_start: filter.date_start,
        date_created_end: filter.date_end,
        statuses: "Confirmed,Partial_paid,Paid,Over_paid",
        partner: partner.id,
        page_size: 1,
      });
    }
  });

  const { data: debtRecordData } = useSWR(() => {
    if (viewType === "debt") {
      return transformUrl(CASH_DEBT_RECORD, {
        creditor_id: partner.id,
        date_created_start: filter.date_start,
        date_created_end: filter.date_end,
        creditor_type: "partner.partner",
        page_size: 1,
      });
    }
  });

  const tableInstance = useRef<ExtendableTableInstanceProps<any>>();

  const { data: reportDataForPrinting, setUrl, isDone } = useFetchAllData();

  const {
    data: dataWarehouse,
    isLoading,
    itemCount,
  } = useFetch<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM>(
    transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER, {
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      statuses: "Confirmed,Partial_paid,Paid,Over_paid",
      partner: partner.id,
    })
  );

  const {
    data: dataCashDebt,
    isLoading: isLoadingCashDebt,
    itemCount: itemCountCashDebt,
    changeKey: changeKeyCashDebt,
  } = useFetch<CASH_DEBT_RECORD_ITEM>(
    transformUrl(CASH_DEBT_RECORD, {
      creditor_id: partner.id,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      creditor_type: "partner.partner",
    })
  );

  // useEffect(() => {
  //   changeKeyCashDebt(
  //     transformUrl(CASH_DEBT_RECORD, {
  //       creditor_id: partner.id,
  //       date_created_start: filter.date_start,
  //       date_created_end: filter.date_end,
  //       creditor_type: "partner.partner",
  //     })
  //   );
  // }, [filter]);
  useUpdateEffect(() => {
    if (!isPrinting) return;

    tableInstance.current && setUrl(tableInstance.current.url);
  }, [isPrinting]);

  useUpdateEffect(() => {
    isDone && onIsDoneHandler();
  }, [isDone]);

  const passHandler = useCallback((_tableInstance: ExtendableTableInstanceProps<any>) => {
    tableInstance.current = _tableInstance;
  }, []);

  useUpdateEffect(() => {
    if (tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;

      if (viewType === "import") {
        setUrl(
          transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER, {
            date_created_start: filter.date_start,
            date_created_end: filter.date_end,
            statuses: "Confirmed,Partial_paid,Paid,Over_paid",
            partner: partner.id,
          })
        );
      }

      if (viewType === "debt") {
        setUrl(
          transformUrl(CASH_DEBT_RECORD, {
            creditor_id: partner.id,
            date_created_start: filter.date_start,
            date_created_end: filter.date_end,
            creditor_type: "partner.partner",
          })
        );
      }
    }
  }, [filter]);

  const columnFn = useMemo(() => {
    if (viewType === "import") {
      return ListingInvoiceColumnByImport;
    } else if (viewType === "debt") {
      return ListingInvoiceColumnByDebt;
    } else {
      return ListingInvoiceColumnByImport;
    }
  }, [viewType]);

  const renderTotal = useMemo(() => {
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
            colSpan={3}
          >
            {"SL giao dịch: "}
            <NumberFormat value={get(data, "count")} suffix="" />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(partner, "purchase_amount.incl_tax"))} />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(partner, "return_amount.incl_tax"))} />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "debt") {
      if (debtRecordData == undefined) return null;
      return (
        <Fragment>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              {get(filter, "date_start") && formatDate(get(filter, "date_start") * 1000)}
            </TableCell>
            <TableCell>Dư nợ đầu kỳ</TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                textAlign: "right",
              }}
            >
              0
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                textAlign: "right",
              }}
            >
              <NumberFormat
                value={parseFloat(get(partner, "beginning_debt_amount.incl_tax"))}
              />
            </TableCell>
          </TableRow>

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
              colSpan={5}
            >
              {"SL giao dịch: "}
              <NumberFormat value={get(debtRecordData, "count")} suffix="" />
            </TableCell>
          </TableRow>
        </Fragment>
      );
    }

    return null;
  }, [data, viewType, partner, debtRecordData]);

  const renderReturnOrder = useCallback(
    (
      row: Row<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM>,
      tableInstance: TableInstance,
      filter: Record<string, any>
    ) => {
      return <SubRow {...{ row, tableInstance, filter }} />;
    },
    []
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  let component: React.ReactNode = null;

  if (viewType === "import") {
    component = (
      <CompoundTableWithFunction<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM>
        url={transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER, {
          date_created_start: filter.date_start,
          date_created_end: filter.date_end,
          statuses: "Confirmed,Partial_paid,Paid,Over_paid",
          partner: partner.id,
        })}
        columnFn={columnFn}
        passHandler={passHandler}
        filter={filter}
        renderBodyItem={(rows, tableInstance) => {
          if (rows == undefined) return null;

          return (
            <Fragment>
              {renderTotal}

              {rows.map((row) => {
                tableInstance.prepareRow(row);

                const rowProps = row.getRowProps();

                return (
                  <Fragment key={rowProps.key}>
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
                    {row.isExpanded
                      ? renderReturnOrder(row, tableInstance, filter)
                      : null}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        }}
      />
    );
  }

  if (viewType === "debt") {
    if (debtRecordData == undefined && dataCashDebt == undefined) {
      component = <Loading />;
    } else {
      component = (
        <Fragment>
          <ColumnDetail
            partner={partner}
            filter={filter}
            type={viewType}
            count={itemCountCashDebt}
            isLoading={isLoadingCashDebt}
            // data={dataTable ?? []}
            data={dataCashDebt ? dataCashDebt : []}
            dataTotal={debtRecordData ? [debtRecordData] : []}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            // maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
          />
          <CompoundTableWithFunction<CASH_DEBT_RECORD_ITEM>
            url={transformUrl(CASH_DEBT_RECORD, {
              creditor_id: partner.id,
              date_created_start: filter.date_start,
              date_created_end: filter.date_end,
              creditor_type: "partner.partner",
            })}
            columnFn={columnFn}
            passHandler={passHandler}
            messages={messages}
            renderBodyItem={(rows, tableInstance) => {
              if (rows == undefined) return null;

              return (
                <Fragment>
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

                  {renderTotal}
                </Fragment>
              );
            }}
          />
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

      <Box display={isPrinting ? "block" : "none"}>
        {isDone && (
          <TableView
            columns={columnFn()}
            data={reportDataForPrinting}
            prependChildren={viewType === "import" && renderTotal}
            appendChildren={viewType === "debt" && renderTotal}
          />
        )}
      </Box>
    </Fragment>
  );
};

export default ListingInvoice;

const SubRow = ({
  row,
  tableInstance,
  filter,
}: {
  row: Row<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM>;
  tableInstance: TableInstance<any>;
  filter: Record<string, any>;
}) => {
  const { data } = useSWR<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER_ITEM[]>(
    transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER, {
      order: row.original.id,
      status: "Confirmed",
      get_all: true,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
    })
  );

  if (data == undefined) {
    return (
      <TableRow>
        {tableInstance.visibleColumns.map((el, i) => {
          return (
            <TableCell key={i}>
              <Skeleton />
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  if (isEmpty(data)) {
    return (
      <TableRow>
        <TableCell colSpan={tableInstance.visibleColumns.length}>
          <NoData />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Fragment>
      <TableRow>
        <TableCell
          sx={{
            fontWeight: 700,
          }}
        >
          Mã phiếu trả hàng
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 700,
          }}
        >
          Ngày tạo
        </TableCell>
        <TableCell
          sx={{
            textAlign: "right",
            fontWeight: 700,
          }}
        >
          SL trả
        </TableCell>
        <TableCell
          colSpan={2}
          sx={{
            textAlign: "right",
            fontWeight: 700,
          }}
        >
          Giá trị trả
        </TableCell>
      </TableRow>

      {data.map((el) => {
        return (
          <TableRow key={el.id}>
            <TableCell>{el.sid}</TableCell>
            <TableCell>{formatDate(el.date_created)}</TableCell>
            <TableCell
              sx={{
                textAlign: "right",
              }}
            >
              <NumberFormat value={el.item_count} suffix="" />
            </TableCell>
            <TableCell
              colSpan={2}
              sx={{
                textAlign: "right",
              }}
            >
              <NumberFormat value={parseFloat(el.amount.incl_tax)} />
            </TableCell>
          </TableRow>
        );
      })}
    </Fragment>
  );
};
