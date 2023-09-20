import { FormattedMessage } from "react-intl";

import get from "lodash/get";

import { Skeleton } from "@mui/material";

import { decorateSelection } from "libs/utils";

export const keys = ["selection", "productName"];

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

    if (key === "productName") {
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
