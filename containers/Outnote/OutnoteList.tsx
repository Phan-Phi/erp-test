import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { useCallback, useMemo, useState } from "react";

import { cloneDeep, omit, get } from "lodash";
import { Grid, Stack, Typography, Box } from "@mui/material";

import Filter from "./Filter";
import OutnoteTable from "./OutnoteTable";
import { LoadingButton, TableHeader } from "components";

import {
  checkResArr,
  deleteRequest,
  transformDate,
  setFilterValue,
  createLoadingList,
} from "libs";

import {
  useFetch,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

import { Sticky } from "hocs";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { OUTNOTES, CREATE } from "routes";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1,
  ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_OUT_NOTES_END_POINT } from "__generated__/END_POINT";

export type OutnoteListFilterType = {
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
};

const defaultFilterValue: OutnoteListFilterType = {
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
};

const omitFiled = [
  "search",
  "range",
  "range_params",
  "sid_icontains",
  "total_start",
  "total_end",
  "total_params",
  "owner",
  "warehouse",
  "variant_name",
];

const OutnoteList = () => {
  const { hasPermission: writePermission } = usePermission("write_stock_out_note");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const [filter, setFilter] = useState<OutnoteListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT, omit(filter, omitFiled))
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

        changeKey(
          transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT, {
            ...omit(cloneFilter, omitFiled),
            sid_icontains: cloneFilter.search,
            date_created_start: isStartDate ? startDate : undefined,
            date_created_end: isEndDate ? endDate : undefined,
            total_start: cloneFilter.total_params.total_start,
            total_end: cloneFilter.total_params.total_end,
            owner: ownerId,
            warehouse: warehouseId,
            variant_name: variantName,
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

    changeKey(
      transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        sid_icontains: updateFilter.search,
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
        total_start: updateFilter.total_params.total_start,
        total_end: updateFilter.total_params.total_end,
        owner: ownerId,
        warehouse: warehouseId,
        variant_name: variantName,
      })
    );
  }, [filter]);

  const onClickFilterPrice = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let ownerId = get(cloneFilter, "owner.id");
    let warehouseId = get(cloneFilter, "warehouse.id");
    let variantName = get(cloneFilter, "variant_name.name");

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

    changeKey(
      transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        sid_icontains: updateFilter.search,
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
        total_start: updateFilter.total_params.total_start,
        total_end: updateFilter.total_params.total_end,
        owner: ownerId,
        warehouse: warehouseId,
        variant_name: variantName,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(
        ADMIN_WAREHOUSES_OUT_NOTES_END_POINT,
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

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.status === "Draft";
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "phiếu xuất kho",
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
        message: "Bạn có chắc muốn xóa",
      });
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
        />
      </Grid>

      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingOutnote"] as string}
                pathname={`/${OUTNOTES}/${CREATE}`}
              />
            </Box>

            <OutnoteTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
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

export default OutnoteList;
