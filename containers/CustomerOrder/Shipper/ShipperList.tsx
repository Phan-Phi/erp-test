import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useCallback, useMemo, useState } from "react";

import { cloneDeep } from "lodash";
import { Grid, Stack, Box } from "@mui/material";

import ShipperTable from "./components/ShipperTable";
import { TableHeader, WrapperTable } from "components";

import {
  useFetch,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";

import DynamicMessage from "messages";
import { ORDERS, SHIPPER, CREATE } from "routes";
import { ADMIN_ORDERS_SHIPPERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type ShipperListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
};

const defaultFilterValue: ShipperListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
};

const Shipper = () => {
  const { hasPermission: writePermission } = usePermission("write_shipper");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<ShipperListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_SHIPPERS_END_POINT, filter)
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(transformUrl(ADMIN_ORDERS_SHIPPERS_END_POINT, cloneFilter));
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

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(ADMIN_ORDERS_SHIPPERS_END_POINT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "shipper",
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

  return (
    <Grid container>
      <Grid item xs={9}>
        <Stack spacing={2}>
          <Box ref={ref}>
            <TableHeader
              title={messages["listingShipper"] as string}
              pathname={`/${ORDERS}/${SHIPPER}/${CREATE}`}
            />
          </Box>

          <WrapperTable>
            <ShipperTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 48}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
            />
          </WrapperTable>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Shipper;
