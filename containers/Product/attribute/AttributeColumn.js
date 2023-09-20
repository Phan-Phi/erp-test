import { FormattedMessage } from "react-intl";

import get from "lodash/get";

import { Stack, Skeleton } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { decorateSelection } from "libs/utils";

import { IconButton } from "components";

export const keys = [
  "selection",
  "attributeName",
  "input_type",
  "is_variant_only",
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
      column = decorateSelection(column);
    }

    if (key === "action") {
      column.TableCellProps = {
        sx: {
          width: 100,
          minWidth: 100,
          maxWidth: 100,
        },
      };

      column.Cell = ({ row, deleteLoading, deleteHandler, writePermission }) => {
        const isUsed = get(row, "original.is_used");

        if (writePermission) {
          return (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!isUsed && (
                <IconButton
                  type="delete"
                  loading={!!deleteLoading[row.original.id]}
                  disabled={!!deleteLoading[row.original.id]}
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
        } else {
          return null;
        }
      };
    }

    if (key === "attributeName") {
      column.TableCellProps = {
        sx: {
          width: "auto",
        },
      };

      column.Cell = ({ row }) => {
        return get(row, "original.name") || "-";
      };
    }

    if (key === "is_variant_only") {
      column.TableCellProps = {
        sx: {
          width: 100,
          minWidth: 100,
          maxWidth: 100,
        },
      };

      column.Cell = ({ cell }) => {
        if (cell.value) {
          return <CheckIcon />;
        } else {
          return <CloseIcon />;
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
