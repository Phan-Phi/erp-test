import useSWR from "swr";
import dynamic from "next/dynamic";
import { useContext, useCallback } from "react";

import get from "lodash/get";

import { transformUrl } from "libs";
import { usePermission } from "hooks";

import { InvoiceContext } from "../../context";
import { LoadingDynamic as Loading } from "components";

import {
  ADMIN_ORDER_INVOICE_VIEW_TYPE_V1,
  ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import { ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT } from "__generated__/END_POINT";

const CreateInvoiceLineDialog = dynamic(() => import("./CreateInvoiceLineDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const EditInvoiceLineDialog = dynamic(() => import("./EditInvoiceLineDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const ViewInvoiceLineDialog = dynamic(() => import("./ViewInvoiceLineDialog"), {
  loading: () => {
    return <Loading />;
  },
});

interface InvoiceLineProps {
  open: boolean;
  toggle: (newValue?: boolean) => void;
  data?: ADMIN_ORDER_INVOICE_VIEW_TYPE_V1;
}

const InvoiceLine = ({ data, open, toggle }: InvoiceLineProps) => {
  if (!open || data == undefined) {
    return null;
  }

  return <RootComponent {...{ open, toggle, data }} />;
};

interface RootComponentProps extends InvoiceLineProps {
  data: ADMIN_ORDER_INVOICE_VIEW_TYPE_V1;
}

const RootComponent = ({ open, toggle, data }: RootComponentProps) => {
  const { hasPermission: writePermission } = usePermission("write_invoice");

  const invoiceContext = useContext(InvoiceContext);

  const { data: invoiceQuantityData, mutate: invoiceQuantityMutate } = useSWR<
    ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1[]
  >(() => {
    const invoiceId = get(data, "id");

    const params = {
      invoice: invoiceId,
      nested_depth: 4,
      get_all: true,
      use_cache: false,
    };

    return transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, params);
  });

  const onSuccessHandler = useCallback(async () => {
    await Promise.all([
      invoiceQuantityMutate(),
      invoiceContext.state.mutateInvoiceList(),
      invoiceContext.state.mutateOrderLineList(),
    ]);

    toggle(false);
  }, [invoiceContext]);

  const status = get(data, "status");
  const count = get(invoiceQuantityData, "length");

  if (invoiceQuantityData == undefined || count == undefined) {
    return <Loading />;
  }

  if (!writePermission) {
    return (
      <ViewInvoiceLineDialog
        {...{
          open,
          toggle,
          data,
          onSuccessHandler,
        }}
      />
    );
  }

  if (status === "Draft" && count === 0) {
    return <CreateInvoiceLineDialog {...{ open, toggle, data, onSuccessHandler }} />;
  }

  if (status === "Draft" && count > 0 && open) {
    return (
      <EditInvoiceLineDialog
        {...{
          open,
          toggle,
          data,
          onSuccessHandler,
        }}
      />
    );
  }

  return (
    <ViewInvoiceLineDialog
      {...{
        open,
        toggle,
        data,
        onSuccessHandler,
      }}
    />
  );
};

export default InvoiceLine;
