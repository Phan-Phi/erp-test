import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { useCallback, useMemo, useState } from "react";

import { cloneDeep, omit, get } from "lodash";
import { Grid, Stack, Box } from "@mui/material";

import Filter from "./Filter";
import ProductTable from "./table/ProductTable";
import { TableHeader } from "components";

import { Sticky } from "hocs";
import DynamicMessage from "messages";
import { PRODUCTS, CREATE } from "routes";

import {
  checkResArr,
  transformDate,
  transformUrl,
  deleteRequest,
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

import {
  ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1,
  ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_PRODUCTS_END_POINT } from "__generated__/END_POINT";

export type ProductListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  nested_depth: number;
  search: string;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  price_start: string;
  price_end: string;
  price_params: {
    price_start: string;
    price_end: string;
  };
  category: Required<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1> | null;
  partner: ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1 | null;
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
  nested_depth: 3,
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
  price_start: "",
  price_end: "",
  price_params: {
    price_start: "",
    price_end: "",
  },
  category: null,
  partner: null,
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
  "price_params",
  "price_start",
  "price_end",
  "range_params",
  "publication_date_start",
  "publication_date_end",
  "category",
  "partner",
  "order_date",
  "orderDate_params",
  "available_for_purchase_end",
  "available_for_purchase_start",
];

const ProductList = () => {
  const { hasPermission: writePermission } = usePermission("write_product");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<ProductListFilterType>(defaultFilterValue);
  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_END_POINT, omit(filter, omitFiled))
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (
          key === "price_start" ||
          key === "price_end" ||
          key === "range" ||
          key === "order_date"
        )
          return;

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

        let categoryId = get(cloneFilter, "category.id");
        let partnerId = get(cloneFilter, "partner.id");

        changeKey(
          transformUrl(ADMIN_PRODUCTS_END_POINT, {
            ...omit(cloneFilter, omitFiled),
            category: categoryId,
            partner: partnerId,
            price_start: cloneFilter.price_params.price_start,
            price_end: cloneFilter.price_params.price_end,
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

  const onClickFilterPrice = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let categoryId = get(cloneFilter, "category.id");
    let partnerId = get(cloneFilter, "partner.id");

    let updateFilter = {
      ...cloneFilter,
      price_params: {
        price_start: cloneFilter.price_start,
        price_end: cloneFilter.price_end,
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
      transformUrl(ADMIN_PRODUCTS_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        category: categoryId,
        partner: partnerId,
        price_start: updateFilter.price_params.price_start,
        price_end: updateFilter.price_params.price_end,
        publication_date_start: isDateStart ? dateStart : undefined,
        publication_date_end: isDateEnd ? dateEnd : undefined,
        available_for_purchase_start: isOrderDateStart ? orderDateStart : undefined,
        available_for_purchase_end: isOrderDateEnd ? orderDateEnd : undefined,
      })
    );
  }, [filter]);

  const onClickFilterSaleDate = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let categoryId = get(cloneFilter, "category.id");
    let partnerId = get(cloneFilter, "partner.id");

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
      transformUrl(ADMIN_PRODUCTS_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        category: categoryId,
        partner: partnerId,
        price_start: cloneFilter.price_params.price_start,
        price_end: cloneFilter.price_params.price_end,
        publication_date_start: isDateStart ? dateStart : undefined,
        publication_date_end: isDateEnd ? dateEnd : undefined,
        available_for_purchase_start: isOrderDateStart ? orderDateStart : undefined,
        available_for_purchase_end: isOrderDateEnd ? orderDateEnd : undefined,
      })
    );
  }, [filter]);

  const onClickFilterOrderDate = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let categoryId = get(cloneFilter, "category.id");
    let partnerId = get(cloneFilter, "partner.id");

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
      transformUrl(ADMIN_PRODUCTS_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        category: categoryId,
        partner: partnerId,
        price_start: cloneFilter.price_params.price_start,
        price_end: cloneFilter.price_params.price_end,
        publication_date_start: isDateStart ? dateStart : undefined,
        publication_date_end: isDateEnd ? dateEnd : undefined,
        available_for_purchase_start: isOrderDateStart ? orderDateStart : undefined,
        available_for_purchase_end: isOrderDateEnd ? orderDateEnd : undefined,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(ADMIN_PRODUCTS_END_POINT, omit(defaultFilterValue, omitFiled))
    );
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.is_used === false;
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(ADMIN_PRODUCTS_END_POINT, list);
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
    },
    []
  );

  return (
    <Grid container>
      <Grid item xs={2}>
        <Filter
          filter={filter}
          onSearchChange={onFilterChangeHandler("search")}
          resetFilter={resetFilterHandler}
          onClickFilterPrice={onClickFilterPrice}
          onPriceStart={onFilterChangeHandler("price_start")}
          onPriceEnd={onFilterChangeHandler("price_end")}
          onFilterByTime={onClickFilterSaleDate}
          onDateRangeChange={onFilterChangeHandler("range")}
          onCategoryChange={onFilterChangeHandler("category")}
          onPartnerChange={onFilterChangeHandler("partner")}
          onClickFilterOrderDate={onClickFilterOrderDate}
          onOrderDateChange={onFilterChangeHandler("order_date")}
        />
      </Grid>

      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingProduct"] as string}
                pathname={`/${PRODUCTS}/${CREATE}`}
              />
            </Box>

            <ProductTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 48}
            />
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default ProductList;
