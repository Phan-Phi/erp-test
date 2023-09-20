import useSWR from "swr";
import { useIntl } from "react-intl";
import createDOMPurify from "dompurify";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { useMemo, useState, useRef } from "react";

import { Grid, Stack, Button, Box } from "@mui/material";

import { printStyle } from "libs";
import { useNotification } from "hooks";
import { LoadingDynamic as Loading, Dialog, FailToLoad, BackButton } from "components";

import {
  ADMIN_ORDERS_END_POINT,
  ADMIN_ORDERS_INVOICES_END_POINT,
  ADMIN_CASH_TRANSACTIONS_END_POINT,
  ADMIN_WAREHOUSES_OUT_NOTES_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
} from "__generated__/END_POINT";

type UNION_TYPE =
  | "TRANSACTION"
  | "ORDER"
  | "INVOICE"
  | "PURCHASE_ORDER"
  | "RECEIPT_ORDER"
  | "RETURN_ORDER"
  | "ORDER_INVOICE_SHIPPING"
  | "OUTNOTE";

interface PrintNoteProps {
  open: boolean;
  toggle: (newValue: boolean) => void;
  type: UNION_TYPE;
  id?: number | string | null;
}

const PrintNote = ({ open, toggle, type, id }: PrintNoteProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const [noteCode, setNoteCode] = useState("No name");
  const { enqueueSnackbarWithError } = useNotification();

  const { data: resData, error } = useSWR(() => {
    if (open) {
      id = id || (router.query.id as string);

      const generateAPI = (pathname: string) => {
        return `${pathname}${id}/pdf?use_cache=false`;
      };

      switch (type) {
        case "TRANSACTION":
          return generateAPI(ADMIN_CASH_TRANSACTIONS_END_POINT);
        case "ORDER":
          return generateAPI(ADMIN_ORDERS_END_POINT);
        case "INVOICE":
          return generateAPI(ADMIN_ORDERS_INVOICES_END_POINT);
        case "PURCHASE_ORDER":
          return generateAPI(ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT);
        case "RECEIPT_ORDER":
          return generateAPI(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT);
        case "RETURN_ORDER":
          return generateAPI(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT
          );
        case "OUTNOTE":
          return generateAPI(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT);
        case "ORDER_INVOICE_SHIPPING":
          return `${ADMIN_ORDERS_INVOICES_END_POINT}${id}/shipping-pdf/`;
        default:
          return null;
      }
    }
  });

  const printComponentRef = useRef(null);

  const printHandler = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: noteCode,
    onAfterPrint: function () {
      // enqueueSnackbar(
      //   formatMessage({
      //     id: "printSuccess",
      //     defaultMessage: "In hóa đơn thành công",
      //   }),
      //   {
      //     variant: "success",
      //   }
      // );
    },
    onBeforeGetContent: function () {},
    onPrintError: function () {
      enqueueSnackbarWithError(messages["printError"]);
    },
  });

  const children = useMemo(() => {
    if (error) {
      return <FailToLoad />;
    }

    if (resData === undefined) {
      return <Loading />;
    }

    if (type === "PURCHASE_ORDER" || type === "RECEIPT_ORDER") {
      setNoteCode(resData?.match(/<strong>Mã phiếu: (.*)<\/strong>/)?.[1]);
    } else if (type === "ORDER") {
      setNoteCode(resData?.match(/Số đơn đặt hàng: (.*)<\/span>/)?.[1]);
    }

    return (
      <Box ref={printComponentRef} className="print">
        <div
          dangerouslySetInnerHTML={{
            __html: createDOMPurify.sanitize(resData, {
              ADD_TAGS: ["html"],
              FORCE_BODY: true,
            }),
          }}
        ></div>

        <style type="text/css" media="print">
          {printStyle()}
        </style>
      </Box>
    );
  }, [open, error, resData, printComponentRef, type]);

  if (!open) {
    return null;
  }

  return (
    <Dialog
      {...{
        open,
        DialogProps: {
          PaperProps: {
            sx: {
              maxWidth: "90vw",
              width: "90vw",
            },
          },
        },
        onClose: () => {
          toggle(false);
        },
        DialogTitleProps: {
          children: messages["previewNote"],
        },
        dialogContentTextComponent: () => {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {children}
              </Grid>
            </Grid>
          );
        },
        DialogContentProps: {
          sx: {
            paddingTop: "16px !important",
          },
        },

        DialogActionsProps: {
          children: (
            <Stack direction={"row"} justifyContent="flex-end" spacing={3}>
              <BackButton
                onClick={() => {
                  toggle(false);
                }}
              />
              <Button variant="contained" onClick={printHandler}>
                {messages["print"]}
              </Button>
            </Stack>
          ),
        },
      }}
    />
  );
};

export default PrintNote;
