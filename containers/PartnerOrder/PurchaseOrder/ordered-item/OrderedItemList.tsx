import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCallback, Fragment, useState, useEffect, useMemo } from "react";

import { cloneDeep, get } from "lodash";
import { Typography, Button, Stack } from "@mui/material";

import {
  useFetch,
  useChoice,
  usePermission,
  useMutateTable,
  useConfirmation,
  useNotification,
} from "hooks";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
  getValueForUpdatingRow,
} from "libs";

import OrderItemTable from "../table/OrderItemTable";
import { Card, LoadingDynamic as Loading } from "components";
import CreateOrderedItemDialog from "./CreateOrderedItemDialog";
import { PURCHASE_ORDER_TYPE_EXTENDS } from "../EditPurchaseOrder";

import axios from "axios.config";
import { PRODUCTS } from "routes";
import DynamicMessage from "messages";

import { ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_YUP_RESOLVER } from "__generated__/PATCH_YUP";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

export type LineListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  order: string | undefined;
  nested_depth: number;
};

const defaultFilterValue: LineListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  order: undefined,
  nested_depth: 3,
};

interface LineListProps {
  data: PURCHASE_ORDER_TYPE_EXTENDS;
}

const LineList = ({ data }: LineListProps) => {
  const { hasPermission: writePermission } = usePermission("write_purchase_order");

  const choice = useChoice();
  const router = useRouter();
  const [open, toggle] = useToggle(false);
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const [openPrintNote, togglePrintNote] = useToggle(false);
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, enqueueSnackbar } =
    useNotification();

  const [filter, setFilter] = useState<LineListFilterType>(defaultFilterValue);

  const {
    data: dataTable,
    changeKey,
    itemCount,
    isLoading,
    refreshData,
  } = useFetch<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1>(
    transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, {
      ...filter,
      order: router.query.id,
    })
  );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, {
          ...defaultFilterValue,
          order: router.query.id,
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
          transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, cloneFilter)
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

  const { handleSubmit, setValue } = useForm({
    resolver: ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const {
    data: editData,
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    updateLoading,
    setUpdateLoading,
  } = useMutateTable();

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT,
          list
        );
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "sản phẩm",
            })
          );
          refreshData();
          onClose();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
      }
    };

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const updateHandler = useCallback((data: Row<{ id: number }>[]) => {
    return async () => {
      let bodyList: any[] = [];
      let trueLoadingList = {};
      let falseLoadingList = {};

      data.forEach((el) => {
        let id = el.original.id;
        trueLoadingList[id] = true;
        falseLoadingList[id] = false;

        let body = getValueForUpdatingRow(
          ["discount_type", "discount_amount", "quantity"],
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
              const { id, ...restBody } = data;

              const resData = await axios.patch(
                `${ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT}${id}/`,
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
          removeEditRowDataHandler(data)();

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "số lượng",
            })
          );
          refreshData();
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
  }, []);

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.variant.product.id");
      window.open(`/${PRODUCTS}/${productId}`);
    },
    []
  );

  const onSuccessHandler = useCallback(async () => {
    refreshData();
    toggle(false);
  }, []);

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>{messages["listingProduct"]}</Typography>

            <Stack flexDirection="row" columnGap={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  togglePrintNote(true);
                }}
              >
                {messages["printNote"]}
              </Button>

              {writePermission && (
                <Button
                  variant="contained"
                  onClick={() => {
                    toggle(true);
                  }}
                >
                  {messages["addProduct"]}
                </Button>
              )}
            </Stack>
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return (
          <Fragment>
            <OrderItemTable
              data={dataTable ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              loading={updateLoading}
              activeEditRow={activeEditRow}
              deleteHandler={deleteHandler}
              updateHandler={updateHandler}
              writePermission={writePermission}
              onGotoHandler={onGotoHandler}
              activeEditRowHandler={activeEditRowHandler}
              updateEditRowDataHandler={updateEditRowDataHandler}
              removeEditRowDataHandler={removeEditRowDataHandler}
              choice={choice}
              messages={messages}
              editData={editData}
            />

            <CreateOrderedItemDialog {...{ open, toggle, onSuccessHandler, data }} />

            <PrintNote
              {...{
                open: openPrintNote,
                toggle: togglePrintNote,
                type: "PURCHASE_ORDER",
              }}
            />
          </Fragment>
        );
      }}
    />
  );
};

export default LineList;
