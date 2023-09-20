import { Row } from "react-table";
import { useMeasure } from "react-use";
import { Grid, Stack, Typography, Box } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  useLayout,
  useParams,
  usePermission,
  useConfirmation,
  useNotification,
  useFetch,
} from "hooks";

import {
  CompoundTableWithFunction,
  type ExtendableTableInstanceProps,
} from "components/TableV2";

import { Sticky } from "hocs";
import { useIntl } from "react-intl";
import { CUSTOMER_TYPE } from "apis";
import TypeColumn from "./TypeColumn";
import DynamicMessage from "messages";
import { CUSTOMER_TYPE_ITEM } from "interfaces";
import { CUSTOMERS, TYPE, CREATE } from "routes";
import { LoadingButton, TableHeader, WrapperTable } from "components";
import {
  transformUrl,
  checkResArr,
  deleteRequest,
  createLoadingList,
  setFilterValue,
} from "libs";
import TypeListTable from "./components/TypeListTable";
import { cloneDeep } from "lodash";
import { ADMIN_CUSTOMERS_TYPES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type PartnerFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
};

const defaultFilterValue: PartnerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
};

const TypeList = () => {
  const { hasPermission: writePermission } = usePermission("write_customer_type");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const [filter, setFilter] = useState(defaultFilterValue);

  const tableInstance = useRef<ExtendableTableInstanceProps<CUSTOMER_TYPE_ITEM>>();

  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  useParams({
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;

        setUrl(transformUrl(CUSTOMER_TYPE, params));
      }
    },
    isUpdateRouter: false,
  });

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_CUSTOMERS_TYPES_END_POINT, filter)
    );

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<CUSTOMER_TYPE_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

  const deleteHandler = useCallback(
    async ({ data }: { data: Row<CUSTOMER_TYPE_ITEM>[] }) => {
      const handler = async () => {
        const { list } = createLoadingList(data);

        try {
          const results = await deleteRequest(CUSTOMER_TYPE, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "nhóm khách hàng",
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
        message: "Bạn có chắc muốn xóa",
      });
    },
    []
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        // if (key === "range") return;

        changeKey(transformUrl(CUSTOMER_TYPE, cloneFilter));
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
  return (
    <Grid container>
      <Grid item xs={9}>
        <Stack spacing={2}>
          <Box ref={ref}>
            <TableHeader
              title={messages["listingCustomerType"] as string}
              pathname={`/${CUSTOMERS}/${TYPE}/${CREATE}`}
            ></TableHeader>
          </Box>

          <WrapperTable>
            <TypeListTable
              data={data ?? []}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>
                      {`${formatMessage(DynamicMessage.selectedRow, {
                        length: selectedRows.length,
                      })}`}
                    </Typography>

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

          {/* <CompoundTableWithFunction<CUSTOMER_TYPE_ITEM>
              url={CUSTOMER_TYPE}
              passHandler={passHandler}
              columnFn={TypeColumn}
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
      </Grid>
    </Grid>
  );
};

export default TypeList;
