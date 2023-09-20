import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useCallback, useState, useContext, Fragment, useEffect, useMemo } from "react";

import { cloneDeep, get } from "lodash";
import { Typography, Stack } from "@mui/material";

import ReceiptOrderTable from "./table/ReceiptOrderTable";
import { LoadingDynamic as Loading, LoadingButton } from "components";

import DynamicMessage from "messages";
import { ReceiptOrderContext } from "./context";
import { PartnerOrderContext } from "../context";

import {
  deleteRequest,
  updateRequest,
  checkResArr,
  createLoadingList,
  transformUrl,
  setFilterValue,
} from "libs";

import {
  useFetch,
  usePermission,
  useConfirmation,
  useMutateTable,
  useNotification,
} from "hooks";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const EditReceiptOrderDialog = dynamic(() => import("./EditReceiptOrderDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

export type ReceiptOrderListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  order: string | undefined;
};

const defaultFilterValue: ReceiptOrderListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  order: undefined,
};

const ReceiptOrderList = () => {
  const { hasPermission: writePermission } = usePermission("write_receipt_order");
  const { hasPermission: approvePermission } = usePermission("approve_receipt_order");
  const router = useRouter();
  const [open, toggle] = useToggle(false);
  const { formatMessage, messages } = useIntl();
  const [approveLoading, setArrpoveLoading] = useState({});
  const [openPrintNote, togglePrintNote] = useToggle(false);

  const [selectedReceiptOrder, setSelectedReceiptOrder] =
    useState<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 | null>(null);

  const {
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
  } = useMutateTable();

  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const receiptOrderContext = useContext(ReceiptOrderContext);

  const partnerOrderContext = useContext(PartnerOrderContext);

  const [filter, setFilter] = useState<ReceiptOrderListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT, {
        ...filter,
        order: router.query.id,
      })
    );

  useEffect(() => {
    receiptOrderContext.set({
      mutate: refreshData,
    });
  }, []);

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT, {
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
          transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT, {
            ...cloneFilter,
            order: router.query.id,
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

  const deleteHandler = useCallback(({ data }) => {
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
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
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
      }
    };

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const approveHandler = useCallback(
    ({ data }) => {
      const handler = async () => {
        let trueLoadingList = {};
        let falseLoadingList = {};
        let bodyList: any[] = [];

        try {
          data.forEach((el) => {
            const id = el.original.id;

            falseLoadingList[id] = false;
            trueLoadingList[id] = true;

            const body = {
              id,
              status: "Confirmed",
            };

            bodyList.push(body);
          });

          setArrpoveLoading((prev) => {
            return {
              ...prev,
              ...trueLoadingList,
              all: true,
            };
          });

          const results = await updateRequest(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
            bodyList
          );

          const result = checkResArr(results);

          if (result) {
            await Promise.all([
              refreshData(),
              partnerOrderContext.state.mutateOrderedList(),
              partnerOrderContext.state.mutatePurchaseOrder(),
            ]);

            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.approveSuccessfully, {
                content: "phiếu nhập kho",
              })
            );

            onClose();
          }
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          setArrpoveLoading((prev) => {
            return {
              ...prev,
              ...falseLoadingList,
              all: false,
            };
          });
        }
      };

      onConfirm(handler, {
        message: messages["confirmReceiptOrder"] as string,
        variant: "info",
      });
    },
    [partnerOrderContext]
  );

  const onSuccessHandler = useCallback(async () => {
    await refreshData(), toggle(false);
  }, []);

  const printReceiptOrderHandler = useCallback(
    (row: Row<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1>) => {
      togglePrintNote(true);
      setSelectedReceiptOrder(row.original);
    },
    []
  );

  const onEditReceiptOrderHandler = useCallback(
    (row: Row<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1>) => {
      setSelectedReceiptOrder(row.original);
      toggle(true);
    },
    []
  );

  return (
    <Fragment>
      <ReceiptOrderTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        maxHeight={300}
        writePermission={writePermission}
        approvePermission={approvePermission}
        loading={approveLoading}
        updateEditRowDataHandler={updateEditRowDataHandler}
        activeEditRow={activeEditRow}
        activeEditRowHandler={activeEditRowHandler}
        deleteHandler={deleteHandler}
        approveHandler={approveHandler}
        messages={messages}
        printReceiptOrderHandler={printReceiptOrderHandler}
        removeEditRowDataHandler={removeEditRowDataHandler}
        onEditReceiptOrderHandler={onEditReceiptOrderHandler}
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

      <EditReceiptOrderDialog
        {...{
          open,
          toggle,
          data: selectedReceiptOrder,
          onSuccessHandler,
        }}
      />

      <PrintNote
        {...{
          open: openPrintNote,
          toggle: togglePrintNote,
          type: "RECEIPT_ORDER",
          id: selectedReceiptOrder?.id || null,
        }}
      />
    </Fragment>
  );
};

export default ReceiptOrderList;

{
  /* <CompoundTableWithFunction<WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_ITEM>
        url={transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER, {
          order: router.query.id,
          use_cache: false,
        })}
        passHandler={passHandler}
        columnFn={ReceiptOrderColumn}
        writePermission={writePermission}
        approvePermission={approvePermission}
        loading={approveLoading}
        updateEditRowDataHandler={updateEditRowDataHandler}
        activeEditRow={activeEditRow}
        activeEditRowHandler={activeEditRowHandler}
        deleteHandler={deleteHandler}
        approveHandler={approveHandler}
        messages={messages}
        printReceiptOrderHandler={printReceiptOrderHandler}
        removeEditRowDataHandler={removeEditRowDataHandler}
        onEditReceiptOrderHandler={onEditReceiptOrderHandler}
        TableContainerProps={{
          sx: {
            maxHeight: 300,
          },
        }}
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
      /> */
}
