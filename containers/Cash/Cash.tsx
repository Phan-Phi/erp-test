import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { cloneDeep, get, omit, set } from "lodash";
import { Grid, Box, Stack, Button } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import ListTransaction from "./ListTransaction";

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
} from "hooks";
import { Sticky } from "hocs";
import { useIntl } from "react-intl";
import { SAFE_OFFSET } from "constant";
import { CASH_TRANSACTION } from "apis";
import { CASH_TRANSACTION_ITEM } from "interfaces";
import { ExtendableTableInstanceProps } from "components/TableV2";
import { CASHES, CREATE, DETAIL, EXPORTS, PARTNERS, TRANSACTION, USERS } from "routes";
import { ExportButton, Link, LoadingDynamic as Loading, TableHeader } from "components";

import Filter from "./Filter";
import DynamicMessage from "messages";
import ListTransactionTable from "./ListTransactionTable";
import { ADMIN_CASH_TRANSACTIONS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const Total = dynamic(() => import("./Total"), {
  loading: () => {
    return <Loading />;
  },
});

export type PartnerFilterType = {
  page: 1;
  page_size: 25;
  with_count: boolean;
  sid_icontains?: string;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  flow_type: string | null;
  source_type: string | null;
  payment_method: any;
  owner: any;
  type: any;
};

const defaultFilterValue: PartnerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  sid_icontains: "",
  flow_type: null,
  source_type: null,
  payment_method: null,
  owner: null,
  type: null,
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

  const { hasPermission: writePermission } = usePermission("write_transaction");
  const { hasPermission: approvePermission } = usePermission("approve_transaction");
  const { hasPermission: exportTransactionPermission } =
    usePermission("export_transaction");

  const [params, setParams, isReady, resetParams] = useParams();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const tableInstance = useRef<ExtendableTableInstanceProps<CASH_TRANSACTION_ITEM>>();
  const [filter, setFilter] = useState(defaultFilterValue);
  const [filterTotal, setFilterTotal] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_CASH_TRANSACTION_VIEW_TYPE_V1>(
      transformUrl(ADMIN_CASH_TRANSACTIONS_END_POINT, filter)
    );

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<CASH_TRANSACTION_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

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

  const onGotoExportFileHandler = useCallback(() => {
    window.open(`/${EXPORTS}/${TRANSACTION}`, "_blank");
  }, []);

  const onGotoHandler = useCallback((data: Row<CASH_TRANSACTION_ITEM>) => {
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

            tableInstance?.current?.mutate?.();
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
    ({ data }: { data: Row<CASH_TRANSACTION_ITEM>[] }) => {
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

            tableInstance?.current?.mutate?.();
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

        if (key === "type") {
          set(params, "type", get(params, "type.id"));
          params.payment_method = null;
        }

        if (key === "payment_method") {
          set(params, "payment_method", get(params, "payment_method.id"));
          params.type = null;
        }

        setFilterTotal(params);
        // const dateStart = transformDate(filter.range.startDate, "date_start");
        // const dateEnd = transformDate(filter.range.endDate, "date_end");

        // changeKey(
        //   transformUrl(CASH_TRANSACTION, {
        //     ...omit(params, "range"),
        //     date_confirmed_start: filter.range.startDate ? dateStart : undefined,
        //     date_confirmed_end: filter.range.endDate ? dateEnd : undefined,
        //   })
        // );
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

      // let dateStart: any = get(filter, "range.startDate");
      // let dateEnd: any = get(filter, "range.endDate");

      // dateStart = transformDate(dateStart, "date_start");
      // dateEnd = transformDate(dateEnd, "date_end");

      // set(params, "flow_type", get(params, "flow_type"));
      // set(params, "source_type", get(params, "source_type"));

      let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
      let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

      let isStartDate = updateFilter.range_params.startDate;
      let isEndDate = updateFilter.range_params.endDate;

      changeKey(
        transformUrl(CASH_TRANSACTION, {
          ...omit(cloneFilter, ["range", "range_params"]),
          // date_confirmed_start: dateStart,
          // date_confirmed_end: dateEnd,
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
          onFilterHandler={onFilterHandler}
          onFilterByTime={onClickFilterByTime}
          onTypeChange={onFilterChangeHandler("type")}
          onOwnerChange={onFilterChangeHandler("owner")}
          onFlowType={onFilterChangeHandler("flow_type")}
          onSearch={onFilterChangeHandler("sid_icontains")}
          onDateRangeChange={onFilterChangeHandler("range")}
          onSourceType={onFilterChangeHandler("source_type")}
          onPaymentMethodChange={onFilterChangeHandler("payment_method")}
        />
      </Grid>
      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={3}>
            <Box ref={measureRef}>
              {renderTotal}
              {/* <Total params={filterTotal} /> */}
            </Box>

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
                maxHeight={heightTable - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                onViewHandler={onGotoHandler}
                onDeleteHandler={deleteHandler}
                approveHandler={approveHandler}
                deleteHandler={deleteHandler}
              />
            </Stack>

            {/* <ListTransaction
              params={params}
              passHandler={passHandler}
              extraHeight={height}
            /> */}
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default Cash;
