import { Row } from "react-table";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import React, { useCallback, useMemo, useState } from "react";

import { cloneDeep, isEmpty } from "lodash";
import { Box, Stack } from "@mui/material";

import AddProductTable from "./AddProductTable";
import { BackButton, Dialog, LoadingButton, SearchField } from "components";

import DynamicMessage from "messages";
import { useFetch, useNotification } from "hooks";
import { checkResArr, createRequest, setFilterValue, transformUrl } from "libs";

import {
  ADMIN_PRODUCTS_END_POINT,
  ADMIN_PRODUCTS_RECOMMENDATIONS_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { useIntl } from "react-intl";
import useRecommendation from "./context/useRecommendation";

type AddProductDialogProps = {
  open: boolean;
  onClose: () => void;
};

type AddProductDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  search: string;
};

const defaultFilterValue: AddProductDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  search: "",
};

export default function AddProductDialog(props: AddProductDialogProps) {
  const { onClose, open } = props;
  const router = useRouter();

  const isMounted = useMountedState();
  const { rank, updateData } = useRecommendation();

  const { messages, formatMessage } = useIntl();
  const [addLoading, setAddLoading] = useState<Record<string, boolean>>({});
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();
  const [filter, setFilter] = useState<AddProductDialogFilterType>(defaultFilterValue);
  const [listSelectedRow, setListSelectedRow] = useState<any>([]);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_END_POINT, filter)
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(transformUrl(ADMIN_PRODUCTS_END_POINT, cloneFilter));
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

  const addHandler = useCallback(
    async ({ data }: { data: Row<Required<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1>>[] }) => {
      const productId = router.query.id;

      let trueLoadingList = {};
      let falseLoadingList = {};
      let bodyList: any[] = [];

      data.forEach((el) => {
        const id = el.original.id;
        falseLoadingList[id] = false;
        trueLoadingList[id] = true;

        const body = {
          primary: productId,
          recommendation: id,
          ranking: rank,
        };

        bodyList.push(body);
      });

      if (isEmpty(bodyList)) {
        onClose();

        return;
      }

      setAddLoading((prev) => {
        return {
          ...prev,
          ...trueLoadingList,
          all: true,
        };
      });

      try {
        const results = await createRequest(
          ADMIN_PRODUCTS_RECOMMENDATIONS_END_POINT,
          bodyList
        );
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.addSuccessfully, {
              content: "sản phẩm",
            })
          );

          onClose();
          updateData.mutate();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setAddLoading((prev) => {
            return {
              ...prev,
              ...falseLoadingList,
              all: false,
            };
          });
        }
      }
    },
    [updateData]
  );

  return (
    <Dialog
      {...{
        open,
        onClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "75vw",
              maxWidth: "85vw",
            },
          },
        },
        DialogTitleProps: {
          children: "Thêm sản phẩm",
        },
        dialogContentTextComponent: () => {
          return (
            <Stack spacing={4}>
              <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              />

              <AddProductTable
                data={data ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight="55vh"
                addHandler={addHandler}
                loading={addLoading}
                setListSelectedRow={setListSelectedRow}
              />

              <Box padding="10px" />
            </Stack>
          );
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  onClose();
                }}
              />

              <LoadingButton
                loading={!!addLoading["all"]}
                disabled={!!addLoading["all"]}
                onClick={() => {
                  if (listSelectedRow.length > 0) {
                    addHandler({ data: listSelectedRow as any[] });
                  }
                }}
              >
                {addLoading["all"] ? messages["addingStatus"] : messages["addStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
}
