import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useCallback, useMemo, useRef, useState } from "react";

import get from "lodash/get";

import { Grid, Stack, Typography, Box } from "@mui/material";

import {
  useParams,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
  useFetch,
} from "hooks";

import {
  transformUrl,
  checkResArr,
  deleteRequest,
  createLoadingList,
  setFilterValue,
} from "libs";

import {
  CompoundTableWithFunction,
  type ExtendableTableInstanceProps,
} from "components/TableV2";

import { Sticky } from "hocs";
import DynamicMessage from "messages";
import { CASH_TRANSACTION_TYPE } from "apis";
import TypeColumn from "../column/TypeColumn";
import { CREATE, CASHES, TYPE } from "routes";
import { LoadingButton, TableHeader } from "components";
import { CASH_TRANSACTION_TYPE_ITEM } from "interfaces";
import TypeColumnV2 from "../column/TypeColumnV2";
import { cloneDeep } from "lodash";
import { ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

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
  const { hasPermission: writePermission } = usePermission("write_transaction_type");

  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const [ref, { height }] = useMeasure();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { state: layoutState } = useLayout();

  const tableInstance =
    useRef<ExtendableTableInstanceProps<CASH_TRANSACTION_TYPE_ITEM>>();

  useParams({
    initState: {
      use_cache: false,
    },
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;
        setUrl(transformUrl(CASH_TRANSACTION_TYPE, params));
      }
    },
  });

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT, filter)
    );

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<CASH_TRANSACTION_TYPE_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

  const deleteHandler = useCallback(
    ({ data }: { data: Row<CASH_TRANSACTION_TYPE_ITEM>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return !el.original.is_used;
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(CASH_TRANSACTION_TYPE, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "loại transaction",
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

        changeKey(transformUrl(CASH_TRANSACTION_TYPE, cloneFilter));
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
      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingTransactionType"] as string}
                pathname={`/${CASHES}/${TYPE}/${CREATE}`}
              ></TableHeader>
            </Box>
            <TypeColumnV2
              data={data ?? []}
              count={itemCount}
              isLoading={isLoading}
              writePermission={writePermission}
              deleteHandler={deleteHandler}
              pagination={pagination}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
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
            {/* <CompoundTableWithFunction<CASH_TRANSACTION_TYPE_ITEM>
              url={CASH_TRANSACTION_TYPE}
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
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default TypeList;
