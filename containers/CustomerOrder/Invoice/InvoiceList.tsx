import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useCallback, useState, Fragment, useContext, useMemo, useEffect } from "react";

import { cloneDeep, get } from "lodash";

import InvoiceTable from "./table/InvoiceTable";
import { LoadingDynamic as Loading } from "components";

import {
  useFetch,
  useChoice,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

import {
  updateRequest,
  deleteRequest,
  checkResArr,
  createLoadingList,
  transformUrl,
  setFilterValue,
} from "libs";

import axios from "axios.config";
import DynamicMessage from "messages";
import { InvoiceContext } from "../context";
import { ADMIN_ORDERS_INVOICES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

const EditInvoiceDialog = dynamic(() => import("./EditInvoiceDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const ContainerInvoiceLine = dynamic(() => import("./InvoiceLine/ContainerInvoiceLine"), {
  loading: () => {
    return <Loading />;
  },
});

export type InvoiceListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  order: string | undefined;
};

const defaultFilterValue: InvoiceListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  order: undefined,
};

const InvoiceList = () => {
  const { hasPermission: writePermission } = usePermission("write_invoice");
  const { hasPermission: approvePermission } = usePermission("approve_invoice");

  const choice = useChoice();
  const router = useRouter();
  const [open, toggle] = useToggle(false);
  const [open2, toggle2] = useToggle(false);
  const { formatMessage, messages } = useIntl();
  const invoiceContext = useContext(InvoiceContext);
  const [openPrintNote, togglePrintNote] = useToggle(false);
  const [invoice, setInvoice] = useState<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>();
  const [selectedInvoice, setSelectedInvoice] = useState<number>();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<InvoiceListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...filter,
        order: router.query.id,
      })
    );

  useEffect(() => {
    invoiceContext.set({
      mutateInvoiceList: refreshData,
    });
  }, []);

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
          ...defaultFilterValue,
          order: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
            ...cloneFilter,
            order: router.query.id,
          })
        );
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

  const editInvoiceHandler = useCallback((row: Row<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      toggle(true);

      setInvoice(row.original);
    };
  }, []);

  const mutateInvoiceLineHandler = useCallback(
    (data: ADMIN_ORDER_INVOICE_VIEW_TYPE_V1) => {
      toggle2(true);
      setInvoice(data);
    },
    []
  );

  const onSuccessHandler = useCallback(async () => {
    await refreshData();
    setInvoice(undefined);
    toggle(false);
  }, []);

  const approveHandler = useCallback(
    ({ data }: { data: Row<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.status === "Draft";
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        let bodyList: any[] = [];

        filteredData.forEach((el) => {
          const body = {
            id: el.original.id,
            status: "Confirmed",
          };

          bodyList.push(body);
        });

        try {
          const results = await updateRequest(ADMIN_ORDERS_INVOICES_END_POINT, bodyList);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.approveSuccessfully, {
                content: "hóa đơn",
              })
            );

            refreshData();
            invoiceContext.state.mutateOrderInvoiceForCancelOrder();

            onClose();
          }
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
        }
      };

      onConfirm(handler, {
        message: messages["confirmInvoice"] as string,
        variant: "info",
      });
    },
    [invoiceContext]
  );

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.status === "Draft";
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(ADMIN_ORDERS_INVOICES_END_POINT, list);

          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "hóa đơn",
              })
            );
            refreshData();
            invoiceContext.state.mutateOrderInvoiceForCancelOrder();

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

  const changeDeliveryStatusHandler = useCallback(async ({ id, status }) => {
    try {
      await axios.patch(`${ADMIN_ORDERS_INVOICES_END_POINT}${id}/`, {
        shipping_status: status,
      });

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.updateSuccessfully, {
          content: "trạng thái giao hàng",
        })
      );

      await refreshData();
    } catch (err) {
      enqueueSnackbarWithError(err);
    }
  }, []);

  const printInvoiceHandler = useCallback((data) => {
    togglePrintNote(true);
    setSelectedInvoice(data.original.id);
  }, []);

  const onMutateInvoiceLineHandler = useCallback(
    (row: Row<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>) => {
      mutateInvoiceLineHandler(row.original);
    },
    []
  );

  return (
    <Fragment>
      <InvoiceTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        maxHeight={300}
        choice={choice}
        messages={messages}
        deleteHandler={deleteHandler}
        approveHandler={approveHandler}
        writePermission={writePermission}
        approvePermission={approvePermission}
        editInvoiceHandler={editInvoiceHandler}
        printInvoiceHandler={printInvoiceHandler}
        changeDeliveryStatusHandler={changeDeliveryStatusHandler}
        onMutateInvoiceLineHandler={onMutateInvoiceLineHandler}
      />

      {invoice && (
        <EditInvoiceDialog {...{ open, toggle, data: invoice, onSuccessHandler }} />
      )}

      <ContainerInvoiceLine {...{ open: open2, toggle: toggle2, data: invoice }} />

      {openPrintNote && (
        <PrintNote
          {...{
            open: openPrintNote,
            toggle: togglePrintNote,
            id: selectedInvoice,
            type: "INVOICE",
          }}
        />
      )}
    </Fragment>
  );
};

export default InvoiceList;
