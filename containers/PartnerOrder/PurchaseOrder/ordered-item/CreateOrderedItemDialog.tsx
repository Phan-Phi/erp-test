import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useState, useCallback, Fragment, useEffect, useMemo } from "react";

import { cloneDeep, get } from "lodash";
import { Stack, Box } from "@mui/material";

import CreateOrderedItemTable from "../table/CreateOrderedItemTable";
import {
  LoadingButton,
  Dialog,
  BackButton,
  SearchField,
  LoadingDynamic as Loading,
} from "components";

import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { useFetch, useNotification } from "hooks";
import { PURCHASE_ORDER_TYPE_EXTENDS } from "../EditPurchaseOrder";
import { createRequest, transformUrl, checkResArr, setFilterValue } from "libs";

import {
  ADMIN_PARTNERS_ITEMS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

export type CreateOrderItemDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  partner: number | undefined;
  not_in_purchase_order: string | undefined;
  search: string;
  nested_depth: number;
};

const defaultFilterValue: CreateOrderItemDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  partner: undefined,
  not_in_purchase_order: undefined,
  search: "",
  nested_depth: 3,
};

interface CreateOrderItemDialogProps {
  open: boolean;
  toggle: (newValue: boolean) => void;
  data: PURCHASE_ORDER_TYPE_EXTENDS;
  onSuccessHandler: () => Promise<void>;
}

const CreateOrderItemDialog = ({
  open,
  toggle,
  data,
  onSuccessHandler,
}: CreateOrderItemDialogProps) => {
  const router = useRouter();
  const { formatMessage, messages } = useIntl();
  const [addLoading, setAddLoading] = useState({});
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const partnerId = get(data, "partner.id");
  const [listSelectedRow, setListSelectedRow] = useState<any>([]);

  const [filter, setFilter] =
    useState<CreateOrderItemDialogFilterType>(defaultFilterValue);

  const {
    data: dataTable,
    changeKey,
    itemCount,
    isLoading,
    refreshData,
  } = useFetch<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1>(
    transformUrl(ADMIN_PARTNERS_ITEMS_END_POINT, {
      ...filter,
      partner: partnerId,
      not_in_purchase_order: router.query.id,
    })
  );

  useEffect(() => {
    if (partnerId && router.query.id) {
      changeKey(
        transformUrl(ADMIN_PARTNERS_ITEMS_END_POINT, {
          ...defaultFilterValue,
          partner: partnerId,
          not_in_purchase_order: router.query.id,
        })
      );
    }
  }, [router.query.id, partnerId]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_PARTNERS_ITEMS_END_POINT, {
            ...cloneFilter,
            partner: partnerId,
            not_in_purchase_order: router.query.id,
          })
        );
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

  const addHandler = useCallback(async ({ data }: { data: Row<{ id: number }>[] }) => {
    let bodyList: any[] = [];
    let trueLoadingList = {};
    let falseLoadingList = {};

    data.forEach((el) => {
      const id = el.original.id;

      falseLoadingList[id] = false;
      trueLoadingList[id] = true;

      const originalData = el.original;
      const variantId = get(originalData, "variant.id");

      bodyList.push({
        ...ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_POST_DEFAULT_VALUE,
        variant: variantId,
        order: router.query.id,
      });
    });

    setAddLoading((prev) => {
      return {
        ...prev,
        ...trueLoadingList,
        all: true,
      };
    });

    try {
      const results = await createRequest(
        ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT,
        bodyList
      );
      const result = checkResArr(results);

      if (result) {
        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.addSuccessfully, {
            content: "sản phẩm",
          })
        );

        refreshData();

        await onSuccessHandler();
      }
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      setAddLoading((prev) => {
        return {
          ...prev,
          ...falseLoadingList,
          all: false,
        };
      });
    }
  }, []);

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.variant.product");

      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    },
    []
  );

  if (dataTable == undefined) return <Loading />;

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
              width: "90vw",
              maxWidth: "90vw",
              maxHeight: "90vh",
            },
          },
        },
        DialogTitleProps: {
          children: messages["addProduct"],
        },

        dialogContentTextComponent: () => {
          return (
            <Stack spacing={2}>
              <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              />

              <CreateOrderedItemTable
                data={dataTable ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                onGotoHandler={onGotoHandler}
                writePermission={true}
                loading={addLoading}
                addHandler={addHandler}
                maxHeight="70vh"
                setListSelectedRow={setListSelectedRow}
              />

              <Box padding="10px" />
            </Stack>
          );
        },
        DialogActionsProps: {
          children: (
            <Fragment>
              <BackButton
                disabled={!!addLoading["all"]}
                onClick={() => {
                  toggle(false);
                }}
              />

              <LoadingButton
                disabled={!!addLoading["all"]}
                loading={!!addLoading["all"]}
                onClick={() => {
                  if (listSelectedRow.length > 0) {
                    addHandler({ data: listSelectedRow as any[] });
                  }
                }}
              >
                {messages["addProduct"]}
              </LoadingButton>
            </Fragment>
          ),
        },
      }}
    />
  );
};

export default CreateOrderItemDialog;
