import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box, MenuItem, Stack } from "@mui/material";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellForEdit,
} from "components/TableV3";

import {
  AddButton,
  CheckButton,
  DeleteButton,
  EditButton,
  NumberFormat,
  PrintButton,
  ViewButton,
} from "components";

import { useChoice } from "hooks";
import { CommonTableProps } from "interfaces";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type InvoiceTableProps = CommonTableProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1> &
  Record<string, any>;

const InvoiceTable = (props: InvoiceTableProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: <FormattedMessage id={`table.invoiceSid`} />,
        accessor: "invoiceSid",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.sid");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.date_created`} />,
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;
          const value = get(row, "original.date_created");

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.status`} />,
        accessor: "status",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;
          const { invoice_statuses } = useChoice();

          const value = get(row, "original.status");
          const displayValue = getDisplayValueFromChoiceItem(invoice_statuses, value);

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box minWidth={150}>
            <FormattedMessage id={`table.shipping_status`} />
          </Box>
        ),
        accessor: "shipping_status",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row, changeDeliveryStatusHandler, writePermission } = props;

          const { shipping_statuses, invoice_statuses } = useChoice();

          const id = get(row, "original.id");
          const currentInvoiceStatus: string = get(row, "original.status");
          const currentShippingStatus: string = get(row, "original.shipping_status");

          const indexOfCurrentInvoiceStatus = invoice_statuses.findIndex((el) => {
            return el[0] == currentInvoiceStatus;
          });

          if (currentInvoiceStatus === "Cancelled") {
            return getDisplayValueFromChoiceItem(
              shipping_statuses,
              currentShippingStatus
            );
          }

          if (currentShippingStatus === "Delivered") {
            return getDisplayValueFromChoiceItem(
              shipping_statuses,
              currentShippingStatus
            );
          }

          if (indexOfCurrentInvoiceStatus >= 2 && writePermission) {
            const indexOfCurerntShippingStatus = shipping_statuses.findIndex((el) => {
              return el[0] == currentShippingStatus;
            });

            const nextIndex = indexOfCurerntShippingStatus + 1;

            return (
              <TableCellForEdit
                inputType="select"
                renderItem={() => {
                  return shipping_statuses.map((el, idx) => {
                    let condition = idx !== nextIndex;

                    if (indexOfCurerntShippingStatus === 3) {
                      condition = true;
                    } else if (indexOfCurerntShippingStatus === 2) {
                      condition = idx <= 2;
                    }

                    return (
                      <MenuItem
                        disabled={condition}
                        value={el[0]}
                        key={el[0]}
                        children={el[1]}
                      />
                    );
                  });
                }}
                value={currentShippingStatus}
                onChange={(value) => {
                  changeDeliveryStatusHandler?.({
                    id,
                    status: value,
                  });
                }}
              />
            );
          } else {
            return getDisplayValueFromChoiceItem(
              shipping_statuses,
              currentShippingStatus
            );
          }
        },
        colSpan: 2,
      },
      {
        Header: (
          <Box minWidth={150}>
            <FormattedMessage id={`table.shipperName`} />
          </Box>
        ),
        accessor: "shipper_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.amount`} />
          </Box>
        ),
        accessor: "amount",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.amount.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.surcharge`} />
          </Box>
        ),
        accessor: "surcharge",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.surcharge.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <Box textAlign="right">Phí giao hàng có thuể</Box>,
        accessor: "shipping_charge_incl_tax",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.shipping_charge.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const {
            row,
            approveHandler,
            deleteHandler,
            writePermission,
            approvePermission,
            printInvoiceHandler,
            editInvoiceHandler,
            onMutateInvoiceLineHandler,
          } = props;

          const status = get(row, "original.status");
          const amount = get(row, "original.amount.incl_tax");

          return (
            <Stack flexDirection="row" columnGap={1} alignItems="center">
              {status === "Draft" ? (
                <AddButton
                  onClick={() => {
                    onMutateInvoiceLineHandler(row);
                  }}
                />
              ) : (
                <ViewButton
                  onClick={() => {
                    onMutateInvoiceLineHandler(row);
                  }}
                />
              )}

              <PrintButton
                onClick={(e) => {
                  e.stopPropagation();
                  printInvoiceHandler(row);
                }}
              />

              {status === "Draft" && writePermission && (
                <EditButton onClick={editInvoiceHandler(row)} />
              )}
              {status === "Draft" && approvePermission && (
                <CheckButton
                  // disabled={parseFloat(amount) === 0}
                  onClick={(e) => {
                    e.stopPropagation();

                    approveHandler({
                      data: [row],
                    });
                  }}
                />
              )}

              {status === "Draft" && writePermission && (
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler({
                      data: [row],
                    });
                  }}
                />
              )}
            </Stack>
          );
        },
        width: 300,
        maxWidth: 300,
        sticky: "right",
      },
    ];
  }, []);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy,
    useSticky
  );

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={renderHeaderContentForSelectedRow}
            />
          </TableHead>
          <TableBody>
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          count={count}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          onPageChange={(_, page) => {
            onPageChange(page);
          }}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
};

export default InvoiceTable;
