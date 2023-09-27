import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useSnackbar } from "notistack";
import { cloneDeep, isEmpty } from "lodash";

import { Card } from "components";
import StockTable from "../table/StockTable";

import axios from "axios.config";
import DynamicMessage from "messages";
import { usePermission, useMutateTable, useNotification, useFetch } from "hooks";
import { transformUrl, checkResArr, getValueForUpdatingRow, setFilterValue } from "libs";

import { ADMIN_WAREHOUSES_RECORDS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_YUP_RESOLVER } from "__generated__/PATCH_YUP";

export type StockFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  variant: string | undefined;
};

const defaultFilterValue: StockFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  variant: undefined,
};

const defaultValueWarehouse = {
  price: "0",
  price_incl_tax: "0",
  low_stock_threshold: "0",
};

const Stock = () => {
  const { hasPermission: writePermission } = usePermission("write_product");

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage, messages } = useIntl();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();
  const [filter, setFilter] = useState<StockFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
        ...filter,
        variant: router.query.variantId,
      })
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
            ...cloneFilter,
            variant: router.query.variantId,
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

  const { handleSubmit, setValue } = useForm({
    resolver: ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const {
    data: editData,
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    updateLoading,
    setUpdateLoading,
  } = useMutateTable({});

  const updateHandler = useCallback((data: Row<{ id: number }>[]) => {
    return async () => {
      if (isEmpty(editData.current)) {
        removeEditRowDataHandler(data)();
        return;
      }

      let bodyList: any[] = [];
      let trueLoadingList = {};
      let falseLoadingList = {};

      data.forEach((el) => {
        let id = el.original.id;
        trueLoadingList[id] = true;
        falseLoadingList[id] = false;

        const body = getValueForUpdatingRow(
          Object.keys(defaultValueWarehouse),
          editData.current[id],
          el.original
        );

        bodyList.push({
          id,
          ...body,
        });
      });

      try {
        let resList: any[] = [];

        setUpdateLoading((prev) => {
          return {
            ...prev,
            ...trueLoadingList,
            all: true,
          };
        });

        for await (const el of bodyList) {
          Object.keys(el).forEach((key) => {
            setValue(key, el[key]);
          });

          await handleSubmit(
            async (data) => {
              const { id, ...restBody } = data;

              const resData = await axios.patch(
                `${ADMIN_WAREHOUSES_RECORDS_END_POINT}${id}/`,
                restBody
              );

              resList.push(resData);
            },
            (err) => {
              Object.keys(err).forEach((key) => {
                enqueueSnackbar(`${key}: ${err?.[key]?.message}`, {
                  variant: "error",
                });
              });

              throw new Error("");
            }
          )();
        }

        const result = checkResArr(resList);

        if (result) {
          removeEditRowDataHandler(data)();

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "số lượng",
            })
          );

          refreshData();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        setUpdateLoading((prev) => {
          return {
            ...prev,
            ...falseLoadingList,
            all: false,
          };
        });
      }
    };
  }, []);

  useEffect(() => {
    if (router.query.variantId) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
          ...defaultFilterValue,
          variant: router.query.variantId,
        })
      );
    }
  }, [router.query.variantId]);

  return (
    <Card
      title={messages["importWarehouseRecord"] as string}
      body={
        <StockTable
          data={data ?? []}
          count={itemCount}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
          loading={updateLoading}
          updateHandler={updateHandler}
          writePermission={writePermission}
          activeEditRow={activeEditRow}
          activeEditRowHandler={activeEditRowHandler}
          updateEditRowDataHandler={updateEditRowDataHandler}
          removeEditRowDataHandler={removeEditRowDataHandler}
          maxHeight={300}
        />
      }
    />
  );
};

export default Stock;
