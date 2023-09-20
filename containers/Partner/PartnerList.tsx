import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useCallback, useMemo, useState } from "react";

import { cloneDeep, omit, get } from "lodash";
import { Grid, Stack, Box } from "@mui/material";

import Filter from "./Filter";
import PartnerTable from "./components/PartnerTable";
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
import { PARTNERS, CREATE } from "routes";
import { ADMIN_PARTNERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type PartnerFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search?: string;
  use_cache: string | boolean;

  total_debt_amount_start: string;
  total_debt_amount_end: string;

  total_debt_params: {
    total_debt_amount_start: string;
    total_debt_amount_end: string;
  };

  total_purchase_start: string;
  total_purchase_end: string;

  total_purchase_params: {
    total_purchase_start: string;
    total_purchase_end: string;
  };
};

const defaultFilterValue: PartnerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  use_cache: "false",

  total_debt_amount_start: "",
  total_debt_amount_end: "",

  total_debt_params: {
    total_debt_amount_start: "",
    total_debt_amount_end: "",
  },

  total_purchase_start: "",
  total_purchase_end: "",

  total_purchase_params: {
    total_purchase_start: "",
    total_purchase_end: "",
  },
};

const Component = () => {
  const { hasPermission: writePermission } = usePermission("write_partner");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<PartnerFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1>(
      transformUrl(
        ADMIN_PARTNERS_END_POINT,
        omit(filter, ["total_purchase_params", "total_debt_params"])
      )
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (
          key === "total_debt_amount_start" ||
          key === "total_debt_amount_end" ||
          key === "total_purchase_start" ||
          key === "total_purchase_end"
        )
          return;

        changeKey(
          transformUrl(ADMIN_PARTNERS_END_POINT, {
            ...omit(cloneFilter, [
              "total_debt_params",
              "total_purchase_params",
              "total_debt_amount_start",
              "total_debt_amount_end",
              "total_purchase_start",
              "total_purchase_end",
            ]),
            total_debt_amount_start:
              cloneFilter.total_debt_params.total_debt_amount_start,
            total_debt_amount_end: cloneFilter.total_debt_params.total_debt_amount_end,
            total_purchase_start: cloneFilter.total_purchase_params.total_purchase_start,
            total_purchase_end: cloneFilter.total_purchase_params.total_purchase_end,
          })
        );
      };
    },
    [filter]
  );

  const onFilterDebt = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFiler = {
      ...cloneFilter,
      total_debt_params: {
        total_debt_amount_start: cloneFilter.total_debt_amount_start,
        total_debt_amount_end: cloneFilter.total_debt_amount_end,
      },
    };

    setFilter(updateFiler);

    changeKey(
      transformUrl(ADMIN_PARTNERS_END_POINT, {
        ...omit(updateFiler, [
          "total_debt_params",
          "total_purchase_params",
          "total_debt_amount_start",
          "total_debt_amount_end",
          "total_purchase_start",
          "total_purchase_end",
        ]),
        total_debt_amount_start: updateFiler.total_debt_params.total_debt_amount_start,
        total_debt_amount_end: updateFiler.total_debt_params.total_debt_amount_end,
        total_purchase_start: cloneFilter.total_purchase_params.total_purchase_start,
        total_purchase_end: cloneFilter.total_purchase_params.total_purchase_end,
      })
    );
  }, [filter]);

  const onFilterPurchase = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFiler = {
      ...cloneFilter,
      total_purchase_params: {
        total_purchase_start: cloneFilter.total_purchase_start,
        total_purchase_end: cloneFilter.total_purchase_end,
      },
    };

    setFilter(updateFiler);

    changeKey(
      transformUrl(ADMIN_PARTNERS_END_POINT, {
        ...omit(updateFiler, [
          "total_debt_params",
          "total_purchase_params",
          "total_debt_amount_start",
          "total_debt_amount_end",
          "total_purchase_start",
          "total_purchase_end",
        ]),

        total_debt_amount_start: cloneFilter.total_debt_params.total_debt_amount_start,
        total_debt_amount_end: cloneFilter.total_debt_params.total_debt_amount_end,
        total_purchase_start: updateFiler.total_purchase_params.total_purchase_start,
        total_purchase_end: updateFiler.total_purchase_params.total_purchase_end,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(
        ADMIN_PARTNERS_END_POINT,
        omit(defaultFilterValue, ["total_purchase_params", "total_debt_params"])
      )
    );
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return !el.original.is_used;
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(ADMIN_PARTNERS_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "đối tác",
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
        message: "Bạn có chắc muốn xóa",
      });
    },

    []
  );

  return (
    <Box>
      <Grid container>
        <Grid item xs={2}>
          <Filter
            filter={filter}
            resetFilter={resetFilterHandler}
            onSearchChange={onFilterChangeHandler("search")}
            onFilterDebt={onFilterDebt}
            onChangePriceStart={onFilterChangeHandler("total_debt_amount_start")}
            onChangePriceEnd={onFilterChangeHandler("total_debt_amount_end")}
            onFilterPurchase={onFilterPurchase}
            onChangePurchaseStart={onFilterChangeHandler("total_purchase_start")}
            onChangePurchaseEnd={onFilterChangeHandler("total_purchase_end")}
          />
        </Grid>

        <Grid item xs={10}>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingPartner"] as string}
                pathname={`/${PARTNERS}/${CREATE}`}
              />
            </Box>

            <WrapperTable>
              <PartnerTable
                data={data ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                deleteHandler={deleteHandler}
                writePermission={writePermission}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 48
                }
              />
            </WrapperTable>
          </Stack>

          <Box padding="20px" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Component;
