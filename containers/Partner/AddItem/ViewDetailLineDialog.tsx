import { Row } from "react-table";
import { PRODUCTS } from "routes";
import { useIntl } from "react-intl";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { Box } from "@mui/material";
import { get, cloneDeep } from "lodash";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";

import { Dialog, BackButton } from "components";
import ViewPurchaseOrderLineTable from "./table/ViewPurchaseOrderLineTable";

export type ViewDetailLineDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
};

const defaultFilterValue: ViewDetailLineDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
};

const ViewDetailLineDialog = ({ open, toggle, url }) => {
  const { messages } = useIntl();

  const [filter, setFilter] =
    useState<ViewDetailLineDialogFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch(transformUrl(url, filter));

  useEffect(() => {
    if (url) {
      changeKey(transformUrl(url, defaultFilterValue));
    }
  }, [url]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(transformUrl(url, cloneFilter));
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const onGotoHandler = useCallback((data: Row<any>) => {
    let productId =
      get(data, "original.line.variant.product") ||
      get(data, "original.variant.product.id") ||
      get(data, "original.receipt_order_quantity.line.variant.product");

    window.open(`/${PRODUCTS}/${productId}`, "_blank");
  }, []);

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          toggle(false);
        },
        DialogProps: {
          PaperProps: {
            sx: {
              minWidth: "50vw",
              maxWidth: "85vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["listingProduct"],
        },

        renderDialogContentText: () => {
          return (
            <Fragment>
              <ViewPurchaseOrderLineTable
                data={data ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                onGotoHandler={onGotoHandler}
              />

              <Box padding="10px" />
            </Fragment>
          );
        },

        DialogActionsProps: {
          children: (
            <BackButton
              onClick={() => {
                toggle(false);
              }}
            />
          ),
        },
      }}
    />
  );
};

export default ViewDetailLineDialog;
