import useSWR from "swr";
import queryString from "query-string";
import { useRouter } from "next/router";
import { FormattedMessage, useIntl } from "react-intl";
import { useMemo, useState, useEffect, useCallback, Fragment } from "react";

import { Grid, Stack } from "@mui/material";

import DiscountForm from "./VoucherForm";

import Connection from "./connection";
import { VOUCHERS } from "routes";

import { usePermission, useChoice } from "hooks";
import {
  BackButton,
  LoadingButton,
  GridContainer,
  FailToLoad,
  LoadingDynamic as Loading,
  Card,
} from "components";

import { get, set, unset, isEmpty } from "libs";

const URL = process.env.NEXT_PUBLIC_DISCOUNT_VOUCHER_URL;

const EditDiscount = () => {
  const { hasPermission: writePermission } = usePermission("write_voucher");

  const { messages } = useIntl();

  const choice = useChoice();
  const [defaultValues, setDefaultValues] = useState(null);
  const [discountTypeList, setDiscountTypeList] = useState(null);
  const [voucherTypeList, setVoucherTypeList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitState, setSubmitState] = useState({});
  const router = useRouter();

  const {
    data: rootData,
    error: rootDataError,
    mutate: mutateRootData,
  } = useSWR(() => {
    const id = router.query.id;

    if (id) {
      const params = {
        id,
        use_cache: false,
      };

      const stringifyParams = queryString.stringify(params);

      return `${URL}?${stringifyParams}`;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (!isEmpty(choice)) {
      setDiscountTypeList(get(choice, "discount_types"));
      setVoucherTypeList(get(choice, "voucher_types"));
    }
  }, [choice]);

  useEffect(() => {
    const data = get(rootData, "data");

    if (data) {
      unset(data, "used");
      const minSpentAmount = get(data, "min_spent_amount");

      if (minSpentAmount) {
        set(data, "min_spent_amount", get(minSpentAmount, "incl_tax"));
      }

      setDefaultValues(data);
    }
  }, [rootData]);

  const decorateMutate = useCallback(async () => {
    await mutateRootData();
  }, []);

  const passHandler = useCallback(({ ...props }) => {
    setSubmitState({
      ...props,
    });
  }, []);

  const onSubmit = useCallback((submitState, router) => {
    const { dirtyFields, handleSubmit, onSubmit } = submitState;

    handleSubmit(async (data) => {
      setLoading(true);

      await onSubmit({ data, router, dirtyFields });

      setLoading(false);
    })();
  }, []);

  const children = useMemo(() => {
    if (rootDataError || get(rootDataError, "status") === "error") {
      return <FailToLoad />;
    }

    if (
      isEmpty(choice) ||
      isEmpty(defaultValues) ||
      isEmpty(discountTypeList) ||
      isEmpty(voucherTypeList)
    ) {
      return <Loading />;
    }

    return (
      <DiscountForm
        {...{
          defaultValues,
          discountTypeList,
          voucherTypeList,
          choice,
          mutate: decorateMutate,
          passHandler,
          actionComponent: () => {
            return null;
          },
        }}
      />
    );
  });

  return (
    <GridContainer>
      <Grid item xs={7}>
        <Card
          title={
            <FormattedMessage
              id="voucher.updateVoucherTitle"
              defaultMessage={"Cập nhật voucher"}
            />
          }
          body={children}
        />
      </Grid>
      <Grid item xs={7}>
        <Connection />
      </Grid>

      <Grid item xs={7}>
        <Stack direction="row" justifyContent="space-between">
          <BackButton pathname={`/${VOUCHERS}`} />
          {writePermission && (
            <LoadingButton
              loading={loading}
              type="update"
              onClick={() => {
                onSubmit(submitState, router);
              }}
            >
              {loading ? messages["updatingStatus"] : messages["updateStatus"]}
            </LoadingButton>
          )}
        </Stack>
      </Grid>
    </GridContainer>
  );
};

export default EditDiscount;
