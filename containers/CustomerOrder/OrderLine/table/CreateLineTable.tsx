import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import { CellProps, useTable, useSortBy, useRowSelect } from "react-table";
import React, { Fragment, PropsWithChildren, useEffect, useMemo } from "react";

import { get } from "lodash";
import { compareAsc } from "date-fns";
import DynamicMessage from "messages";
import { Box, Stack, MenuItem, Typography } from "@mui/material";

import { ChoiceItem, Unit as IUnit, CommonTableProps } from "interfaces";

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
  TableHeaderForSelection,
  TableCellForSelection,
  TableCellForAvatar,
} from "components/TableV3";
import { AddButton, Link, NumberFormat } from "components";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CreateLineTableProps = CommonTableProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1> &
  Record<string, any>;

const CreateLineTable = (props: CreateLineTableProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    setListSelectedRow,
    ...restProps
  } = props;

  const { formatMessage } = useIntl();

  const columns = useMemo(() => {
    return [
      {
        accessor: "selection",
        Header: (props) => {
          const { getToggleAllRowsSelectedProps } = props;

          return (
            <TableHeaderForSelection
              getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps}
            />
          );
        },
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const availableForPurchase = get(
            row,
            "original.product.available_for_purchase"
          );

          const compareDate = compareAsc(new Date(availableForPurchase), new Date());

          return (
            <Fragment>
              <TableCellForSelection
                row={row}
                disabled={
                  availableForPurchase === null || compareDate === 1 ? true : false
                }
              />
            </Fragment>
          );
        },
        maxWidth: 64,
        width: 64,
      },
      {
        accessor: "primary_image",
        Header: "",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const image = get(row, "original.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: "Mã hàng",
        accessor: "editable_sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value, row } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "productName",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.name");

          const availableForPurchase = get(
            row,
            "original.product.available_for_purchase"
          );

          const compareDate = compareAsc(new Date(availableForPurchase), new Date());

          return (
            <WrapperTableCell>
              <Stack spacing="6px">
                <Link
                  href={"#"}
                  onClick={(e: React.SyntheticEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onGotoHandler?.(row);
                  }}
                >
                  {value}
                </Link>

                {availableForPurchase === null || compareDate === 1 ? (
                  <Typography
                    variant="subtitle2"
                    fontSize={12}
                  >{`(Sản phẩm tạm ngừng kinh doanh)`}</Typography>
                ) : null}
              </Stack>
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.price`} />
          </Box>
        ),
        accessor: "price",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, editData } = props;

          const id = get(row, "original.id");
          const value: string = get(row, "original.price.incl_tax") || "0";

          const selectedUnit = get(editData, `current.${id}.unit`);
          const extendUnit: IUnit[] = get(row, "original.units");

          const foundItem = extendUnit.find((el) => {
            return el.unit === selectedUnit;
          });

          if (foundItem) {
            const value = get(foundItem, "price.incl_tax") || "0";
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={value && parseFloat(value)} />
              </WrapperTableCell>
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={value && parseFloat(value)} />
              </WrapperTableCell>
            );
          }
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={150}>
            <FormattedMessage id={`table.available_quantity`} />
          </Box>
        ),
        accessor: "available_quantity_can_order",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, editData } = props;

          const id = get(row, "original.id");
          const quantity = get(row, "original.quantity");
          const allocatedQuantity = get(row, "original.allocated_quantity");

          const remainingQuantity = quantity - allocatedQuantity;

          let value: number;

          const mainUnit = get(row, "original.unit");
          let extendUnit: IUnit[] = get(row, "original.units");

          let mergeUnit = [
            {
              unit: mainUnit,
              multiply: 1,
            },
          ];

          extendUnit.forEach((el) => {
            mergeUnit.push({
              unit: el.unit,
              multiply: el.multiply,
            });
          });

          const selectedUnit = get(editData, `current.${id}.unit`);

          if (selectedUnit) {
            const unitObj = mergeUnit.find((el) => {
              return el.unit === selectedUnit;
            });

            if (unitObj) {
              value = Math.floor(remainingQuantity / unitObj.multiply);
            } else {
              value = remainingQuantity;
            }
          } else {
            value = remainingQuantity;
          }

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );

          // return (
          //   <WrapperTableCell loading={loading} textAlign="right">
          //     {quantity - allocatedQuantity}
          //   </WrapperTableCell>
          // );
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={150}>
            Số lượng có thể đặt
          </Box>
        ),
        accessor: "available_quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, editData } = props;

          const id = get(row, "original.id");
          const isTrackInventory = get(row, "original.track_inventory");
          const allocatedQuantity = get(row, "original.allocated_quantity");
          const quantity = get(row, "original.quantity");

          const remainingQuantity = quantity - allocatedQuantity;

          let value: number;

          if (!isTrackInventory) {
            return <WrapperTableCell textAlign="right">{"∞"}</WrapperTableCell>;
          }

          const mainUnit = get(row, "original.unit");
          let extendUnit: IUnit[] = get(row, "original.units");

          let mergeUnit = [
            {
              unit: mainUnit,
              multiply: 1,
            },
          ];

          extendUnit.forEach((el) => {
            mergeUnit.push({
              unit: el.unit,
              multiply: el.multiply,
            });
          });

          const selectedUnit = get(editData, `current.${id}.unit`);

          if (selectedUnit) {
            const unitObj = mergeUnit.find((el) => {
              return el.unit === selectedUnit;
            });

            if (unitObj) {
              value = Math.floor(remainingQuantity / unitObj.multiply);
            } else {
              value = remainingQuantity;
            }
          } else {
            value = remainingQuantity;
          }

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box minWidth={150}>
            <FormattedMessage id={`table.unit`} />
          </Box>
        ),
        accessor: "unit",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, editData, activeEditRowHandler } =
            props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const mainUnit = get(row, "original.unit");
          let extendUnit: IUnit[] = get(row, "original.units");

          let mergeUnit = [mainUnit];

          extendUnit.forEach((el) => {
            mergeUnit.push(el.unit);
          });

          if (get(mergeUnit, "length") <= 1) {
            return <WrapperTableCell>{get(mergeUnit, "[0]") || "-"}</WrapperTableCell>;
          }

          return (
            <TableCellForEdit
              {...{
                inputType: "select",
                renderItem() {
                  return mergeUnit.map((el) => {
                    return (
                      <MenuItem key={el} value={el}>
                        {el}
                      </MenuItem>
                    );
                  });
                },
                value: get(editData, `current.${id}.${columnId}`) || mainUnit,
                onChange(value) {
                  activeEditRowHandler(row)();

                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                },
              }}
            />
          );
        },
        colSpan: 3,
      },
      {
        Header: (
          <Box textAlign="right" minWidth={150}>
            <FormattedMessage id={`table.unit_quantity`} />
          </Box>
        ),
        accessor: "unit_quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, editData } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");

          const isTrackInventory = get(row, "original.track_inventory");
          const allocatedQuantity = get(row, "original.allocated_quantity");

          const quantity = get(row, "original.quantity");

          const remainingQuantity = quantity - allocatedQuantity;

          const mainUnit = get(row, "original.unit");

          let value: number;

          let extendUnit: IUnit[] = get(row, "original.units");

          let mergeUnit = [
            {
              unit: mainUnit,
              multiply: 1,
            },
          ];

          extendUnit.forEach((el) => {
            mergeUnit.push({
              unit: el.unit,
              multiply: el.multiply,
            });
          });

          const selectedUnit = get(editData, `current.${id}.unit`);

          if (selectedUnit) {
            const unitObj = mergeUnit.find((el) => {
              return el.unit === selectedUnit;
            });

            if (unitObj) {
              value = Math.floor(remainingQuantity / unitObj.multiply);
            } else {
              value = remainingQuantity;
            }
          } else {
            value = remainingQuantity;
          }

          return (
            <TableCellForEdit
              {...{
                inputType: "number",
                value: get(editData, `current.${id}.${columnId}`) || "",
                onChange: (value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                },
                NumberFormatProps: {
                  allowNegative: false,
                  suffix: "",
                  isAllowed: (values) => {
                    const { floatValue } = values;

                    if (!isTrackInventory) return true;
                    if (floatValue == undefined) return true;

                    if (floatValue > value) {
                      return false;
                    }

                    return true;
                  },
                },
              }}
            />
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.discount_type`} />,
        accessor: "discount_type",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, editData, activeEditRowHandler, updateEditRowDataHandler } =
            props;

          const discountType: ChoiceItem[] = props.discountType;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const defaultValue = get(discountType, "[0][0]");

          return (
            <TableCellForEdit
              {...{
                inputType: "select",
                renderItem() {
                  return discountType.map((el) => {
                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                },
                value: get(editData, `current.${id}.${columnId}`) || defaultValue,
                onChange(value) {
                  activeEditRowHandler?.(row)?.();
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                },
              }}
            />
          );
        },
      },
      {
        Header: (
          <Box minWidth={150} textAlign="right">
            <FormattedMessage id={`table.discount_amount`} />
          </Box>
        ),
        accessor: "discount_amount",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, editData } = props;

          const discountTypeList: ChoiceItem[] = props.discountType;
          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");

          let discountType = get(editData, `current.[${id}].discount_type`);
          const defaultDiscountType = get(discountTypeList, "[0][0]");

          if (!discountType) {
            discountType = defaultDiscountType;
          }

          return (
            <TableCellForEdit
              {...{
                inputType: "number",
                value: get(editData, `current.${id}.${columnId}`) || 0,
                onChange: (value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                },
                NumberFormatProps: {
                  allowNegative: false,
                  suffix: discountType === "Absolute" ? " ₫" : " %",
                },
              }}
            />
          );
        },
      },
      {
        Header: (
          <Box minWidth={80}>
            <FormattedMessage id={`table.action`} />
          </Box>
        ),
        accessor: "action",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, loading: addLoading, addHandler } = props;

          const id = get(row, "original.id");

          const availableForPurchase = get(
            row,
            "original.product.available_for_purchase"
          );

          const compareDate = compareAsc(new Date(availableForPurchase), new Date());

          return (
            <Stack columnGap={1} flexDirection="row" alignItems="center">
              {availableForPurchase === null || compareDate === 1 ? null : (
                <AddButton
                  disabled={!!addLoading[id]}
                  onClick={() => {
                    addHandler?.({ data: [row] });
                  }}
                />
              )}
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
      ...restProps,
    },
    useSortBy,
    useSticky,
    useRowSelect
  );

  useEffect(() => {
    const filterData = table.selectedFlatRows.filter((item) => {
      return item.original.product?.available_for_purchase !== null;
    });

    const filterDataOutDate = filterData.filter((item) => {
      const availableForPurchase = get(item, "original.product.available_for_purchase");

      const compareDate = compareAsc(new Date(availableForPurchase), new Date());

      return compareDate !== 1;
    });

    setListSelectedRow(filterDataOutDate);
  }, [table.selectedFlatRows.length]);

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                const filterDateIsNull = selectedRows.filter((item) => {
                  const availableForPurchase =
                    item.original.product.available_for_purchase;

                  return availableForPurchase !== null;
                });

                const filterOutDate = filterDateIsNull.filter((item) => {
                  const availableForPurchase =
                    item.original.product.available_for_purchase;

                  const compareDate = compareAsc(
                    new Date(availableForPurchase),
                    new Date()
                  );

                  return compareDate !== 1;
                });

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                      length: filterOutDate.length,
                    })}`}</Typography>
                  </Stack>
                );
              }}
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

export default CreateLineTable;
