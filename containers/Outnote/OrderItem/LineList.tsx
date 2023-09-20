import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCallback, Fragment, useState, useEffect, useMemo } from "react";

import { get, cloneDeep } from "lodash";
import { Typography, Button, Stack } from "@mui/material";

import LineTable from "./table/LineTable";
import { Card, Loading } from "components";
import LineDialog from "./AddItem/LineDialog";

import axios from "axios.config";
import { PRODUCTS } from "routes";
import DynamicMessage from "messages";

import {
  useFetch,
  usePermission,
  useMutateTable,
  useConfirmation,
  useNotification,
} from "hooks";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
  getValueForUpdatingRow,
} from "libs";

import {
  ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1,
  ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import { ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_YUP_RESOLVER } from "__generated__/PATCH_YUP";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

interface LineListProps {
  warehouse: ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1 | null;
}

export type LineListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  stock_out_note: string | undefined;
  nested_depth: number;
};

const defaultFilterValue: LineListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  stock_out_note: undefined,
  nested_depth: 3,
};

const LineList = ({ warehouse }: LineListProps) => {
  const router = useRouter();
  const [open, toggle] = useToggle(false);
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const [openPrintNote, togglePrintNote] = useToggle(false);
  const { hasPermission: writePermission } = usePermission("write_stock_out_note");
  const { enqueueSnackbar, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { handleSubmit, setValue } = useForm({
    resolver: ADMIN_WAREHOUSES_OUT_NOTES_LINES_WITH_ID_PATCH_YUP_RESOLVER,
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

  const [filter, setFilter] = useState<LineListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, {
        ...filter,
        stock_out_note: router.query.id,
      })
    );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, {
          ...defaultFilterValue,
          stock_out_note: router.query.id,
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
          transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT, {
            ...cloneFilter,
            stock_out_note: router.query.id,
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

  const onSuccessHandler = useCallback(async () => {
    refreshData();

    toggle(false);
  }, []);

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(
          ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT,
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
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const updateHandler = useCallback((data) => {
    return async () => {
      let bodyList: any[] = [];
      let trueLoadingList = {};
      let falseLoadingList = {};

      data.forEach((el) => {
        let id = el.original.id;
        trueLoadingList[id] = true;
        falseLoadingList[id] = false;

        const body = getValueForUpdatingRow(
          ["unit_quantity"],
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
                `${ADMIN_WAREHOUSES_OUT_NOTES_LINES_END_POINT}${id}/`,
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
          refreshData();

          removeEditRowDataHandler(data)();

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "số lượng",
            })
          );
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

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.variant.product.id");

      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    },
    []
  );

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>{messages["listingExportingProduct"]}</Typography>

            <Stack flexDirection={"row"} columnGap={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  togglePrintNote(true);
                }}
              >
                {messages["printNote"]}
              </Button>

              {writePermission && (
                <Button
                  variant="contained"
                  onClick={() => {
                    toggle(true);
                  }}
                >
                  {messages["addProduct"]}
                </Button>
              )}
            </Stack>
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return (
          <Fragment>
            <LineTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={400}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
              activeEditRow={activeEditRow}
              updateHandler={updateHandler}
              activeEditRowHandler={activeEditRowHandler}
              updateEditRowDataHandler={updateEditRowDataHandler}
              removeEditRowDataHandler={removeEditRowDataHandler}
              loading={updateLoading}
              onGotoHandler={onGotoHandler}
            />

            <LineDialog {...{ open, toggle, onSuccessHandler, warehouse }} />

            <PrintNote
              {...{
                open: openPrintNote,
                toggle: togglePrintNote,
                type: "OUTNOTE",
              }}
            />
          </Fragment>
        );
      }}
    />
  );
};

export default LineList;
