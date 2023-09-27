import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { cloneDeep, get, omit, set } from "lodash";
import { Grid, Box, Stack, Button } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  updateRequest,
  transformDate,
  setFilterValue,
  createLoadingList,
} from "libs";
import {
  useFetch,
  useParams,
  usePermission,
  useNotification,
  useConfirmation,
  useLayout,
} from "hooks";
import { Sticky } from "hocs";
import { SAFE_OFFSET } from "constant";
import { CASH_TRANSACTION } from "apis";
import { CASH_TRANSACTION_ITEM } from "interfaces";
import { ADMIN_CASH_TRANSACTIONS_END_POINT } from "__generated__/END_POINT";
import {
  ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1,
  ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1,
  ADMIN_USER_USER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { CASHES, CREATE, DETAIL, EXPORTS, PARTNERS, TRANSACTION, USERS } from "routes";
import {
  ExportButton,
  Link,
  LoadingDynamic as Loading,
  TableHeader,
  WrapperTable,
} from "components";

import Filter from "./Filter";
import DynamicMessage from "messages";
import ListTransactionTable from "./ListTransactionTable";

const Total = dynamic(() => import("./Total"), {
  loading: () => {
    return <Loading />;
  },
});

export type PartnerFilterType = {
  page: 1;
  page_size: 25;
  with_count: boolean;
  search?: string;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  flow_type: ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1 | null;
  source_type: ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1 | null;
  payment_method: ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1 | null;
  owner: ADMIN_USER_USER_VIEW_TYPE_V1 | null;
  type: ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1 | null;
  status: any;
};

const defaultFilterValue: PartnerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  flow_type: null,
  source_type: null,
  payment_method: null,
  owner: null,
  type: null,
  status: null,
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
};

