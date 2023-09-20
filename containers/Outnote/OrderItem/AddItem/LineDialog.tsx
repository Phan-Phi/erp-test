import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useCallback, useEffect, useMemo } from "react";

import { cloneDeep, get } from "lodash";
import { Stack, Box } from "@mui/material";

import {
  Dialog,
  BackButton,
  SearchField,
  WrapperTable,
  LoadingButton,
  LoadingDynamic as Loading,
} from "components";
import CreateLineTable from "./CreateLineTable";

import axios from "axios.config";
import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { checkResArr, setFilterValue, transformUrl } from "libs";
import { useFetch, useMutateTable, useNotification } from "hooks";

import {
  ADMIN_WAREHOUSES_RECORDS_END_POINT,
  ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1,
  ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import {
  ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_RESOLVER,
  ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

interface LineDialogProps {
  warehouse: any | null;
  open: boolean;
  toggle: (newValue?: boolean) => void;
  onSuccessHandler: () => Promise<void>;
}

const LineDialog = ({ onSuccessHandler, open, toggle, warehouse }: LineDialogProps) => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] =
    useState<ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA_TYPE>();

  ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_DEFAULT_VALUE;
  useEffect(() => {
    if (defaultValues == undefined && open && typeof router.query.id === "string") {
      const data = {
        ...ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_DEFAULT_VALUE,
        stock_out_note: router.query.id,
      };

      setDefaultValues(data);
    }
  }, [router, open, defaultValues]);

  useEffect(() => {
    if (!open) {
      setDefaultValues(undefined);
    }
  }, [open]);

  if (!open) return null;

  if (warehouse == null) return null;

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent {...{ defaultValues, onSuccessHandler, open, toggle, warehouse }} />
  );
};

interface RootComponentComponent extends LineDialogProps {
  defaultValues: ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_SCHEMA_TYPE;
  warehouse: ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1;
}

export type LineDialogFilerType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  warehouse: number | undefined;
  nested_depth: number;
  quantity_gte: number;
  search: string;
};

const defaultFilterValue: LineDialogFilerType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  warehouse: undefined,
  nested_depth: 3,
  quantity_gte: 1,
  search: "",
};

const RootComponent = ({
  defaultValues,
  onSuccessHandler,
  open,
  toggle,
  warehouse,
}: RootComponentComponent) => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage, messages } = useIntl();
  const [addLoading, setAddLoading] = useState({});
  const { handleSubmit, setValue } = useForm({
    resolver: ADMIN_WAREHOUSES_OUT_NOTES_LINES_POST_YUP_RESOLVER,
  });

  const warehouseId = get(warehouse, "id");
  const isMounted = useMountedState();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const {
    data: editData,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    activeEditRow,
    activeEditRowHandler,
  } = useMutateTable();

  const [listSelectedRow, setListSelectedRow] = useState<any>([]);
  const [filter, setFilter] = useState<LineDialogFilerType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
        ...filter,
        warehouse: warehouseId,
      })
    );

  useEffect(() => {
    if (warehouseId) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
          ...defaultFilterValue,
          warehouse: warehouseId,
        })
      );
    }
  }, [warehouseId]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
            ...cloneFilter,
            warehouse: warehouseId,
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

  const addHandler = useCallback(
    async ({ data }: { data: Row<{ id: number }>[] }) => {
      let trueLoadingList = {};
      let falseLoadingList = {};
      let bodyList: any[] = [];

      data.forEach((el) => {
        const id = el.original.id;

        const currentData = editData.current[id];
        const originalData = get(el, "original");
        const variantId = get(originalData, "variant.id");

        const defaultUnit = get(el, "original.variant.unit");
        const unit = get(currentData, "unit") || defaultUnit;
        const unitQuantity = get(currentData, "unit_quantity") || 1;

        bodyList.push({
          ...defaultValues,
          variant: variantId,
          unit,
          unit_quantity: unitQuantity,
        });

        falseLoadingList[id] = false;
        trueLoadingList[id] = true;
      });

      try {
        let resList: any[] = [];

        setAddLoading((prev) => {
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
            async (body) => {
              const resData = await axios.post(
                `${ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT}`,
                body
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
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "sản phẩm",
            })
          );

          refreshData();

          onSuccessHandler();
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
    [defaultValues]
  );

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.variant.product.id");

      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    },
    []
  );

  return (
    <Dialog
      {...{
        open,
        DialogProps: {
          PaperProps: {
            sx: {
              minWidth: "90vw",
              maxWidth: "90vw",
              maxHeight: "90vh",
            },
          },
        },
        onClose: () => {
          if (!!addLoading["all"]) return;

          toggle(false);
        },
        DialogTitleProps: {
          children: messages["addExportingProduct"],
        },
        dialogContentTextComponent: () => {
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
                  writePermission={true}
                  loading={addLoading}
                  addHandler={addHandler}
                  updateEditRowDataHandler={updateEditRowDataHandler}
                  activeEditRow={activeEditRow}
                  activeEditRowHandler={activeEditRowHandler}
                  editData={editData}
                  onGotoHandler={onGotoHandler}
                  maxHeight="55vh"
                  setListSelectedRow={setListSelectedRow}
                />
              </WrapperTable>

              <Box padding="10px" />
            </Stack>
          );
        },
        DialogActionsProps: {
          children: (
            <Stack columnGap={2} flexDirection="row">
              <BackButton
                disabled={!!addLoading["all"]}
                onClick={() => {
                  toggle(false);
                }}
              />
              <LoadingButton
                onClick={() => {
                  if (listSelectedRow.length > 0) {
                    addHandler({ data: listSelectedRow as any[] });
                  }
                }}
                disabled={!!addLoading["all"]}
                loading={!!addLoading["all"]}
                children={messages["addProduct"] as string}
              />
            </Stack>
          ),
        },
      }}
    />
  );
};

export default LineDialog;
