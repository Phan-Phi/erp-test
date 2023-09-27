import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { useCallback, useMemo, useState } from "react";

import { cloneDeep, omit, get } from "lodash";
import { Grid, Stack, Typography, Box } from "@mui/material";

import Filter from "./Filter";
import PurchaseOrderTable from "./PurchaseOrderTable";
import { LoadingButton, TableHeader } from "components";

import {
  useFetch,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  transformDate,
  setFilterValue,
  createLoadingList,
} from "libs";

import { Sticky } from "hocs";
import DynamicMessage from "messages";
import { PURCHASE_ORDERS, CREATE, PARTNERS } from "routes";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1,
  ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1,
  ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT } from "__generated__/END_POINT";

export type PurchaseOrderListFilterType = {
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
  total_start: string;
  total_end: string;
  total_params: {
    total_start: string;
    total_end: string;
  };
  owner: ADMIN_USER_USER_VIEW_TYPE_V1 | null;
  status: string;
  warehouse: ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1 | null;
  variant_name: Required<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1> | null;
  partner: ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1 | null;
};

const defaultFilterValue: PurchaseOrderListFilterType = {
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
  total_start: "",
  total_end: "",
  total_params: {
    total_start: "",
    total_end: "",
  },
  owner: null,
  status: "",
  warehouse: null,
  variant_name: null,
  partner: null,
};

const omitFiled = [
  "range",
  "range_params",
  "price_params",
  "date_placed_start",
  "date_placed_end",
  "total_start",
  "total_end",
  "total_params",
];

const Component = () => {
  const { hasPermission: writePermission } = usePermission("write_purchase_order");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<PurchaseOrderListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT, omit(filter, omitFiled))
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range" || key === "total_start" || key === "total_end") return;

        let startDate = transformDate(cloneFilter.range_params.startDate, "date_start");
        let endDate = transformDate(cloneFilter.range_params.endDate, "date_end");

        let isStartDate = cloneFilter.range_params.startDate;

        let isEndDate = cloneFilter.range_params.endDate;

        let ownerId = get(cloneFilter, "owner.id");
        let warehouseId = get(cloneFilter, "warehouse.id");
        let variantName = get(cloneFilter, "variant_name.name");
        let partnerId = get(cloneFilter, "partner.id");

        let overrideCloneFilter = {
          ...omit(cloneFilter, omitFiled),
        };

        changeKey(
          transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT, {
            ...overrideCloneFilter,
            date_placed_start: isStartDate ? startDate : undefined,
            date_placed_end: isEndDate ? endDate : undefined,
            total_start: cloneFilter.total_params.total_start,
            total_end: cloneFilter.total_params.total_end,
            owner: ownerId,
            warehouse: warehouseId,
            variant_name: variantName,
            partner: partnerId,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let ownerId = get(cloneFilter, "owner.id");
    let warehouseId = get(cloneFilter, "warehouse.id");
    let variantName = get(cloneFilter, "variant_name.name");
    let partnerId = get(cloneFilter, "partner.id");

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
      transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT, {
        ...overrideCloneFilter,
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
        total_start: updateFilter.total_params.total_start,
        total_end: updateFilter.total_params.total_end,
        owner: ownerId,
        warehouse: warehouseId,
        variant_name: variantName,
        partner: partnerId,
      })
    );
  }, [filter]);

  const onClickFilterPrice = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let ownerId = get(cloneFilter, "owner.id");
    let warehouseId = get(cloneFilter, "warehouse.id");
    let variantName = get(cloneFilter, "variant_name.name");
    let partnerId = get(cloneFilter, "partner.id");

    let updateFilter = {
      ...cloneFilter,
      total_params: {
        total_start: cloneFilter.total_start,
        total_end: cloneFilter.total_end,
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
      transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT, {
        ...overrideCloneFilter,
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
        total_start: updateFilter.total_params.total_start,
        total_end: updateFilter.total_params.total_end,
        owner: ownerId,
        warehouse: warehouseId,
        variant_name: variantName,
        partner: partnerId,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(
        ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT,
        omit(defaultFilterValue, omitFiled)
      )
    );
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const filteredData = data.filter((el: any) => {
        return el.original.status === "Draft";
      });

      if (get(filteredData, "length") === 0) return;

      const { list } = createLoadingList(filteredData);

      try {
        const results = await deleteRequest(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT,
          list
        );

        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "đặt hàng",
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
      message: "Bạn có chắc muốn xóa",
    });
  }, []);

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1>) => {
      const partnerId = get(data, "original.partner.id");
      window.open(`/${PARTNERS}/${partnerId}`, "_blank");
    },
    []
  );

  return (
    <Grid container>
      <Grid item xs={2}>
        <Filter
          filter={filter}
          resetFilter={resetFilterHandler}
          onSearchChange={onFilterChangeHandler("search")}
          onDateRangeChange={onFilterChangeHandler("range")}
          onFilterByTime={onClickFilterByTime}
          onClickFilterPrice={onClickFilterPrice}
          onPriceStart={onFilterChangeHandler("total_start")}
          onPriceEnd={onFilterChangeHandler("total_end")}
          onOwnerChange={onFilterChangeHandler("owner")}
          onStatusChange={onFilterChangeHandler("status")}
          onWarehouseChange={onFilterChangeHandler("warehouse")}
          onVariantNameChange={onFilterChangeHandler("variant_name")}
          onPartnerChange={onFilterChangeHandler("partner")}
        />
      </Grid>
      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingPurchaseOrder"] as string}
                pathname={`/${PURCHASE_ORDERS}/${CREATE}`}
              />
            </Box>

            <PurchaseOrderTable
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
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default Component;
