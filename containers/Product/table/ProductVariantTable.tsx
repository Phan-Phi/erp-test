import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import {
  alpha,
  Box,
  Stack,
  Button,
  Popover,
  IconButton,
  Typography,
} from "@mui/material";
import { get } from "lodash";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { bindPopover, bindTrigger } from "material-ui-popup-state/hooks";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
} from "components/TableV3";
import usePopover from "../components/usePopover";
import { NumberFormat, WrapperTable, DeleteButton, Link } from "components";

import { useRouter } from "next/router";
import { PRODUCTS, VARIANT } from "routes";
import { CommonTableProps } from "interfaces";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ProductVariantTableProps =
  CommonTableProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1> & Record<string, any>;

const ProductVariantTable = (props: ProductVariantTableProps) => {
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

  const router = useRouter();

  const columns = useMemo(() => {
    return [
      {
        Header: "",
        accessor: "id",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.id");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id="table.variantSku" />,
        accessor: "variantSku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.sku");

          let pathname = `/${PRODUCTS}/${router.query.id}/${VARIANT}/${row.values.id}`;

          return (
            <WrapperTableCell title={value}>
              <Link href={pathname}>{value}</Link>
            </WrapperTableCell>
          );
          //   return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id="table.variantName" />,
        accessor: "variantName",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const isDefault = get(row, "original.is_default");
          const value = get(row, "original.name");

          return (
            <WrapperTableCell columnGap={1}>
              {value}
              {isDefault && (
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ fontStyle: "italic" }}
                >
                  <FormattedMessage
                    id="product.defaultVariant"
                    defaultMessage={"Biến thể mặc định"}
                  />
                </Typography>
              )}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={150}>
            <FormattedMessage id={`table.price_incl_tax`} />
          </Box>
        ),
        accessor: "price_incl_tax",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.price_incl_tax.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box minWidth={100}>
            <FormattedMessage id={`table.action`} />
          </Box>
        ),
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission, deleteHandler, setDefaultVariantHandler } = props;

          const isDefault = get(row, "original.is_default");
          const id = get(row, "original.id");

          const popupState = usePopover({
            popupId: id,
          });

          const { onClick, ...rest } = bindTrigger(popupState);
          const { onClose, ...rest2 } = bindPopover(popupState);

          if (writePermission) {
            if (isDefault) {
              return null;
            }

            return (
              <Stack flexDirection="row" alignItems="center" columnGap={1}>
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler({
                      data: [row],
                    });
                  }}
                />

                <IconButton
                  {...rest}
                  children={<MoreVertIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(e);
                  }}
                />

                <Popover
                  {...rest2}
                  onClose={(e: React.SyntheticEvent) => {
                    e.stopPropagation();

                    onClose();
                  }}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Button
                    sx={{
                      color: "common.black",
                      backgroundColor: "common.white",
                      padding: 1,
                      ["&:hover"]: {
                        backgroundColor: ({ palette }) => {
                          return alpha(`${palette.common.white}`, 0.75);
                        },
                      },
                    }}
                    onClick={(e) => {
                      setDefaultVariantHandler({
                        data: row,
                        onClose,
                      })(e);
                    }}
                  >
                    <FormattedMessage
                      id="product.changeDefaultVariant"
                      defaultMessage={"Thay đổi biến thể mặc định"}
                    />
                  </Button>
                </Popover>
              </Stack>
            );
          } else {
            return null;
          }
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
      ...restProps,
    },
    useSortBy,
    useSticky
  );

  return (
    <WrapperTable>
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
      </TableContainer>
    </WrapperTable>
  );
};

export default ProductVariantTable;
