import { Row } from "react-table";
import { cloneDeep } from "lodash";
import { useMeasure } from "react-use";
import { Grid, Stack, Typography, Box } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  usePermission,
  useParams,
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
import { LoadingButton, TableHeader, WrapperTable } from "components";
import { CREATE, CASHES, PAYMENT_METHOD } from "routes";

import DynamicMessage from "messages";
import PaymentMethodColumnV2 from "../column/PaymentMethodColumnV2";

import { ADMIN_CASH_PAYMENT_METHODS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CASH_PAYMENT_METHOD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

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

const PaymentMethodList = () => {
  const { hasPermission: writePermission } = usePermission("write_payment_method");
  const [filter, setFilter] = useState(defaultFilterValue);

  const [ref, { height }] = useMeasure();

  const { state: layoutState } = useLayout();

  const { formatMessage, messages } = useIntl();

  const { onConfirm, onClose } = useConfirmation();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const tableInstance = useRef<any>();

  useParams({
    initState: {
      use_cache: false,
    },
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;

        setUrl(transformUrl(ADMIN_CASH_PAYMENT_METHODS_END_POINT, params));
      }
    },
  });

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_CASH_PAYMENT_METHOD_VIEW_TYPE_V1>(
      transformUrl(ADMIN_CASH_PAYMENT_METHODS_END_POINT, filter)
    );

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_CASH_PAYMENT_METHOD_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const { list } = createLoadingList(data);

        try {
          const results = await deleteRequest(ADMIN_CASH_PAYMENT_METHODS_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "phương thức thanh toán",
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

        changeKey(transformUrl(ADMIN_CASH_PAYMENT_METHODS_END_POINT, cloneFilter));
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
                title={messages["listingPaymentMethod"] as string}
                pathname={`/${CASHES}/${PAYMENT_METHOD}/${CREATE}`}
              ></TableHeader>
            </Box>

            <WrapperTable>
              <PaymentMethodColumnV2
                data={data ?? []}
                count={itemCount}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                writePermission={writePermission}
                deleteHandler={deleteHandler}
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

export default PaymentMethodList;
