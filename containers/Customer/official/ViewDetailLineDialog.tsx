import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep, get } from "lodash";

import { Dialog, BackButton } from "components";
import InvoiceLineTable from "./InvoiceLineTable";

import { useFetch } from "hooks";
import { PRODUCTS } from "routes";
import { setFilterValue, transformUrl } from "libs";

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
    changeKey(transformUrl(url, filter));
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
    const productId = get(data, "original.line.variant.product");

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
              width: "75vw",
              maxWidth: "85vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["listingProduct"],
        },
        renderDialogContentText: () => {
          return (
            <InvoiceLineTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              onGotoHandler={onGotoHandler}
              maxHeight={300}
            />
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
