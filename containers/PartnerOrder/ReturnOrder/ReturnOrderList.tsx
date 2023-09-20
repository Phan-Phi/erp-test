import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useCallback, useState, useContext, Fragment, useEffect, useMemo } from "react";

import { cloneDeep, get } from "lodash";
import { Stack, Typography } from "@mui/material";

import ReturnOrderTable from "./table/ReturnOrderTable";
import { LoadingDynamic as Loading, LoadingButton } from "components";

import DynamicMessage from "messages";
import { ReturnOrderContext } from "./context";
import { PartnerOrderContext } from "../context";
import { usePermission, useConfirmation, useNotification, useFetch } from "hooks";

import {
  checkResArr,
  transformUrl,
  updateRequest,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";

import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const EditReturnOrderDialog = dynamic(() => import("./EditReturnOrderDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

export type ReturnOrderListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  purchase_order: string | undefined;
};

const defaultFilterValue: ReturnOrderListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  purchase_order: undefined,
};

const ReturnOrderList = () => {
  const returnOrderContext = useContext(ReturnOrderContext);
  const partnerOrderContext = useContext(PartnerOrderContext);

  const { hasPermission: writePermission } = usePermission("write_return_order");
  const { hasPermission: approvePermission } = usePermission("approve_return_order");

  const router = useRouter();
  const [open, toggle] = useToggle(false);
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const [openPrintNote, togglePrintNote] = useToggle(false);
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();
  const [selectedReturnOrder, setSelectedReturnOrder] =
    useState<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1>();

  const [filter, setFilter] = useState<ReturnOrderListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1>(
      transformUrl(
        ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
        {
          ...filter,
          purchase_order: router.query.id,
        }
      )
    );

  useEffect(() => {
    returnOrderContext.set({
      mutate: refreshData,
    });
  }, []);

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
          {
            ...defaultFilterValue,
            purchase_order: router.query.id,
          }
        )
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
          transformUrl(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
            {
              ...cloneFilter,
              purchase_order: router.query.id,
            }
          )
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

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.status === "Draft";
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
            list
          );

          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "phiếu trả kho",
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
    },
    []
  );

  const approveHandler = useCallback(
    ({ data }: { data: Row<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        let bodyList: any[] = [];

        try {
          data.forEach((el) => {
            const id = el.original.id;

            const body = {
              id,
              status: "Confirmed",
            };

            bodyList.push(body);
          });

          const results = await updateRequest(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
            bodyList
          );
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.approveSuccessfully, {
                content: "phiếu trả kho",
              })
            );

            refreshData();
            partnerOrderContext.state.mutatePurchaseOrder();
            partnerOrderContext.state.mutateOrderedList();

            onClose();
          }
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
        }
      };

      onConfirm(handler, {
        message: messages["confirmReturnOrder"] as string,
        variant: "info",
      });
    },
    [partnerOrderContext]
  );

  const onSuccessHandler = useCallback(async () => {
    await refreshData();
    toggle(false);
  }, []);

  const printReturnOrderHandler = useCallback(
    (data: Row<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1>) => {
      togglePrintNote(true);
      setSelectedReturnOrder(data.original);
    },
    []
  );

  const onEditReturnOrderHandler = useCallback(
    (data: Row<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1>) => {
      setSelectedReturnOrder(data.original);
      toggle(true);
    },
    []
  );

  return (
    <Fragment>
      <ReturnOrderTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        messages={messages}
        approveHandler={approveHandler}
        deleteHandler={deleteHandler}
        writePermission={writePermission}
        approvePermission={approvePermission}
        printReturnOrderHandler={printReturnOrderHandler}
        onEditReturnOrderHandler={onEditReturnOrderHandler}
        maxHeight={300}
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
                children={messages["deleteStatus"]}
              />
            </Stack>
          );
        }}
      />

      <EditReturnOrderDialog
        {...{ open, toggle, data: selectedReturnOrder, onSuccessHandler }}
      />

      <PrintNote
        {...{
          open: openPrintNote,
          toggle: togglePrintNote,
          id: selectedReturnOrder?.id || null,
          type: "RETURN_ORDER",
        }}
      />
    </Fragment>
  );
};

export default ReturnOrderList;
