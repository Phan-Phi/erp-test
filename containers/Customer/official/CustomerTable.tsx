import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box, Icon, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";

import {
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
  WrapperTableHeaderCell,
} from "components/TableV3";
import { Link, NumberFormat, ViewButton } from "components";

import { useChoice } from "hooks";
import { CUSTOMERS, DETAIL } from "routes";
import { CommonTableProps } from "interfaces";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CustomerTableProps = CommonTableProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1>;

const CustomerTable = (props: CustomerTableProps) => {
  const {
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: <FormattedMessage id={`table.customerSid`} />,
        accessor: "customerSid",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.official_customer.sid");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.last_name`} />,
        accessor: "last_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.last_name");

          return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.first_name`} />,
        accessor: "first_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.first_name");

          return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.gender`} />,
        accessor: "gender",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;
          const { genders } = useChoice();

          const value = get(row, "original.gender");
          const displayValue = getDisplayValueFromChoiceItem(genders, value);

          return (
            <WrapperTableCell width={80}>
              {displayValue ? displayValue : "-"}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.birthday`} />,
        accessor: "birthday",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.official_customer.birthday");

          return (
            <WrapperTableCell width={120}>
              {value ? formatDate(value, "dd/MM/yyyy") : "-"}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.email`} />,
        accessor: "email",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.email") || "-";

          return <WrapperTableCell width={120}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (props) => {
          const { column } = props;

          return (
            <WrapperTableHeaderCell isSortBy column={column}>
              <FormattedMessage id={`table.total_debt_amount`} />
            </WrapperTableHeaderCell>
          );
        },
        accessor: "official_customer.total_debt_amount.incl_tax",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value =
            get(row, "original.official_customer.total_debt_amount.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.date_joined`} />,
        accessor: "date_joined",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.official_customer.date_joined");

          return (
            <WrapperTableCell>
              {value ? formatDate(value, "dd/MM/yyyy") : "-"}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.facebook`} />,
        accessor: "facebook",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.facebook");

          return (
            <WrapperTableCell>
              {value ? (
                <Link href={value}>
                  <Icon children={<FacebookIcon />} />
                </Link>
              ) : (
                "-"
              )}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.tax_identification_number`} />,
        accessor: "tax_identification_number",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.tax_identification_number") || "-";

          return <WrapperTableCell width={100}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.company_name`} />,
        accessor: "company_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.company_name") || "-";

          return <WrapperTableCell width={100}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.customerType`} />,
        accessor: "customerType",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.official_customer.type.name") || "-";

          return <WrapperTableCell width={150}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.sales_in_charge`} />,
        accessor: "sales_in_charge",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const firstName =
            get(row, "original.official_customer.sales_in_charge.first_name") || "";
          const lastName =
            get(row, "original.official_customer.sales_in_charge.last_name") || "";

          const fullName = `${lastName} ${firstName}`;

          return <WrapperTableCell>{fullName}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1} width={80}>
              <ViewButton href={`/${CUSTOMERS}/${DETAIL}/${row.original.id}`} />
            </Stack>
          );
        },

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

export default CustomerTable;
