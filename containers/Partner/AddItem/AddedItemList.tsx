import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { useCallback, useContext, useState, useEffect, useMemo } from "react";

import { get, unset, cloneDeep } from "lodash";
import { Stack, Button, Typography } from "@mui/material";

import AddedItemTable from "./table/AddedItemTable";
import { Card, LoadingButton, LoadingDynamic as Loading, SearchField } from "components";

import {
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
  getValueForUpdatingRow,
} from "libs";

import {
  useFetch,
  usePermission,
  useMutateTable,
  useConfirmation,
  useNotification,
} from "hooks";

import axios from "axios.config";
import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { checkResArr } from "libs/utils";
import { PartnerItemContext } from "./context";

import { ADMIN_PARTNERS_ITEMS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_YUP_RESOLVER } from "__generated__/PATCH_YUP";

const defaultValuePartner = {
  partner_sku: "",
  price: "0",
  price_incl_tax: "0",
  partner: "",
  variant: "",
};

const ItemListDialog = dynamic(import("./ItemListDialog"), {
  loading: () => <Loading />,
});

export type PartnerItemListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  partner: string | undefined;
  nested_depth: number;
  search: string;
};

const defaultFilterValue: PartnerItemListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  partner: undefined,
  nested_depth: 3,
  search: "",
};

const PartnerItemList = () => {
  const router = useRouter();
  const { formatMessage, messages } = useIntl();
  const context = useContext(PartnerItemContext);
  const { onConfirm, onClose } = useConfirmation();
  const [openListItem, toggleListItem] = useToggle(false);
  const { hasPermission: writePermission } = usePermission("write_partner");
  const { enqueueSnackbar, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { handleSubmit, setValue } = useForm({
    resolver: ADMIN_PARTNERS_ITEMS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const {
    data: editData,
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    updateLoading,
    setUpdateLoading,
    deleteLoading,
    setDeleteLoading,
  } = useMutateTable({});

  const [filter, setFilter] = useState<PartnerItemListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PARTNERS_ITEMS_END_POINT, {
        ...filter,
        partner: router.query.id,
      })
    );

  useEffect(() => {
    context.set({ mutateAddedItem: refreshData });
  }, []);

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_PARTNERS_ITEMS_END_POINT, {
          ...defaultFilterValue,
          partner: router.query.id,
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
          transformUrl(ADMIN_PARTNERS_ITEMS_END_POINT, {
            ...cloneFilter,
            partner: router.query.id,
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

  const updateHandler = useCallback(
    (data: Row<{ id: number }>[]) => {
      return async () => {
        let bodyList: any[] = [];
        let trueLoadingList = {};
        let falseLoadingList = {};

        data.forEach((el) => {
          let id = el.original.id;
          trueLoadingList[id] = true;
          falseLoadingList[id] = false;

          const body = getValueForUpdatingRow(
            Object.keys(defaultValuePartner),
            editData.current[id],
            el.original
          );

          bodyList.push({
            id,
            ...body,
          });
        });

        try {
          let resList: any[] = [];

          setUpdateLoading((prev) => {
            return {
              ...prev,
              ...trueLoadingList,
              all: true,
            };
          });

          for await (const el of bodyList) {
            Object.keys(el).forEach((key) => {
              setValue(key, el[key]);
            });

            await handleSubmit(
              async (data) => {
                unset(data, "partner");
                unset(data, "variant");
                const { id, ...restBody } = data;

                const resData = await axios.patch(
                  `${ADMIN_PARTNERS_ITEMS_END_POINT}${id}/`,
                  restBody
                );
                resList.push(resData);
              },
              (err) => {
                Object.keys(err).forEach((key) => {
                  enqueueSnackbar(`${key}: ${err?.[key]?.message}`, {
                    variant: "error",
                  });
                });

                throw new Error("");
              }
            )();
          }

          const result = checkResArr(resList);

          if (result) {
            refreshData();

            removeEditRowDataHandler(data)();

            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.updateSuccessfully, {
                content: "sản phẩm",
              })
            );
          }
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          setUpdateLoading((prev) => {
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

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const { falseLoadingList, trueLoadingList, list } = createLoadingList(data);

        setDeleteLoading((prev) => {
          return {
            ...prev,
            ...trueLoadingList,
            all: true,
          };
        });

        try {
          const results = await deleteRequest(ADMIN_PARTNERS_ITEMS_END_POINT, list);

          const result = checkResArr(results);

          if (result) {
            refreshData();

            context.state.mutateItem();

            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "sản phẩm",
              })
            );

            onClose();
          }
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          setDeleteLoading((prev) => {
            return {
              ...prev,
              ...falseLoadingList,
              all: false,
            };
          });
        }
      };

      onConfirm(handler, {
        message: "Bạn có chắc muốn xóa?",
      });
    },
    [context]
  );

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.variant.product.id");

      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    },
    []
  );

  return (
    <Card
      renderCardTitle={() => (
        <Stack direction={"row"} justifyContent={"space-between"} alignItems="center">
          <Typography variant="h6">{messages["listingAddedProduct"]}</Typography>

          {writePermission && (
            <Button
              variant="contained"
              onClick={() => {
                toggleListItem(true);
              }}
            >
              {messages["addProduct"]}
            </Button>
          )}
        </Stack>
      )}
      body={
        <Stack spacing={3}>
          <SearchField
            initSearch={filter.search}
            onChange={onFilterChangeHandler("search")}
          />

          <AddedItemTable
            data={data ?? []}
            count={itemCount}
            pagination={pagination}
            isLoading={isLoading}
            onPageChange={onFilterChangeHandler("page")}
            onPageSizeChange={onFilterChangeHandler("pageSize")}
            maxHeight={400}
            loading={updateLoading}
            activeEditRow={activeEditRow}
            deleteHandler={deleteHandler}
            updateHandler={updateHandler}
            writePermission={writePermission}
            activeEditRowHandler={activeEditRowHandler}
            updateEditRowDataHandler={updateEditRowDataHandler}
            removeEditRowDataHandler={removeEditRowDataHandler}
            onGotoHandler={onGotoHandler}
            renderHeaderContentForSelectedRow={(tableInstance) => {
              const selectedRows = tableInstance.selectedFlatRows;

              return (
                <Stack flexDirection="row" columnGap={3} alignItems="center">
                  <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                    length: selectedRows.length,
                  })}`}</Typography>

                  <LoadingButton
                    onClick={() => {
                      deleteHandler({
                        data: selectedRows,
                      });
                    }}
                    color="error"
                    disabled={!!deleteLoading["all"]}
                    children={
                      deleteLoading["all"]
                        ? messages["deletingStatus"]
                        : messages["deleteStatus"]
                    }
                  />
                </Stack>
              );
            }}
          />

          <ItemListDialog
            {...{
              open: openListItem,
              toggle: toggleListItem,
            }}
          />
        </Stack>
      }
    />
  );
};

export default PartnerItemList;
