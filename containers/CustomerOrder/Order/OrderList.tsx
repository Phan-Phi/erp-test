import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { useCallback, useMemo, useState } from "react";

import { cloneDeep, omit, get } from "lodash";
import { Grid, Stack, Box, Button } from "@mui/material";

import Filter from "../Filter";
import OrderListTable from "./OrderListTable";
import ExportButton from "components/Button/ExportButton";
import { TableHeader, Link, WrapperTable } from "components";

import DynamicMessage from "messages";
import { ORDERS, CREATE, USERS, DETAIL, EXPORTS, INVOICE } from "routes";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  transformDate,
  setFilterValue,
  createLoadingList,
} from "libs";

import {
  useLayout,
  useFetch,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_ORDER_ORDER_VIEW_TYPE_V1,
  ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1,
  ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import { ADMIN_ORDERS_END_POINT } from "__generated__/END_POINT";

export type OrderListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  search: string;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  owner: ADMIN_USER_USER_VIEW_TYPE_V1 | null;
  channel: ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1 | null;
  status: string;
  shipping_method: ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1 | null;
};

const defaultFilterValue: OrderListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  search: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
  owner: null,
  channel: null,
  status: "",
  shipping_method: null,
};

const omitFiled = ["range", "range_params", "owner", "channel", "shipping_method"];

const OrderList = () => {
  const { hasPermission: writePermission } = usePermission("write_order");
  const { hasPermission: exportInvoiceQuantityPermission } = usePermission(
    "export_invoice_quantity"
  );

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<OrderListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_END_POINT, omit(filter, omitFiled))
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        let startDate = transformDate(cloneFilter.range_params.startDate, "date_start");
        let endDate = transformDate(cloneFilter.range_params.endDate, "date_end");

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        let ownerId = get(cloneFilter, "owner.id");
        let channelId = get(cloneFilter, "channel.id");
        let shippingMethodId = get(cloneFilter, "shipping_method.id");

        let overrideCloneFilter = {
          ...omit(cloneFilter, omitFiled),
        };

        changeKey(
          transformUrl(ADMIN_ORDERS_END_POINT, {
            ...overrideCloneFilter,
            date_placed_start: isStartDate ? startDate : undefined,
            date_placed_end: isEndDate ? endDate : undefined,
            owner: ownerId,
            channel: channelId,
            shipping_method: shippingMethodId,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let ownerId = get(cloneFilter, "owner.id");
    let channelId = get(cloneFilter, "channel.id");
    let shippingMethodId = get(cloneFilter, "shipping_method.id");

    let updateFilter = {
      ...cloneFilter,
      range_params: {
        startDate: cloneFilter.range.startDate,
        endDate: cloneFilter.range.endDate,
      },
    };

    setFilter(updateFilter);

    let startDate = transformDate(updateFilter.range_params.startDate, "date_start");
    let endDate = transformDate(updateFilter.range_params.endDate, "date_end");

    let isStartDate = updateFilter.range_params.startDate;
    let isEndDate = updateFilter.range_params.endDate;

    let overrideCloneFilter = {
      ...omit(cloneFilter, omitFiled),
    };

    changeKey(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...overrideCloneFilter,
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
        owner: ownerId,
        channel: channelId,
        shipping_method: shippingMethodId,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(ADMIN_ORDERS_END_POINT, omit(defaultFilterValue, omitFiled)));
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.status === "Draft";
        });

        if (get(filteredData, "length") === 0) return;

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(ADMIN_ORDERS_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "đơn hàng",
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

  const onGotoHandler = useCallback((data: Row<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>) => {
    const receiverId = get(data, "original.receiver.id");

    if (receiverId) {
      window.open(`/${USERS}/${DETAIL}/${receiverId}`, "_blank");
    }
  }, []);

  const onGotoExportFileHandler = useCallback(() => {
    window.open(`/${EXPORTS}/${INVOICE}`, "_blank");
  }, []);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Filter
          filter={filter}
          resetFilter={resetFilterHandler}
          onSearchChange={onFilterChangeHandler("search")}
          onFilterByTime={onClickFilterByTime}
          onDateRangeChange={onFilterChangeHandler("range")}
          onOwnerChange={onFilterChangeHandler("owner")}
          onChannelChange={onFilterChangeHandler("channel")}
          onStatusChange={onFilterChangeHandler("status")}
          onShippingMethodChange={onFilterChangeHandler("shipping_method")}
        />
      </Grid>

      <Grid item xs={10}>
        <Stack spacing={2}>
          <Box ref={ref}>
            <TableHeader title={messages["listingOrder"] as string}>
              <Stack flexDirection="row" columnGap={2} alignItems="center">
                {exportInvoiceQuantityPermission && (
                  <ExportButton onClick={onGotoExportFileHandler} />
                )}
                <Link href={`/${ORDERS}/${CREATE}`}>
                  <Button>{messages["createNewButton"]}</Button>
                </Link>
              </Stack>
            </TableHeader>
          </Box>

          <WrapperTable>
            <OrderListTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
              onGotoHandler={onGotoHandler}
              messages={messages}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 48}
            />
          </WrapperTable>

          <Box padding="20px" />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default OrderList;
