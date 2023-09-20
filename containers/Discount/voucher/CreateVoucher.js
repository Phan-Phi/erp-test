import { useRouter } from "next/router";
import { FormattedMessage, useIntl } from "react-intl";

import { useMemo, useState, useEffect, useCallback } from "react";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { Grid } from "@mui/material";

import VoucherForm from "./VoucherForm";

import { VOUCHERS, EDIT } from "routes";
import { useChoice } from "hooks";
import { GridContainer, LoadingDynamic as Loading, Card } from "components";

const initState = {
  type: null,
  discount_type: null,
  name: "",
  code: "",
  usage_limit: "0",
  date_start: new Date(),
  date_end: null,
  apply_once_per_order: false,
  apply_once_per_customer: false,
  discount_amount: "0",
  min_spent_amount: "0",
  min_checkout_items_quantity: "0",
};

const CreateDiscount = () => {
  const choice = useChoice();

  const [discountTypeList, setDiscountTypeList] = useState(null);
  const [voucherTypeList, setVoucherTypeList] = useState(null);
  const [defaultValues, setDefaultValues] = useState(initState);
  const router = useRouter();

  useEffect(() => {
    const discountType = get(defaultValues, "discount_type");
    const type = get(defaultValues, "type");

    if (!isEmpty(choice) && discountType === null && type === null) {
      setDefaultValues((prev) => {
        return {
          ...prev,
          discount_type: get(choice, "discount_types[0][0]"),
          type: get(choice, "voucher_types[0][0]"),
        };
      });

      setDiscountTypeList(get(choice, "discount_types"));
      setVoucherTypeList(get(choice, "voucher_types"));
    }
  }, [choice, defaultValues]);

  const decorateMutate = useCallback(async ({ data }) => {
    const id = get(data, "data.id");
    if (id) {
      let pathname = `/${VOUCHERS}/${EDIT}/${id}`;
      router.push(pathname, pathname, {
        shallow: true,
      });
    }
  });

  const children = useMemo(() => {
    if (isEmpty(choice) || isEmpty(discountTypeList) || isEmpty(voucherTypeList)) {
      return <Loading />;
    }

    return (
      <VoucherForm
        {...{
          defaultValues,
          discountTypeList,
          voucherTypeList,
          choice,
          mutate: decorateMutate,
        }}
      />
    );
  });

  return (
    <GridContainer>
      <Grid item xs={6}>
        <Card
          title={
            <FormattedMessage
              id="voucher.createVoucherTitle"
              defaultMessage={"Tạo Voucher"}
            />
          }
          body={children}
        />
      </Grid>
    </GridContainer>
  );
};

export default CreateDiscount;
