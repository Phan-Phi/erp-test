import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep, get } from "lodash";
import { Typography, Stack } from "@mui/material";

import { Card, LoadingDynamic as Loading } from "components";
import ProductVariantTable from "./table/ProductVariantTable";

import axios from "axios.config";
import DynamicMessage from "messages";
import { usePermission, useConfirmation, useNotification, useFetch } from "hooks";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";

import { ADMIN_PRODUCTS_VARIANTS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type VariantTableFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  product: string | undefined;
};

const defaultFilterValue: VariantTableFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  product: undefined,
};

type VariantTableProps = {
  defaultValues: any;
};

const VariantTable = ({ defaultValues }: VariantTableProps) => {
  const router = useRouter();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { hasPermission: writePermission } = usePermission("write_product");
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<VariantTableFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, {
        ...filter,
        product: router.query.id,
      })
    );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, {
          ...defaultFilterValue,
          product: router.query.id,
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
          transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, {
            ...cloneFilter,
            product: router.query.id,
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

  const setDefaultVariantHandler = useCallback(({ data, onClose }) => {
    return async (e: MouseEvent) => {
      try {
        e.stopPropagation();

        const variantId = get(data, "original.id");

        const body = {
          is_default: true,
        };

        await axios.patch(`${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}/`, body);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "biến thể mặc định",
          })
        );

        refreshData();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        onClose();
      }
    };
  }, []);

  const deleteVariantHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(ADMIN_PRODUCTS_VARIANTS_END_POINT, list);
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
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  if (!get(defaultValues, "product_class.has_variants")) {
    return null;
  }

  if (data == undefined) return <Loading />;

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography>{messages["variantProduct"] as string}</Typography>
            {/* {writePermission && (
              <Button
                onClick={() => {
                  router.push(`/${PRODUCTS}/${router.query.id}/${CREATE_VARIANT}`);
                }}
                variant="outlined"
              >
                {messages["createVariant"]}
              </Button>
            )} */}
          </Stack>
        );
      }}
      body={
        <ProductVariantTable
          data={data ?? []}
          count={itemCount}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
          deleteHandler={deleteVariantHandler}
          writePermission={writePermission}
          setDefaultVariantHandler={setDefaultVariantHandler}
          // TableRowProps={{
          //   onRowClick: (row) => {
          //     let pathname = `/${PRODUCTS}/${router.query.id}/${VARIANT}/${row.values.id}`;
          //     router.push(pathname);
          //   },
          //   sx: {
          //     cursor: "pointer",
          //   },
          // }}
        />
      }
    />
  );
};

export default VariantTable;
