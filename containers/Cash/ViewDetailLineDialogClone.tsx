import useSWR from "swr";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useIntl } from "react-intl";

import { Grid, Typography, Stack, Box } from "@mui/material";

import get from "lodash/get";

import { Dialog, BackButton, FormControlForNumber } from "components";

import { CompoundTableWithFunction } from "components/TableV2";

import {
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_QUANTITY,
  WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER,
  WAREHOUSE_OUT_NOTE_LINE,
  ORDER_INVOICE_QUANTITY,
} from "apis";

import { transformUrl } from "libs";

import InvoiceColumn from "./column/InvoiceColumn";
import ReceiptOrderColumn from "./column/ReceiptOrderColumn";
import StockOutNoteColumn from "./column/StockOutNoteColumn";
import ReturnOrderColumn from "./column/ReturnOrderColumn";
import { Row } from "react-table";
import { PRODUCTS } from "routes";

const ViewDetailLineDialogClone = ({ open, toggle, sourceType, source }) => {
  const { messages } = useIntl();
  const [returnAmount, setReturnAmount] = useState(0);

  const id = get(source, "id");
  const amount = parseFloat(get(source, "amount.incl_tax") || 0);
  const surcharge = parseFloat(get(source, "surcharge.incl_tax") || 0);
  const shippingCharge = parseFloat(get(source, "shipping_charge.incl_tax") || 0);
  const inMoney = parseFloat(get(source, "total_transaction_in_amount.incl_tax") || 0);
  const outMoney = parseFloat(get(source, "total_transaction_out_amount.incl_tax") || 0);

  const result = Math.abs(
    amount + surcharge + shippingCharge - Math.abs(inMoney - outMoney)
  );

  const { data: returnOrderData } = useSWR(() => {
    if (sourceType == "stock.receiptorder") {
      const params = {
        get_all: true,
        order: id,
        status: "Confirmed",
      };

      return transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER, params);
    }
  });

  useEffect(() => {
    if (sourceType == "stock.receiptorder") {
      if (returnOrderData == undefined) {
        return;
      }

      const temp = returnOrderData.reduce((totalValue, currentValue) => {
        const { amount, surcharge } = currentValue;

        const total =
          parseFloat(get(amount, "incl_tax")) + parseFloat(get(surcharge, "incl_tax"));

        return (totalValue += total);
      }, 0);

      setReturnAmount(temp);
    } else {
    }
  }, [returnOrderData, sourceType, source]);

  const onGotoHandler = useCallback((data: Row<any>) => {
    const productId =
      get(data, "original.line.variant.product") ||
      get(data, "original.variant.product.id");

    window.open(`/${PRODUCTS}/${productId}`, "_blank");
  }, []);

  const ViewLineListMemo = useMemo(() => {
    if (sourceType === "stock.receiptorder") {
      return (
        <CompoundTableWithFunction
          url={transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_QUANTITY, {
            order: id,
            nested_depth: 3,
          })}
          columnFn={ReceiptOrderColumn}
          onGotoHandler={onGotoHandler}
        />
      );
    } else if (sourceType === "stock.stockoutnote") {
      return (
        <CompoundTableWithFunction
          url={transformUrl(WAREHOUSE_OUT_NOTE_LINE, {
            stock_out_note: id,
            nested_depth: 3,
          })}
          columnFn={StockOutNoteColumn}
          onGotoHandler={onGotoHandler}
        />
      );
    } else if (sourceType == "order.invoice") {
      return (
        <CompoundTableWithFunction
          url={transformUrl(ORDER_INVOICE_QUANTITY, {
            invoice: id,
            nested_depth: 3,
          })}
          columnFn={InvoiceColumn}
          onGotoHandler={onGotoHandler}
        />
      );
    }

    return null;
  }, [sourceType, id]);

  const returnOrderLineMemo = useMemo(() => {
    if (sourceType !== "stock.receiptorder") {
      return null;
    }

    return (
      <Stack spacing={2}>
        <Typography>{messages["listingReturnOrderNote"]}</Typography>
        <CompoundTableWithFunction
          url={transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER, {
            order: id,
            status: "Confirmed",
          })}
          columnFn={ReturnOrderColumn}
          onGotoHandler={onGotoHandler}
        />
      </Stack>
    );
  }, [returnOrderData, sourceType, id]);

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          toggle(false);
        },
        DialogProps: {
          PaperProps: {
            sx: {
              width: "75vw",
              maxWidth: "85vw",
            },
          },
        },

        dialogContentTextComponent: () => {
          return (
            <Grid container>
              <Grid item xs={12}>
                <Stack flexDirection="row" columnGap={2} marginTop={2}>
                  <FormControlForNumber
                    label={messages["orderValue"] as string}
                    placeholder={messages["orderValue"] as string}
                    InputProps={{
                      readOnly: true,
                    }}
                    NumberFormatProps={{
                      value: amount,
                      suffix: " ₫",
                    }}
                  />

                  <FormControlForNumber
                    label={messages["surcharge"] as string}
                    placeholder={messages["surcharge"] as string}
                    InputProps={{
                      readOnly: true,
                    }}
                    NumberFormatProps={{
                      value: surcharge,
                      suffix: " ₫",
                    }}
                  />

                  {sourceType == "order.invoice" ? (
                    <FormControlForNumber
                      label={messages["shippingCharge"] as string}
                      placeholder={messages["shippingCharge"] as string}
                      InputProps={{
                        readOnly: true,
                      }}
                      NumberFormatProps={{
                        value: shippingCharge,
                        suffix: " ₫",
                      }}
                    />
                  ) : (
                    <Box width={"100%"} />
                  )}

                  <FormControlForNumber
                    label={messages["totalPrice"] as string}
                    placeholder={messages["totalPrice"] as string}
                    InputProps={{
                      readOnly: true,
                    }}
                    NumberFormatProps={{
                      value: amount + surcharge + shippingCharge - returnAmount,
                      suffix: " ₫",
                    }}
                  />
                </Stack>

                <Stack flexDirection="row" columnGap={2} marginTop={2}>
                  <FormControlForNumber
                    label={messages["inMoney"] as string}
                    placeholder={messages["inMoney"] as string}
                    InputProps={{
                      readOnly: true,
                    }}
                    NumberFormatProps={{
                      value: inMoney,
                      suffix: " ₫",
                    }}
                  />

                  <FormControlForNumber
                    label={messages["outMoney"] as string}
                    placeholder={messages["outMoney"] as string}
                    InputProps={{
                      readOnly: true,
                    }}
                    NumberFormatProps={{
                      value: outMoney,
                      suffix: " ₫",
                    }}
                  />

                  <Box width={"100%"}></Box>

                  <FormControlForNumber
                    label={messages["needToPay"] as string}
                    placeholder={messages["needToPay"] as string}
                    InputProps={{
                      readOnly: true,
                      sx: {
                        fontWeight: 700,
                      },
                    }}
                    NumberFormatProps={{
                      value: result - returnAmount,
                      suffix: " ₫",
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography>{messages["listingProduct"]}</Typography>
              </Grid>
              <Grid item xs={12}>
                {ViewLineListMemo}
              </Grid>

              <Grid item xs={12}>
                {returnOrderLineMemo}
              </Grid>
            </Grid>
          );
        },
        DialogActionsProps: {
          children: (
            <BackButton
              onClick={() => {
                toggle(false);
              }}
            />
          ),
        },
      }}
    />
  );
};

export default ViewDetailLineDialogClone;
