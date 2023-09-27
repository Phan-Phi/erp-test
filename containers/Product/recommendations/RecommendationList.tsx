import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep } from "lodash";
import { Stack } from "@mui/material";

import RecommendationTable from "./RecommendationTable";
import { SearchField, LoadingDynamic as Loading } from "components";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";
import DynamicMessage from "messages";
import useRecommendation from "./context/useRecommendation";
import { useConfirmation, useFetch, useNotification } from "hooks";

import { ADMIN_PRODUCT_PRODUCT_RECOMMENDATION_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PRODUCTS_RECOMMENDATIONS_END_POINT } from "__generated__/END_POINT";

type RecommendationListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  nested_depth: number;
  search: string;
  primary: string | undefined;
};

const defaultFilterValue: RecommendationListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  search: "",
  nested_depth: 3,
  primary: undefined,
};

export default function RecommendationList() {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { setUpdateData, setRank } = useRecommendation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<RecommendationListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PRODUCT_PRODUCT_RECOMMENDATION_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_RECOMMENDATIONS_END_POINT, {
        ...filter,
        primary: router.query.id,
      })
    );

  useEffect(() => {
    let obj = {
      mutate: refreshData,
    };

    setUpdateData(obj);
    setRank(itemCount);
  }, [itemCount]);

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_PRODUCTS_RECOMMENDATIONS_END_POINT, {
          ...filter,
          primary: router.query.id,
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
          transformUrl(ADMIN_PRODUCTS_RECOMMENDATIONS_END_POINT, {
            ...cloneFilter,
            primary: router.query.id,
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

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_PRODUCT_PRODUCT_RECOMMENDATION_VIEW_TYPE_V1[]> }) => {
      const handler = async () => {
        const { list } = createLoadingList(data);

        try {
          const results = await deleteRequest(
            ADMIN_PRODUCTS_RECOMMENDATIONS_END_POINT,
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
        message: "Bạn có chắc muốn xóa",
      });
    },
    []
  );

  if (data == undefined) return <Loading />;

  return (
    <Stack spacing={4}>
      <SearchField
        initSearch={filter.search}
        onChange={onFilterChangeHandler("search")}
      />

      <RecommendationTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        deleteHandler={deleteHandler}
      />
    </Stack>
  );
}
