import { cloneDeep } from "lodash";
import { useMeasure } from "react-use";
import { useCallback, useMemo, useRef, useState } from "react";
import { Grid, Stack, Typography, Box } from "@mui/material";

import {
  useParams,
  usePermission,
  useConfirmation,
  useNotification,
  useLayout,
  useFetch,
} from "hooks";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";

import { Sticky } from "hocs";
import { useIntl } from "react-intl";
import { ORDER_SHIPPING_METHOD } from "apis";
import { LoadingButton, TableHeader, WrapperTable } from "components";
import { ORDERS, SHIPPING_METHOD, CREATE } from "routes";

import DynamicMessage from "messages";
import ShippingMethodTable from "./components/ShippingMethodTable";

import { ADMIN_ORDERS_SHIPPING_METHODS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

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

const ListTransaction = () => {
  const { hasPermission: writePermission } = usePermission("write_shipping_method");

  const { formatMessage, messages } = useIntl();

  const [ref, { height }] = useMeasure();

  const { state: layoutState } = useLayout();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const tableInstance = useRef<any>();

  const { onConfirm, onClose } = useConfirmation();

  useParams({
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;

        setUrl(transformUrl(ORDER_SHIPPING_METHOD, params));
      }
    },
    isUpdateRouter: false,
  });

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_SHIPPING_METHODS_END_POINT, { use_cache: false })
    );

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(ORDER_SHIPPING_METHOD, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "phương thức vận chuyển",
            })
          );

          if (tableInstance.current) {
            tableInstance.current.mutate();
          }
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

        changeKey(transformUrl(ORDER_SHIPPING_METHOD, cloneFilter));
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
                title={messages["listingShippingMethod"] as string}
                pathname={`/${ORDERS}/${SHIPPING_METHOD}/${CREATE}`}
              ></TableHeader>
            </Box>

            <WrapperTable>
              <ShippingMethodTable
                data={data ?? []}
                count={itemCount}
                isLoading={isLoading}
                pagination={pagination}
                writePermission={writePermission}
                deleteHandler={deleteHandler}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
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
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default ListTransaction;
