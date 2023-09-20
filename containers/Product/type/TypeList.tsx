import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useCallback, useMemo, useState } from "react";

import { isEmpty, cloneDeep } from "lodash";
import { Grid, Stack, Box } from "@mui/material";

import TypeTable from "./TypeTable";
import { TableHeader, WrapperTable } from "components";

import {
  checkResArr,
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

import { Sticky } from "hocs";
import DynamicMessage from "messages";
import { PRODUCTS, TYPE, CREATE } from "routes";
import { ADMIN_PRODUCTS_TYPES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type TypeListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
};

const defaultFilterValue: TypeListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
};

const TypeList = () => {
  const { hasPermission: writePermission } = usePermission("write_product_class");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<TypeListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_TYPES_END_POINT, filter)
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(transformUrl(ADMIN_PRODUCTS_TYPES_END_POINT, cloneFilter));
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
    ({ data }: { data: Row<ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.is_used === false;
        });

        if (isEmpty(filteredData)) return;

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(ADMIN_PRODUCTS_TYPES_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "loại sản phẩm",
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
    },
    []
  );

  return (
    <Grid container>
      <Grid item xs={9}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingProductClass"] as string}
                pathname={`/${PRODUCTS}/${TYPE}/${CREATE}`}
              />
            </Box>

            <WrapperTable>
              <TypeTable
                data={data ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 48
                }
                deleteHandler={deleteHandler}
                writePermission={writePermission}
              />
            </WrapperTable>
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default TypeList;
