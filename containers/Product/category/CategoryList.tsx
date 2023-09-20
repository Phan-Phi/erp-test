import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useCallback, useMemo, useState } from "react";

import { cloneDeep } from "lodash";
import { Grid, Stack, Box } from "@mui/material";

import CategoryTable from "./CategoryTable";
import { TableHeader, WrapperTable } from "components";

import DynamicMessage from "messages";
import { PRODUCTS, CREATE, CATEGORY } from "routes";
import { createLoadingList, checkResArr } from "libs/utils";
import { transformUrl, deleteRequest, setFilterValue } from "libs";
import { ADMIN_PRODUCTS_CATEGORIES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

import {
  useFetch,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

export type CategoryListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
};

const defaultFilterValue: CategoryListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
};

const CategoryList = () => {
  const { hasPermission: writePermission } = usePermission("write_category");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<CategoryListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_CATEGORIES_END_POINT, filter)
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(transformUrl(ADMIN_PRODUCTS_CATEGORIES_END_POINT, cloneFilter));
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
    ({ data }: { data: Row<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const { list } = createLoadingList(data);

        try {
          const results = await deleteRequest(ADMIN_PRODUCTS_CATEGORIES_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "danh mục",
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
      <Grid item xs={9}>
        <Stack spacing={2}>
          <Box ref={ref}>
            <TableHeader
              title={messages["listingProductCategory"] as string}
              pathname={`/${PRODUCTS}/${CATEGORY}/${CREATE}`}
            />
          </Box>

          <WrapperTable>
            <CategoryTable
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
          </WrapperTable>

          <Box padding="20px" />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CategoryList;
