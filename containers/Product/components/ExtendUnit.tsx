import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCallback, Fragment, useState, useEffect, useMemo } from "react";

import { isEmpty, cloneDeep } from "lodash";
import { Stack, Button, Typography } from "@mui/material";

import UnitTable from "../table/UnitTable";
import { LoadingDynamic as Loading, Card } from "components";

import {
  useFetch,
  useSetting,
  usePermission,
  useMutateTable,
  useConfirmation,
  useNotification,
} from "hooks";

import axios from "axios.config";
import DynamicMessage from "messages";

import { getValueForUpdatingRow, setFilterValue } from "libs";
import { transformUrl, deleteRequest, checkResArr, createLoadingList } from "libs";

import { ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_YUP_RESOLVER } from "__generated__/PATCH_YUP";

const UnitDialog = dynamic(() => import("./UnitDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const defaultValueProductVariant = {
  unit: "",
  multiply: "1",
  weight: "0",
  bar_code: "",
  price_incl_tax: "0",
  editable_sku: "",
};

export type ExtendUnitFilterProps = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  variant: string | undefined;
};

const defaultFilterValue: ExtendUnitFilterProps = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  variant: undefined,
};

const ExtendUnit = () => {
  const { hasPermission: writePermission } = usePermission("write_product");

  const router = useRouter();
  const setting = useSetting();
  const [open, toggle] = useToggle(false);
  const { messages, formatMessage } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, enqueueSnackbar } =
    useNotification();

  const [filter, setFilter] = useState<ExtendUnitFilterProps>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT, {
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
          transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT, {
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
    resolver: ADMIN_PRODUCTS_VARIANTS_UNITS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const {
    data: editData,
    activeEditRow,
    updateLoading,
    setUpdateLoading,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
  } = useMutateTable({});

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(
          ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT,
          list
        );
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "đơn vị",
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

        const selectedEditData = editData.current[id];
        const defaultData = el.original;

        const body = getValueForUpdatingRow(
          Object.keys(defaultValueProductVariant),
          selectedEditData,
          defaultData
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
                `${ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT}${id}/`,
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
              content: "đơn vị",
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

  const onSuccessHandler = useCallback(async () => {
    refreshData();
  }, []);

  useEffect(() => {
    if (router.query.variantId) {
      changeKey(
        transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT, {
          ...defaultFilterValue,
          variant: router.query.variantId,
        })
      );
    }
  }, [router.query.variantId]);

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography>{messages["extendUnit"]}</Typography>
            {writePermission && (
              <Button
                variant="contained"
                onClick={() => {
                  toggle(true);
                }}
              >
                {messages["createNewButton"]}
              </Button>
            )}
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return (
          <Fragment>
            <UnitTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              loading={updateLoading}
              maxHeight={300}
              updateHandler={updateHandler}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
              activeEditRow={activeEditRow}
              activeEditRowHandler={activeEditRowHandler}
              updateEditRowDataHandler={updateEditRowDataHandler}
              removeEditRowDataHandler={removeEditRowDataHandler}
              setting={setting}
              // TableRowProps={{
              //   onRowClick: (row) => {
              //     let pathname = `/${PARTNERS}/${EDIT}/${row.original.id}`;
              //     router.push(pathname);
              //   },
              //   sx: {
              //     cursor: "pointer",
              //   },
              // }}
              // renderHeaderContentForSelectedRow={(tableInstance) => {
              //   const selectedRows = tableInstance.selectedFlatRows;

              //   return (
              //     <Stack flexDirection="row" columnGap={3} alignItems="center">
              //       <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
              //         length: selectedRows.length,
              //       })}`}</Typography>

              //       <LoadingButton
              //         onClick={() => {
              //           deleteHandler({
              //             data: selectedRows,
              //           });
              //         }}
              //         color="error"
              //         children={messages["deleteStatus"]}
              //       />
              //     </Stack>
              //   );
              // }}
            />

            <UnitDialog {...{ open, toggle, onSuccessHandler }} />
          </Fragment>
        );
      }}
    />
  );
};

export default ExtendUnit;
