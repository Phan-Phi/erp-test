import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import get from "lodash/get";
import set from "lodash/set";

import { Typography, Stack, Box, Button } from "@mui/material";

import { TableHeader, LoadingButton, Link } from "components";
import TransactionColumn from "./column/TransactionColumn";
import {
  CASHES,
  CREATE,
  DETAIL,
  EDIT,
  EXPORTS,
  PARTNERS,
  TRANSACTION,
  USERS,
} from "routes";
import {
  usePermission,
  useConfirmation,
  useNotification,
  useLayout,
  useFetch,
  useGetHeightForTable,
} from "hooks";

import DynamicMessage from "messages";
import { CASH_TRANSACTION } from "apis";
import { CASH_TRANSACTION_ITEM } from "interfaces";

import {
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
} from "components/TableV2";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  updateRequest,
  createLoadingList,
} from "libs";
import { useMeasure } from "react-use";
import ExportButton from "components/Button/ExportButton";
import ListTransactionTable from "./ListTransactionTable";
import { SAFE_OFFSET } from "constant";

interface ListTransactionProps {
  params: Record<string, any>;
  passHandler: (
    _tableInstance: ExtendableTableInstanceProps<CASH_TRANSACTION_ITEM>
  ) => void;
  extraHeight: number | undefined;
}

export type PartnerFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
};

const defaultFilterValue: PartnerFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",
};

const ListTransaction = ({
  params,
  extraHeight = 0,
  passHandler: externalPassHandler,
}: ListTransactionProps) => {
  const { hasPermission: writePermission } = usePermission("write_transaction");
  const { hasPermission: approvePermission } = usePermission("approve_transaction");

  const { hasPermission: exportTransactionPermission } =
    usePermission("export_transaction");

  const { formatMessage, messages } = useIntl();
  const [ref, { height }] = useMeasure();

  const { state: layoutState } = useLayout();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const tableInstance = useRef<ExtendableTableInstanceProps<CASH_TRANSACTION_ITEM>>();

  const router = useRouter();

  const { onConfirm, onClose } = useConfirmation();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<any>(
    transformUrl(CASH_TRANSACTION, params)
  );

  useEffect(() => {
    changeKey(transformUrl(CASH_TRANSACTION, params));
  }),
    [params];

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<CASH_TRANSACTION_ITEM>) => {
      tableInstance.current = _tableInstance;
      externalPassHandler(_tableInstance);
    },
    []
  );

  useEffect(() => {
    if (tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;
      setUrl(transformUrl(CASH_TRANSACTION, params));
    }
  }, [params]);

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

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
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

      {/* <CompoundTableWithFunction<CASH_TRANSACTION_ITEM>
        url={CASH_TRANSACTION}
        passHandler={passHandler}
        columnFn={TransactionColumn}
        deleteHandler={deleteHandler}
        writePermission={writePermission}
        approvePermission={approvePermission}
        approveHandler={approveHandler}
        messages={messages}
        onGotoHandler={onGotoHandler}
        TableRowProps={{
          onRowClick: (row) => {
            let pathname = `/${CASHES}/${EDIT}/${row.original.id}`;
            router.push(pathname);
          },
          sx: {
            cursor: "pointer",
          },
        }}
        TableContainerProps={{
          sx: {
            maxHeight:
              layoutState.windowHeight -
              (height + layoutState.sumHeight + extraHeight) -
              60,
          },
        }}
        renderHeaderContentForSelectedRow={(tableInstance) => {
          const selectedRows = tableInstance.selectedFlatRows;

          return (
            <Stack columnGap={3} flexDirection="row" alignItems="center">
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
              >
                {messages["deleteStatus"] as string}
              </LoadingButton>
            </Stack>
          );
        }}
      /> */}

      <ListTransactionTable
        permission={{
          writePermission: writePermission,
          approvePermission: approvePermission,
        }}
        data={data ?? []}
        count={itemCount}
        isLoading={isLoading}
        pagination={pagination}
        maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
        onViewHandler={onGotoHandler}
        onDeleteHandler={deleteHandler}
        approveHandler={approveHandler}
        deleteHandler={deleteHandler}
      />
    </Stack>
  );
};

export default ListTransaction;
