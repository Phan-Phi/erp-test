import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import useSWR from "swr";
import { get } from "lodash";
import { Box, Grid, Stack, Typography } from "@mui/material";

import { InputNumber } from "compositions";
import Invoice from "containers/Cash/Invoice";
import OrderLine from "containers/Cash/OrderLine";
import StockOutNote from "containers/Cash/StockOutNote";
import ReceiptOrder from "containers/Cash/ReceiptOrder";
import { BackButton, LoadingDynamic } from "components";

import { PRODUCTS } from "routes";
import { transformUrl } from "libs";

import {
  ADMIN_CASH_DEBT_RECORDS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
} from "__generated__/END_POINT";

import { ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export default function ViewDetailDebt() {
  const router = useRouter();
  const { messages } = useIntl();
  const [returnAmount, setReturnAmount] = useState(0);
  const [data, setData] = useState<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1>();

  const { data: dataDebt } = useSWR<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1>(() => {
    return transformUrl(`${ADMIN_CASH_DEBT_RECORDS_END_POINT}${router.query.id}`);
  });

  const { data: allDataDebt } = useSWR<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1[]>(() => {
    const creditorType = get(dataDebt, "creditor_type");

    const params = {
      get_all: true,
      creditor_type: creditorType,
    };

    return transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, params);
  });

  useEffect(() => {
    if (dataDebt == undefined || allDataDebt == undefined) return;

    if (
      dataDebt.source_type === "stock.receiptorder" ||
      dataDebt.source_type === "order.invoice"
    ) {
      setData(dataDebt);
    } else {
      const filterData = allDataDebt.filter((item) => {
        const getIdOfAllData = get(item, "source.id");

        const getOrderOfDataDebt = get(dataDebt, "source.order");

        return getIdOfAllData === getOrderOfDataDebt;
      });

      setData(filterData[0]);
    }
  }, [dataDebt, allDataDebt]);

  const source = get(data, "source");
  const id = get(source, "id");
  const sourceType: any = get(data, "source_type");

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

      return transformUrl(
        ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
        params
      );
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
    if (sourceType == undefined) return null;

    if (sourceType === "stock.receiptorder") {
      return (
        <Fragment>
          <ReceiptOrder id={id} onGotoHandler={onGotoHandler} />
        </Fragment>
      );
    } else if (sourceType === "stock.stockoutnote") {
      return (
        <Fragment>
          <StockOutNote id={id} onGotoHandler={onGotoHandler} />
        </Fragment>
      );
    } else if (sourceType == "order.invoice") {
      return (
        <Fragment>
          <Invoice id={id} onGotoHandler={onGotoHandler} />
        </Fragment>
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
        <OrderLine id={id} onGotoHandler={onGotoHandler} />
      </Stack>
    );
  }, [returnOrderData, sourceType, id]);

  if (data == undefined) return <LoadingDynamic />;

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Stack flexDirection="row" columnGap={2} marginTop={2}>
            <InputNumber
              readOnly={true}
              FormLabelProps={{
                children: messages["orderValue"] as string,
              }}
              InputProps={{
                inputProps: { placeholder: messages["orderValue"] as string },
              }}
              NumberFormatProps={{
                value: amount,
                suffix: " ₫",
              }}
            />

            <InputNumber
              readOnly={true}
              FormLabelProps={{
                children: messages["surcharge"] as string,
              }}
              InputProps={{
                inputProps: { placeholder: messages["surcharge"] as string },
              }}
              NumberFormatProps={{
                value: surcharge,
                suffix: " ₫",
              }}
            />

            {sourceType == "order.invoice" ? (
              <InputNumber
                readOnly={true}
                FormLabelProps={{
                  children: messages["shippingCharge"] as string,
                }}
                InputProps={{
                  inputProps: { placeholder: messages["shippingCharge"] as string },
                }}
                NumberFormatProps={{
                  value: shippingCharge,
                  suffix: " ₫",
                }}
              />
            ) : (
              <Box width={"100%"} />
            )}

            <InputNumber
              readOnly={true}
              FormLabelProps={{
                children: messages["totalPrice"] as string,
              }}
              InputProps={{
                inputProps: { placeholder: messages["totalPrice"] as string },
              }}
              NumberFormatProps={{
                value: amount + surcharge + shippingCharge - returnAmount,
                suffix: " ₫",
              }}
            />
          </Stack>

          <Stack flexDirection="row" columnGap={2} marginTop={2}>
            <InputNumber
              readOnly={true}
              FormLabelProps={{
                children: messages["inMoney"] as string,
              }}
              InputProps={{
                inputProps: { placeholder: messages["inMoney"] as string },
              }}
              NumberFormatProps={{
                value: inMoney,
                suffix: " ₫",
              }}
            />

            <InputNumber
              readOnly={true}
              FormLabelProps={{
                children: messages["outMoney"] as string,
              }}
              InputProps={{
                inputProps: { placeholder: messages["outMoney"] as string },
              }}
              NumberFormatProps={{
                value: outMoney,
                suffix: " ₫",
              }}
            />

            <Box width={"100%"}></Box>

            <InputNumber
              readOnly={true}
              FormLabelProps={{
                children: messages["needToPay"] as string,
              }}
              InputProps={{
                inputProps: { placeholder: messages["needToPay"] as string },
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
          {ViewLineListMemo !== null && (
            <Typography>{messages["listingProduct"]}</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          {ViewLineListMemo}
        </Grid>

        <Grid item xs={12}>
          {returnOrderLineMemo}
        </Grid>
      </Grid>

      <BackButton onClick={() => router.back()} />
    </Box>
  );
}
