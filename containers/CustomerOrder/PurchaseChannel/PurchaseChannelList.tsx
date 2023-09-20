import { useMeasure } from "react-use";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  usePermission,
  useParams,
  useConfirmation,
  useNotification,
  useLayout,
  useFetch,
} from "hooks";
import { useIntl } from "react-intl";
import { LoadingButton, TableHeader, WrapperTable } from "components";
import { Grid, Stack, Typography, Box } from "@mui/material";

import {
  CompoundTableWithFunction,
  type ExtendableTableInstanceProps,
} from "components/TableV2";

import { Sticky } from "hocs";
import DynamicMessage from "messages";
import { ORDER_PURCHASE_CHANNEL } from "apis";
import { ORDER_PURCHASE_CHANNEL_ITEM } from "interfaces";
import { ORDERS, PURCHASE_CHANNEL, CREATE } from "routes";
import PurchaseChannelColumn from "../column/PurchaseChannelColumn";
import PurchaseChannelColumnV2 from "../column/PurchaseChannelColumnV2";
import {
  transformUrl,
  deleteRequest,
  createLoadingList,
  checkResArr,
  setFilterValue,
} from "libs";
import { cloneDeep, omit } from "lodash";
import { ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

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

const PurchaseChannelList = () => {
  const { hasPermission: writePermission } = usePermission("write_purchase_channel");

  const [ref, { height }] = useMeasure();

  const { state: layoutState } = useLayout();

  const { formatMessage, messages } = useIntl();

  const { onConfirm, onClose } = useConfirmation();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const tableInstance =
    useRef<ExtendableTableInstanceProps<ORDER_PURCHASE_CHANNEL_ITEM>>();

  useParams({
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;

        setUrl(transformUrl(ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT, params));
      }
    },
    isUpdateRouter: false,
  });

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT, filter)
    );

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<ORDER_PURCHASE_CHANNEL_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(
          ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT,
          list
        );
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "kênh bán",
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

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        // if (key === "range") return;

        changeKey(transformUrl(ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT, cloneFilter));
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
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingPurchaseChannel"] as string}
                pathname={`/${ORDERS}/${PURCHASE_CHANNEL}/${CREATE}`}
              ></TableHeader>
            </Box>

            <WrapperTable>
              <PurchaseChannelColumnV2
                data={data ?? []}
                count={itemCount}
                isLoading={isLoading}
                passHandler={passHandler}
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

            {/* <CompoundTableWithFunction<ORDER_PURCHASE_CHANNEL_ITEM>
              url={transformUrl(ORDER_PURCHASE_CHANNEL, { use_cache: false })}
              passHandler={passHandler}
              columnFn={PurchaseChannelColumn}
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
                    <Typography>
                      {`${formatMessage(DynamicMessage.selectedRow, {
                        length: selectedRows.length,
                      })}`}
                      sss
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
            /> */}
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default PurchaseChannelList;
