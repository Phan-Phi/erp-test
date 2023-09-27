import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import CircleIcon from "@mui/icons-material/Circle";
import { useTable, useSortBy, CellProps } from "react-table";
import { useMemo, PropsWithChildren, Fragment } from "react";

import {
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
} from "components/TableV3";

import { useChoice } from "hooks";
import { CASHES, EDIT } from "routes";
import { CommonTableProps } from "interfaces";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { CheckButton, DeleteButton, Link, NumberFormat, ViewButton } from "components";

type SaleReportColumnProps = CommonTableProps<ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1> &
  Record<string, any>;

export default function SaleReportColumn(props: SaleReportColumnProps) {
  const {
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    onViewHandler,
    TableRowProps,
    permission,
    approveHandler,
    deleteHandler,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: <FormattedMessage id={`table.transactionSId`} />,
        accessor: "transactionSId",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.sid");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.date_created`} />,
        accessor: "date_created",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.date_created");

          return <WrapperTableCell>{formatDate(value) || "-"}</WrapperTableCell>;
        },
        // maxWidth: 300,
      },

      {
        Header: <FormattedMessage id={`table.status`} />,
        accessor: "status",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          const { transaction_statuses } = useChoice();

          const value = get(row, "original.status");
          const displayValue = getDisplayValueFromChoiceItem(transaction_statuses, value);

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.transactionType`} />,
        accessor: "transactionType",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.type.name");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`filterFlowType`} />,
        accessor: "flow_type",

        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          const { transaction_flow_types } = useChoice();

          const value = get(row, "original.flow_type");
          const displayValue = getDisplayValueFromChoiceItem(
            transaction_flow_types,
            value
          );

          return <WrapperTableCell minWidth={70}>{displayValue}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`filterPaymentMethod`} />,
        accessor: "payment_method_name",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { value } = props;

          return <WrapperTableCell minWidth={170}>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.target_name`} />,
        accessor: "target_name",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.target_name");

          return (
            <WrapperTableCell minWidth={170}>
              {value ? (
                <Link
                  href={"#"}
                  onClick={(e: React.SyntheticEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onViewHandler?.(row);
                  }}
                >
                  {value}
                </Link>
              ) : (
                "-"
              )}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.affect_creditor`} />,
        accessor: "affect_creditor",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.affect_creditor");

          let color = value ? "rgb(115,214,115)" : "rgb(88,91,100)";

          return (
            <WrapperTableCell minWidth={130}>
              <CircleIcon
                sx={{
                  color,
                }}
                fontSize="small"
              />
            </WrapperTableCell>
          );
        },
        minWidth: "160px",
      },

      {
        Header: <FormattedMessage id={`table.amount`} />,
        accessor: "amount",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.amount.incl_tax") || "0";

          return (
            <WrapperTableCell justifyContent="flex-end">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const status = get(row, "original.status");

          return (
            <Stack columnGap={1} flexDirection="row" alignItems="center">
              <ViewButton href={`/${CASHES}/${EDIT}/${row.original.id}`} />

              {permission.writePermission &&
                permission.approvePermission &&
                status === "Draft" && (
                  <Fragment>
                    <CheckButton
                      onClick={(e) => {
                        e.stopPropagation();
                        approveHandler({
                          data: [row],
                        });
                      }}
                    />

                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHandler({
                          data: [row],
                        });
                      }}
                    />
                  </Fragment>
                )}
            </Stack>
          );
        },
        maxWidth: 180,
        width: 180,
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
            <RenderHeader table={table} />
          </TableHead>
          <TableBody>
            <RenderBody
              // TableRowProps={TableRowProps}
              // onView={onViewHandler}
              loading={isLoading}
              table={table}
            />
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          count={count}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
}