const Cash = () => {
  const [ref, { height: heightTable }] = useMeasure();
  const [measureRef, { height }] = useMeasure();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { state: layoutState } = useLayout();

  const { hasPermission: writePermission } = usePermission("write_transaction");
  const { hasPermission: approvePermission } = usePermission("approve_transaction");
  const { hasPermission: exportTransactionPermission } =
    usePermission("export_transaction");

  const [params, setParams, isReady, resetParams] = useParams();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState(defaultFilterValue);
  const [filterTotal, setFilterTotal] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1>(
      transformUrl(ADMIN_CASH_TRANSACTIONS_END_POINT, filter)
    );

  const onGotoExportFileHandler = useCallback(() => {
    window.open(`/${EXPORTS}/${TRANSACTION}`, "_blank");
  }, []);

  const onGotoHandler = useCallback((data: Row<ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1>) => {
    const targetId = get(data, "original.target.id");
    const targetType = get(data, "original.target_type");
    if (targetType === "customer.customer") {
      window.open(`/${USERS}/${DETAIL}/${targetId}`, "_blank");
    } else if (targetType === "partner.partner") {
      window.open(`/${PARTNERS}/${targetId}`, "_blank");
    }
  }, []);

  const deleteHandler = useCallback(
    ({ data }: { data: Row<CASH_TRANSACTION_ITEM>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.status === "Draft";
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(CASH_TRANSACTION, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "giao dịch",
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
    },
    []
  );
  const approveHandler = useCallback(
    ({ data }: { data: Row<ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.status === "Draft";
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        let bodyList: any[] = [];

        filteredData.forEach((el) => {
          const id = el.original.id;

          const body = {};

          set(body, "id", id);
          set(body, "status", "Confirmed");

          bodyList.push(body);
        });

        try {
          const results = await updateRequest(CASH_TRANSACTION, bodyList);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.approveSuccessfully, {
                content: "giao dịch",
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
        message: messages["confirmTransaction"] as string,
        variant: "info",
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
        if (key === "range") return;

        const params = cloneDeep(cloneFilter);
        set(params, "owner", get(params, "owner.id"));
        set(params, "flow_type", get(params, "flow_type"));
        set(params, "source_type", get(params, "source_type"));
        set(params, "status", get(params, "status"));
        set(params, "type", get(params, "type.id"));
        set(params, "payment_method", get(params, "payment_method.id"));

        if (key === "type") {
          set(value, "type", get(params, "type.id"));
          params.payment_method = null;
        }

        if (key === "payment_method") {
          set(value, "payment_method", get(params, "payment_method.id"));
          params.type = null;
        }

        setFilterTotal(params);

        let dateStart = transformDate(cloneFilter.range_params.startDate, "date_start");
        let dateEnd = transformDate(cloneFilter.range_params.endDate, "date_end");

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        changeKey(
          transformUrl(CASH_TRANSACTION, {
            ...omit(params, ["range", "range_params"]),
            date_confirmed_start: isStartDate ? dateStart : undefined,
            date_confirmed_end: isEndDate ? dateEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);
    setFilterTotal(defaultFilterValue);

    changeKey(
      transformUrl(CASH_TRANSACTION, omit(defaultFilterValue, ["range", "range_params"]))
    );
  }, [filter]);

  const onClickFilterByTime = useCallback(
    (key: string) => {
      const cloneFilter = cloneDeep(filter);

      let updateFilter = {
        ...cloneFilter,
        range_params: {
          startDate: cloneFilter.range.startDate,
          endDate: cloneFilter.range.endDate,
        },
      };
      setFilter(updateFilter);

      let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
      let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

      let isStartDate = updateFilter.range_params.startDate;
      let isEndDate = updateFilter.range_params.endDate;

      changeKey(
        transformUrl(CASH_TRANSACTION, {
          ...omit(cloneFilter, ["range", "range_params"]),

          date_confirmed_start: isStartDate ? dateStart : undefined,
          date_confirmed_end: isEndDate ? dateEnd : undefined,
          offset: 0,
        })
      );
    },
    [filter]
  );

  const renderTotal = useMemo(() => {
    return <Total params={filterTotal} />;
  }, [filterTotal, isLoading]);

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
        <Filter
          data={params}
          filter={filter}
          reset={resetParams}
          resetFilter={resetFilterHandler}
          onFilterByTime={onClickFilterByTime}
          onTypeChange={onFilterChangeHandler("type")}
          onOwnerChange={onFilterChangeHandler("owner")}
          onFlowType={onFilterChangeHandler("flow_type")}
          onSearch={onFilterChangeHandler("search")}
          onDateRangeChange={onFilterChangeHandler("range")}
          onSourceType={onFilterChangeHandler("source_type")}
          onTransactionStatuses={onFilterChangeHandler("status")}
          onPaymentMethodChange={onFilterChangeHandler("payment_method")}
        />
      </Grid>
      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={3}>
            <Box ref={measureRef}>{renderTotal}</Box>

            <Stack spacing={2}>
              <Box ref={ref}>
                <TableHeader title={messages["listingTransaction"] as string}>
                  <Stack flexDirection="row" columnGap={2} alignItems="center">
                    {exportTransactionPermission && (
                      <ExportButton onClick={onGotoExportFileHandler} />
                    )}

                    <Link href={`/${CASHES}/${CREATE}`}>
                      <Button>{messages["createNewButton"]}</Button>
                    </Link>
                  </Stack>
                </TableHeader>
              </Box>

              <WrapperTable>
                <ListTransactionTable
                  permission={{
                    writePermission: writePermission,
                    approvePermission: approvePermission,
                  }}
                  data={data ?? []}
                  count={itemCount}
                  isLoading={isLoading}
                  pagination={pagination}
                  onPageChange={onFilterChangeHandler("page")}
                  onPageSizeChange={onFilterChangeHandler("pageSize")}
                  onViewHandler={onGotoHandler}
                  onDeleteHandler={deleteHandler}
                  approveHandler={approveHandler}
                  deleteHandler={deleteHandler}
                  maxHeight={
                    layoutState.windowHeight - (heightTable + layoutState.sumHeight) - 170
                  }
                />
              </WrapperTable>
            </Stack>
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default Cash;
