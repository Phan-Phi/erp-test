import { FormattedMessage } from "react-intl";

import get from "lodash/get";

import { format, parseISO } from "date-fns";

import { Skeleton, Stack } from "@mui/material";

import { decorateSelection } from "libs/utils";
import { FormatNumber, IconButton } from "components";

export const keys = [
  "selection",
  "voucherName",
  "voucherCode",
  "discount_amount",
  "used",
  "usage_limit",
  "period",
  "action",
];

const columns = (loading) => {
  return keys.map((key, index) => {
    let column = {
      Header: <FormattedMessage id={`table.${key}`} />,
      accessor: key,
      disableSortBy: true,
      TableCellProps: {
        sx: {
          width: 150,
          minWidth: 150,
          maxWidth: 150,
        },
      },
    };

    if (key === "selection") {
      column = decorateSelection(column, loading);
    }

    if (key === "voucherCode") {
      column.TableCellProps = {
        sx: {
          width: 120,
          minWidth: 120,
          maxWidth: 120,
        },
      };

      column.Cell = ({ row }) => {
        const value = get(row, "original.code");

        return value ? value.toUpperCase() : "-";
      };
    }

    if (key === "voucherName") {
      column.TableCellProps = {
        sx: {
          width: "auto",
        },
      };

      column.Cell = ({ row }) => {
        const value = get(row, "original.name");

        return value || "-";
      };
    }

    if (key === "period") {
      column.TableCellProps = {
        sx: {
          width: 275,
          minWidth: 275,
          maxWidth: 275,
        },
      };

      column.Cell = ({ row }) => {
        let dateStart = get(row, "original.date_start");

        if (dateStart) {
          dateStart = format(parseISO(dateStart), "dd-MM-yyyy HH:mm");
        }

        let dateEnd = get(row, "original.date_end");

        if (dateEnd) {
          dateEnd = format(parseISO(dateEnd), "dd-MM-yyyy HH:mm");
        } else {
          dateEnd = "∞";
        }
        return `${dateStart} - ${dateEnd}`;
      };
    }

    if (["used", "usage_limit"].includes(key)) {
      if (key === "used") {
        column.TableCellProps = {
          sx: {
            width: 90,
            minWidth: 90,
            maxWidth: 90,
          },
        };
      } else if (key === "usage_limit") {
        column.TableCellProps = {
          sx: {
            width: 135,
            minWidth: 135,
            maxWidth: 135,
          },
        };
      }

      column.WrapperCellProps = {
        sx: {
          justifyContent: "flex-end",
        },
      };

      column.Cell = ({ row }) => {
        const value = get(row, `original.${key}`) || 0;

        return <FormatNumber children={value} suffix=" " />;
      };
    }

    if (key === "discount_amount") {
      column.TableCellProps = {
        sx: {
          width: 110,
          minWidth: 110,
          maxWidth: 110,
        },
      };

      column.WrapperCellProps = {
        sx: {
          justifyContent: "flex-end",
        },
      };

      column.Cell = ({ row }) => {
        const type = get(row, "original.discount_type");
        const value = get(row, "original.discount_amount");

        if (value) {
          return (
            <FormatNumber children={value} suffix={type === "Absolute" ? " ₫" : " %"} />
          );
        } else {
          return "-";
        }
      };
    }

    if (key === "action") {
      column.TableCellProps = {
        sx: {
          width: 100,
          minWidth: 100,
          maxWidth: 100,
        },
      };

      column.Cell = ({
        row,
        deleteHandler,
        deleteLoading,
        toggle,
        setMutationObj,
        writePermission,
      }) => {
        if (writePermission) {
          return (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                type="delete"
                disabled={!!deleteLoading[row.original.id]}
                loading={!!deleteLoading[row.original.id]}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(true);

                  setMutationObj((prev) => {
                    return {
                      ...prev,
                      state: {
                        deleteHandler: deleteHandler({
                          data: [row],
                        }),
                      },
                    };
                  });
                }}
              />
            </Stack>
          );
        } else {
          return null;
        }
      };
    }

    if (!column.Cell) {
      column.Cell = ({ cell }) => {
        return cell.value ? cell.value : "-";
      };
    }

    const proxyCell = column.Cell;

    column.Cell = (...props) => {
      if (loading) {
        return <Skeleton width="100%" />;
      }
      return proxyCell.apply(null, props);
    };

    return column;
  });
};

export default columns;
