import get from "lodash/get";
import { Row } from "react-table";
import { cloneDeep } from "lodash";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Grid, Stack, Typography, Box } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  useParams,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
  useFetch,
} from "hooks";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";
import Filter from "./Filter";
import { Sticky } from "hocs";
import { WAREHOUSE } from "apis";
import DynamicMessage from "messages";
import { WAREHOUSES, CREATE } from "routes";
import { WAREHOUSE_ITEM } from "interfaces";

import WarehouseTable from "./columns/WarehouseTable";
import { ADMIN_WAREHOUSES_END_POINT } from "__generated__/END_POINT";
import { type ExtendableTableInstanceProps } from "components/TableV2";
import { ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import {
  LoadingButton,
  LoadingDynamic as Loading,
  TableHeader,
  WrapperTable,
} from "components";

export type PartnerFilterType = {
  with_count: boolean;
  search?: string;
  page: number;
  page_size: number;
};

const defaultFilterValue: PartnerFilterType = {
  with_count: true,
  search: "",
  page: 1,
  page_size: 25,
};

const ViewWarehouse = () => {
  const { hasPermission: writePermission } = usePermission("write_warehouse");

  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const tableInstance = useRef<ExtendableTableInstanceProps<WAREHOUSE_ITEM>>();

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<WAREHOUSE_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

  const [params, setParams, isReady] = useParams({
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;

        setUrl(transformUrl(WAREHOUSE, params));
      }
    },
  });

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_END_POINT, filter)
    );

  const deleteHandler = useCallback(({ data }: { data: Row<WAREHOUSE_ITEM>[] }) => {
    const handler = async () => {
      const filteredData = data.filter((el) => {
        return el.original.is_used === false;
      });

      if (get(filteredData, "length") === 0) {
        return;
      }

      const { list } = createLoadingList(filteredData);

      try {
        const results = await deleteRequest(WAREHOUSE, list);

        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "kho",
            })
          );

          tableInstance?.current?.mutate();
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

  const onFilterHandler = useCallback((key) => {
    return (value: any) => {
      if (tableInstance.current) {
        const { pageSize } = tableInstance.current.state;

        setParams({
          page_size: pageSize,
          page: 1,
          [key]: value,
        });
      }
    };
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        const params = cloneDeep(cloneFilter);
        changeKey(transformUrl(WAREHOUSE, { ...params, page: 1 }));
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

  if (!isReady) return <Loading />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={2}>
        <Filter onFilterHandler={onFilterChangeHandler} data={params} />
      </Grid>
      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingWarehouse"] as string}
                pathname={`/${WAREHOUSES}/${CREATE}`}
              ></TableHeader>
            </Box>

            <WrapperTable>
              <WarehouseTable
                data={data ?? []}
                count={itemCount}
                passHandler={passHandler}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                deleteHandler={deleteHandler}
                writePermission={writePermission}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 70
                }
                renderHeaderContentForSelectedRow={(tableInstance) => {
                  const selectedRows = tableInstance.selectedFlatRows;

                  return (
                    <Stack flexDirection="row" columnGap={3} alignItems="center">
                      <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                        length: selectedRows.length,
                      })}`}</Typography>

                      <LoadingButton
                        onClick={() => {
                          deleteHandler({
                            data: selectedRows,
                          });
                        }}
                        color="error"
                        children={messages["deleteStatus"]}
                      />
                    </Stack>
                  );
                }}
              />
            </WrapperTable>

            {/* 
            <CompoundTableWithFunction<WAREHOUSE_ITEM>
              url={WAREHOUSE}
              passHandler={passHandler}
              columnFn={WarehouseColumn}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
              TableContainerProps={{
                sx: {
                  maxHeight:
                    layoutState.windowHeight - (height + layoutState.sumHeight) - 48,
                },
              }}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                      length: selectedRows.length,
                    })}`}</Typography>

                    <LoadingButton
                      onClick={() => {
                        deleteHandler({
                          data: selectedRows,
                        });
                      }}
                      color="error"
                      children={messages["deleteStatus"]}
                    />
                  </Stack>
                );
              }}
            /> */}
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default ViewWarehouse;
