import { FormattedMessage } from "react-intl";

import get from "lodash/get";

import { Skeleton, Stack } from "@mui/material";

import { decorateSelection, decorateProductAvatar } from "libs/utils";

import { IconButton } from "components";

export const keys = [
  "selection",
  "product_image",
  "productName",
  "productClassName",
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

    if (key === "product_image") {
      column = decorateProductAvatar(
        column,
        "original.product.primary_image.product_small_2x"
      );
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
                disabled={!!deleteLoading[row.original.id]}
                loading={!!deleteLoading[row.original.id]}
                type="delete"
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

    if (key === "selection") {
      column = decorateSelection(column, loading);
    }

    if (key === "productName") {
      column.TableCellProps = {
        sx: {
          width: "auto",
        },
      };

      column.Cell = ({ row }) => {
        let value = get(row, "original.variant.name") || "-";

        return value;
      };
    }

    if (key === "productClassName") {
      column.Cell = ({ row }) => {
        let value = get(row, "original.variant.product.product_class.name") || "-";

        return value;
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
