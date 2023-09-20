import { cloneDeep } from "lodash";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useCallback, useMemo, useRef, useState } from "react";
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
  ExtendableTableInstanceProps,
} from "components/TableV2";
import { Sticky } from "hocs";
import { DISCOUNT } from "apis";
import { DISCOUNT_ITEM } from "interfaces";
import { DISCOUNTS, CREATE } from "routes";
import { ADMIN_DISCOUNTS_END_POINT } from "__generated__/END_POINT";
import { LoadingDynamic as Loading, TableHeader, LoadingButton } from "components";

import Filter from "./Filter";
import DynamicMessage from "messages";
import DiscountColumn from "./column/DiscountColumn";
import DiscountListColumnV2 from "./column/DiscountListColumnV2";
import { ADMIN_DISCOUNT_SALE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type PartnerFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search?: string;
  use_cache: string | boolean;
  // total_debt: {
  //   total_debt_amount_start: string;
  //   total_debt_amount_end: string;
  // };
};

const defaultFilterValue: PartnerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  use_cache: "false",
  // total_debt: {
  //   total_debt_amount_start: "",
  //   total_debt_amount_end: "",
  // },
};

const DiscountList = () => {
  const { hasPermission: writePermission } = usePermission("write_sale");

  const tableInstance = useRef<ExtendableTableInstanceProps<DISCOUNT_ITEM>>();

  const [ref, { height }] = useMeasure();

  const { state: layoutState } = useLayout();

  const { formatMessage, messages } = useIntl();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const { onConfirm, onClose } = useConfirmation();
  const [filter, setFilter] = useState<any>(defaultFilterValue);

  const [params, setParams, isReady, resetParams] = useParams({
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;

        setUrl(transformUrl(DISCOUNT, params));
      }
    },
  });

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_DISCOUNT_SALE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_DISCOUNTS_END_POINT, { use_cache: false })
    );

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<DISCOUNT_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );
  const deleteHandler = useCallback(async ({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(DISCOUNT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "khuyến mại",
            })
          );
        }

        tableInstance?.current?.mutate?.();
        refreshData();
        onClose();
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

        // if (key === "range") return;

        changeKey(transformUrl(DISCOUNT, cloneFilter));
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
    <Grid container>
      <Grid item xs={2}>
        <Filter onFilterHandler={onFilterHandler} data={params} reset={resetParams} />
      </Grid>

      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingDiscount"] as string}
                pathname={`/${DISCOUNTS}/${CREATE}`}
              ></TableHeader>
            </Box>

            <DiscountListColumnV2
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
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

            {/* <CompoundTableWithFunction<DISCOUNT_ITEM>
              url={DISCOUNT}
              passHandler={passHandler}
              columnFn={DiscountColumn}
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

export default DiscountList;
