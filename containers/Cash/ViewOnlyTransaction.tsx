import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";

import get from "lodash/get";

import {
  Grid,
  Button,
  Stack,
  Typography,
  FormControl as MuiFormControl,
} from "@mui/material";

import {
  Switch,
  Card,
  FormLabel,
  BackButton,
  FormControl,
  FormControlForNumber,
  LoadingDynamic as Loading,
} from "components";

import { useChoice, usePermission } from "hooks";
import { getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

const ViewDetailLine = dynamic(() => import("./ViewDetailLineDialog"), {
  loading: () => {
    return <Loading />;
  },
});

interface ViewOnlyTransactionProps {
  data: ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE;
}

const ViewOnlyTransaction = ({ data }: ViewOnlyTransactionProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);
  const { transaction_flow_types } = useChoice();
  const [openPrintNote, togglePrintNote] = useToggle(false);

  const { hasPermission: readReceiptOrderPermission } =
    usePermission("read_receipt_order");

  const { hasPermission: readReturnOrderPermission } = usePermission("read_return_order");

  const { hasPermission: readStockOutNotePermission } =
    usePermission("read_stock_out_note");

  const { hasPermission: readInvoicePermission } = usePermission("read_invoice");

  const ViewDetailMemo = useMemo(() => {
    const sourceType = get(data, "source_type");

    let Component: React.ReactNode = (
      <Fragment>
        <MuiFormControl>
          <FormLabel
            sx={{
              visibility: "hidden",
            }}
          >
            Label
          </FormLabel>
          <Button
            sx={{
              display: !data.source_id ? "none" : "block",
              width: "fit-content",
            }}
            onClick={() => {
              toggle(true);
            }}
          >
            {messages["viewDetail"]}
          </Button>
        </MuiFormControl>

        {open && (
          <ViewDetailLine
            {...{
              open,
              toggle,
              sourceType: get(data, "source_type"),
              source: get(data, "source_id"),
            }}
          />
        )}
      </Fragment>
    );

    if (
      sourceType === "stock.receiptorder" &&
      (!readReceiptOrderPermission || !readReturnOrderPermission)
    )
      Component = null;

    if (sourceType === "stock.stockoutnote" && !readStockOutNotePermission)
      Component = null;

    if (sourceType === "order.invoice" && !readInvoicePermission) Component = null;

    return Component;
  }, [
    readInvoicePermission,
    readStockOutNotePermission,
    readReturnOrderPermission,
    readReceiptOrderPermission,
    data,
    open,
  ]);

  return (
    <Grid container>
      <Grid item xs={10}>
        <Card
          cardTitleComponent={() => {
            return (
              <Stack flexDirection="row" justifyContent="space-between">
                <Typography fontWeight={700}>{messages["viewTransaction"]}</Typography>

                <Stack flexDirection="row" columnGap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      togglePrintNote(true);
                    }}
                  >
                    {messages["printNote"]}
                  </Button>
                </Stack>
              </Stack>
            );
          }}
          body={
            <Grid container>
              <Grid item xs={4}>
                <Switch
                  {...{
                    label: messages["affectCreditor"] as string,

                    SwitchProps: {
                      checked: get(data, "affect_creditor"),
                      readOnly: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <FormControl
                  {...{
                    label: messages["targetType"] as string,
                    placeholder: messages["targetType"] as string,

                    InputProps: {
                      readOnly: true,
                      value:
                        messages[
                          `transaction_target_types.${get(data, "target_type")}`
                        ] || "None",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}></Grid>

              <Grid item xs={4}>
                <FormControl
                  {...{
                    label: messages["targetName"] as string,
                    placeholder: messages["targetName"] as string,

                    InputProps: {
                      value: get(data, "target_name"),
                      readOnly: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <FormControl
                  {...{
                    label: messages["flowType"] as string,
                    placeholder: messages["flowType"] as string,
                    InputProps: {
                      readOnly: true,
                      value:
                        getDisplayValueFromChoiceItem(
                          transaction_flow_types,
                          get(data, "flow_type")
                        ) || "-",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <FormControl
                  {...{
                    label: messages["transactionType"] as string,
                    placeholder: messages["transactionType"] as string,
                    InputProps: {
                      readOnly: true,
                      value: get(data, "type.name") || "-",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <FormControl
                  {...{
                    label: messages["sourceType"] as string,
                    placeholder: messages["sourceType"] as string,
                    InputProps: {
                      readOnly: true,
                      value:
                        messages[
                          `transaction_source_types.${get(data, "source_type")}`
                        ] || "-",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <FormControl
                  {...{
                    label: messages["noteSid"] as string,
                    placeholder: messages["noteSid"] as string,
                    InputProps: {
                      readOnly: true,
                      value: get(data, "source_id.sid", "-"),
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                {ViewDetailMemo}
              </Grid>

              <Grid item xs={4}>
                <FormControlForNumber
                  {...{
                    label: messages["amount"] as string,
                    placeholder: messages["amount"] as string,
                    InputProps: {
                      readOnly: true,
                    },

                    NumberFormatProps: {
                      value: get(data, "amount", 0),
                      suffix: " ₫",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <FormControl
                  {...{
                    label: messages["paymentMethod"] as string,
                    placeholder: messages["paymentMethod"] as string,
                    InputProps: {
                      readOnly: true,
                      value: get(data, "payment_method.name") || "-",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}></Grid>
              <Grid item xs={12}>
                <FormControl
                  {...{
                    label: messages["address"] as string,
                    placeholder: messages["address"] as string,

                    InputProps: {
                      readOnly: true,
                      value: get(data, "address") || "-",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  {...{
                    label: messages["note"] as string,
                    placeholder: messages["note"] as string,

                    InputProps: {
                      readOnly: true,
                      multiline: true,
                      rows: 5,
                      value: get(data, "notes") || "-",
                      sx: {
                        padding: 1,
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          }
        />
      </Grid>

      <Grid item xs={10}>
        <Stack flexDirection="row" alignItems={"center"}>
          <BackButton onClick={() => router.back()} />
          {/* <BackButton pathname={`/${CASHES}`} /> */}
        </Stack>
      </Grid>

      {openPrintNote && (
        <PrintNote
          {...{
            open: openPrintNote,
            toggle: togglePrintNote,
            id: router.query.id as string,
            type: "TRANSACTION",
          }}
        />
      )}
    </Grid>
  );
};

export default ViewOnlyTransaction;
