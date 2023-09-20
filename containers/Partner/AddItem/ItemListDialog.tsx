import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useCallback, useState, useContext, useEffect, useMemo } from "react";

import { get, cloneDeep } from "lodash";
import { Stack, Box } from "@mui/material";

import ItemTable from "./table/ItemTable";
import { Dialog, BackButton, LoadingButton, SearchField, WrapperTable } from "components";

import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { PartnerItemContext } from "./context";

import { usePermission, useNotification, useFetch } from "hooks";
import { transformUrl, checkResArr, createRequest, setFilterValue } from "libs";

import {
  ADMIN_PARTNERS_ITEMS_END_POINT,
  ADMIN_PRODUCTS_VARIANTS_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type ItemListDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  not_in_partner: string | undefined;
  search: string;
};

const defaultFilterValue: ItemListDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  not_in_partner: undefined,
  search: "",
};

const ItemListDialog = ({ open, toggle }) => {
  const { hasPermission: writePermission } = usePermission("write_partner");

  const router = useRouter();
  const { formatMessage, messages } = useIntl();
  const context = useContext(PartnerItemContext);
  const [addLoading, setAddLoading] = useState<Record<string | number, unknown>>({});
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [listSelectedRow, setListSelectedRow] = useState<any>([]);

  const [filter, setFilter] = useState<ItemListDialogFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, {
        ...filter,
        not_in_partner: router.query.id,
      })
    );

  useEffect(() => {
    context.set({ mutateItem: refreshData });
  }, []);

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, {
          ...defaultFilterValue,
          not_in_partner: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, {
            ...cloneFilter,
            not_in_partner: router.query.id,
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

  const addHandler = useCallback(
    (data: Row<Required<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>>[]) => {
      return async () => {
        let trueLoadingList = {};
        let falseLoadingList = {};
        let bodyList: any[] = [];

        data.forEach((el) => {
          falseLoadingList[el.original.id] = false;
          trueLoadingList[el.original.id] = true;
          bodyList.push({
            partner: router.query.id,
            variant: el.original.id,
            partner_sku: `${el.original.sku}${router.query.id}`,
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
          const results = await createRequest(ADMIN_PARTNERS_ITEMS_END_POINT, bodyList);
          const result = checkResArr(results);

          if (result) {
            refreshData();

            context.state.mutateAddedItem();

            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.createSuccessfully, {
                content: "sản phẩm",
              })
            );
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
      };
    },
    [context]
  );

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.product.id");

      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    },
    []
  );

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          if (addLoading?.all) return;
          toggle(false);
        },
        DialogProps: {
          PaperProps: {
            sx: {
              minWidth: "90vw",
              maxWidth: "90vw",
              maxHeight: "90vh",
            },
          },
        },
        DialogTitleProps: {
          children: messages["listingProduct"],
        },
        renderDialogContentText: () => {
          return (
            <Stack spacing={2}>
              <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              />

              <WrapperTable>
                <ItemTable
                  data={data ?? []}
                  count={itemCount}
                  pagination={pagination}
                  isLoading={isLoading}
                  onPageChange={onFilterChangeHandler("page")}
                  onPageSizeChange={onFilterChangeHandler("pageSize")}
                  maxHeight="55vh"
                  writePermission={writePermission}
                  loading={addLoading}
                  addHandler={addHandler}
                  onGotoHandler={onGotoHandler}
                  setListSelectedRow={setListSelectedRow}
                />
              </WrapperTable>

              <Box padding="10px" />
            </Stack>
          );
        },

        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  if (addLoading?.all) return;

                  toggle(false);
                }}
              />
              <LoadingButton
                loading={!!addLoading["all"]}
                disabled={!!addLoading["all"]}
                onClick={() => {
                  if (listSelectedRow.length > 0) {
                    addHandler(listSelectedRow)();
                  }
                }}
              >
                {messages["addProduct"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
};

export default ItemListDialog;
