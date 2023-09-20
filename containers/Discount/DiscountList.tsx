import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { useCallback, useMemo, useState } from "react";

import get from "lodash/get";
import { cloneDeep, omit } from "lodash";
import { Grid, Stack, Box, Typography } from "@mui/material";

import Filter from "./Filter";
import { LoadingButton, TableHeader } from "components";

import DynamicMessage from "messages";
import { PRODUCTS, CREATE, DISCOUNTS } from "routes";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { deleteRequest, checkResArr, createLoadingList } from "libs";
import { PARTNER_ITEM, PRODUCT_CATEGORY_ITEM, PRODUCT_ITEM } from "interfaces";

import {
  useFetch,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";
import { Sticky } from "hocs";

import {
  ADMIN_DISCOUNTS_END_POINT,
  ADMIN_PRODUCTS_END_POINT,
} from "__generated__/END_POINT";
import {
  ADMIN_DISCOUNT_SALE_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import DiscountListColumnV2 from "./column/DiscountListColumnV2";

export type ProductListFilterType = {
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

  order_date: Range;
  orderDate_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
};

const defaultFilterValue: ProductListFilterType = {
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

  order_date: {
    startDate: undefined,
    endDate: undefined,
    key: "order_date",
  },
  orderDate_params: {
    startDate: undefined,
    endDate: undefined,
  },
};

const omitFiled = [
  "range",
  "range_params",
  "date_start",
  "date_end",

  "order_date",
  "orderDate_params",
  "discount_amount_end",
  "discount_amount_start",
];
const DiscountList = () => {
  const { hasPermission: writePermission } = usePermission("write_product");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<ProductListFilterType>(defaultFilterValue);
  // const { data, changeKey, itemCount, isLoading, refreshData } =
  //   useFetch<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1>(
  //     transformUrl(ADMIN_PRODUCTS_END_POINT, omit(filter, omitFiled))
  //   );

  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<any>(
    transformUrl(ADMIN_DISCOUNTS_END_POINT, omit(filter, omitFiled))

    // transformUrl(ADMIN_DISCOUNTS_END_POINT, { use_cache: false })
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range" || key === "order_date") return;

        let dateStart = transformDate(cloneFilter.range_params.startDate, "date_start");
        let dateEnd = transformDate(cloneFilter.range_params.endDate, "date_end");

        let orderDateStart = transformDate(
          cloneFilter.orderDate_params.startDate,
          "date_start"
        );
        let orderDateEnd = transformDate(
          cloneFilter.orderDate_params.endDate,
          "date_end"
        );

        let isDateStart = cloneFilter.range_params.startDate;
        let isDateEnd = cloneFilter.range_params.endDate;

        let isOrderDateStart = cloneFilter.orderDate_params.startDate;
        let isOrderDateEnd = cloneFilter.orderDate_params.endDate;

        changeKey(
          transformUrl(ADMIN_DISCOUNTS_END_POINT, {
            ...omit(cloneFilter, omitFiled),
            publication_date_start: isDateStart ? dateStart : undefined,
            publication_date_end: isDateEnd ? dateEnd : undefined,
            available_for_purchase_start: isOrderDateStart ? orderDateStart : undefined,
            available_for_purchase_end: isOrderDateEnd ? orderDateEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterSaleDate = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFilter = {
      ...cloneFilter,
      range_params: {
        startDate: cloneFilter.range.startDate,
        endDate: cloneFilter.range.endDate,
      },
    };

    setFilter(updateFilter);

    let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
    let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

    let orderDateStart = transformDate(
      updateFilter.orderDate_params.startDate,
      "date_start"
    );
    let orderDateEnd = transformDate(updateFilter.orderDate_params.endDate, "date_end");

    let isDateStart = updateFilter.range_params.startDate;
    let isDateEnd = updateFilter.range_params.endDate;

    let isOrderDateStart = updateFilter.orderDate_params.startDate;
    let isOrderDateEnd = updateFilter.orderDate_params.endDate;

    changeKey(
      transformUrl(ADMIN_DISCOUNTS_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        date_start: isDateStart ? dateStart : undefined,
        date_end: isDateEnd ? dateEnd : undefined,
        discount_amount_start: isOrderDateStart ? orderDateStart : undefined,
        discount_amount_end: isOrderDateEnd ? orderDateEnd : undefined,
      })
    );
  }, [filter]);

  const onClickFilterOrderDate = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFilter = {
      ...cloneFilter,
      orderDate_params: {
        startDate: cloneFilter.order_date.startDate,
        endDate: cloneFilter.order_date.endDate,
      },
    };

    setFilter(updateFilter);

    let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
    let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

    let orderDateStart = transformDate(
      updateFilter.orderDate_params.startDate,
      "date_start"
    );
    let orderDateEnd = transformDate(updateFilter.orderDate_params.endDate, "date_end");

    let isDateStart = updateFilter.range_params.startDate;
    let isDateEnd = updateFilter.range_params.endDate;

    let isOrderDateStart = updateFilter.orderDate_params.startDate;
    let isOrderDateEnd = updateFilter.orderDate_params.endDate;

    changeKey(
      transformUrl(ADMIN_DISCOUNTS_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        date_start: isDateStart ? dateStart : undefined,
        date_end: isDateEnd ? dateEnd : undefined,
        discount_amount_start: isOrderDateStart ? orderDateStart : undefined,
        discount_amount_end: isOrderDateEnd ? orderDateEnd : undefined,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(ADMIN_DISCOUNTS_END_POINT, omit(defaultFilterValue, omitFiled))
    );
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const deleteHandler = useCallback(({ data }: { data: Row<PRODUCT_ITEM>[] }) => {
    const handler = async () => {
      const filteredData = data.filter((el) => {
        return el.original.is_used === false;
      });

      if (get(filteredData, "length") === 0) {
        return;
      }

      const { list } = createLoadingList(filteredData);

      try {
        const results = await deleteRequest(ADMIN_DISCOUNTS_END_POINT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "biến thế",
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
  }, []);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Filter
          filter={filter}
          onSearchChange={onFilterChangeHandler("search")}
          resetFilter={resetFilterHandler}
          onFilterByTime={onClickFilterSaleDate}
          onDateRangeChange={onFilterChangeHandler("range")}
          onClickFilterOrderDate={onClickFilterOrderDate}
          onOrderDateChange={onFilterChangeHandler("order_date")}
        />
      </Grid>

      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingDiscount"] as string}
                pathname={`/${DISCOUNTS}/${CREATE}`}
              />
            </Box>
            <DiscountListColumnV2
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
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

export default DiscountList;
