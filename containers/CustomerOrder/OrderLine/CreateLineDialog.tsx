import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useState, useCallback, useContext, useMemo } from "react";

import { get, isEmpty, cloneDeep } from "lodash";
import { Stack, Box } from "@mui/material";

import CreateLineTable from "./table/CreateLineTable";
import { Dialog, BackButton, LoadingButton, SearchField, WrapperTable } from "components";

import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { OrderLineContext } from "./Line";
import { useChoice, useMutateTable, useNotification, useFetch } from "hooks";
import { createRequest, transformUrl, checkResArr, setFilterValue } from "libs";

import {
  ADMIN_ORDERS_LINES_END_POINT,
  ADMIN_PRODUCTS_VARIANTS_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

interface LineDialogProps {
  open: boolean;
  toggle: (newValue?: boolean) => void;
}

export type LineDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  search: string;
};

const defaultFilterValue: LineDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  search: "",
};

const LineDialog = ({ open, toggle }: LineDialogProps) => {
  const choice = useChoice();
  const router = useRouter();

  const {
    data: editData,
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    resetEditRowHandler,
  } = useMutateTable({});

  const isMounted = useMountedState();
  const { messages, formatMessage } = useIntl();
  const orderLineContext = useContext(OrderLineContext);
  const [addLoading, setAddLoading] = useState<Record<string, boolean>>({});
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [listSelectedRow, setListSelectedRow] = useState<any>([]);

  const [filter, setFilter] = useState<LineDialogFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, filter)
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, cloneFilter));
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

  // useUpdateEffect(() => {
  //   if (!open) {
  //     resetEditRowHandler();
  //   }
  // }, [open]);

  const addHandler = useCallback(
    async ({
      data,
    }: {
      data: Row<Required<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>>[];
    }) => {
      const orderId = router.query.id;

      let trueLoadingList = {};
      let falseLoadingList = {};
      let bodyList: any[] = [];

      data.forEach((el) => {
        const id = el.original.id;
        falseLoadingList[id] = false;
        trueLoadingList[id] = true;

        const currentData = editData.current[id];

        const discountType = get(currentData, "discount_type") || "Percentage";
        const discountAmount = get(currentData, "discount_amount") || 0;
        const unit = get(currentData, "unit") || get(el, "original.unit");
        const unitQuantity = get(currentData, "unit_quantity") || 1;

        const body = {
          discount_type: discountType,
          variant: id,
          unit,
          unit_quantity: unitQuantity,
          discount_amount: discountAmount,
          order: orderId,
        };

        bodyList.push(body);
      });

      if (isEmpty(bodyList)) {
        toggle(false);

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
        const results = await createRequest(ADMIN_ORDERS_LINES_END_POINT, bodyList);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.addSuccessfully, {
              content: "sản phẩm",
            })
          );
          refreshData();

          orderLineContext.state.mutateLineList();

          toggle(false);
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          resetEditRowHandler();

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
    [orderLineContext]
  );

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.product.id");

      if (productId) {
        window.open(`/${PRODUCTS}/${productId}`, "_blank");
      }
    },
    []
  );

  const { discount_types } = choice;

  return (
    <Dialog
      {...{
        open,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "90vw",
              maxWidth: "90vw",
              maxHeight: "90vh",
            },
          },
        },
        onClose: () => {
          if (addLoading?.all) {
            return;
          }

          toggle(false);
        },
        DialogTitleProps: {
          children: messages["addProduct"],
        },
        renderDialogContentText: () => {
          return (
            <Stack spacing={2}>
              <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              />

              <WrapperTable>
                <CreateLineTable
                  data={data ?? []}
                  count={itemCount}
                  pagination={pagination}
                  isLoading={isLoading}
                  onPageChange={onFilterChangeHandler("page")}
                  onPageSizeChange={onFilterChangeHandler("pageSize")}
                  maxHeight="55vh"
                  messages={messages}
                  discountType={discount_types}
                  loading={addLoading}
                  editData={editData}
                  activeEditRow={activeEditRow}
                  activeEditRowHandler={activeEditRowHandler}
                  updateEditRowDataHandler={updateEditRowDataHandler}
                  removeEditRowDataHandler={removeEditRowDataHandler}
                  addHandler={addHandler}
                  onGotoHandler={onGotoHandler}
                  setListSelectedRow={setListSelectedRow}
                />
              </WrapperTable>

              <Box padding="10px" />
            </Stack>
          );
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                disabled={addLoading?.all}
                onClick={() => {
                  toggle(false);
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
    ></Dialog>
  );
};

export default LineDialog;
