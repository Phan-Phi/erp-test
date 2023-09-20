import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { usePrevious } from "react-use";
import { isValid, compareAsc } from "date-fns";
import { FormattedMessage, useIntl } from "react-intl";

import { Box, Grid, Stack, MenuItem } from "@mui/material";

import { VOUCHERS } from "routes";
import { createNotistackMessage } from "libs/utils";
import { voucherSchema } from "libs/yupSchema";

import usePermission from "hooks/usePermission";

import { get, set, pick, isEmpty } from "libs";

import {
  LoadingButton,
  BackButton,
  Input,
  DateTimePicker,
  Switch,
  Select,
} from "components";

import DynamicMessage from "message";

const URL = process.env.NEXT_PUBLIC_DISCOUNT_VOUCHER_URL;

const DiscountForm = ({
  discountTypeList = [],
  voucherTypeList = [],
  choice,
  defaultValues,
  mutate = () => {},
  passHandler = () => {},
  actionComponent,
}) => {
  const { hasPermission: writePermission } = usePermission("write_voucher");

  const router = useRouter();

  const { formatMessage, messages } = useIntl();

  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    setError,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: yupResolver(voucherSchema(choice)),
  });

  const prevDicountType = usePrevious(getValues(["discount_type"]));

  useEffect(() => {
    if (isEmpty(prevDicountType)) {
      return;
    }

    setValue("discount_amount", 0, {
      shouldDirty: true,
    });
  }, [getValues("discount_type")]);

  const onSubmit = useCallback(async ({ data, router, dirtyFields }) => {
    let date_start = get(data, "date_start");
    let date_end = get(data, "date_end");

    if (isValid(date_start) && isValid(date_end)) {
      const result = compareAsc(date_end, date_start);

      if (result === -1) {
        setError("date_end", {
          type: "date_end",
          message: messages["message.error.dateEndIsMoreThanDateStart"],
        });

        return;
      }
    }

    setLoading(true);

    try {
      let body = {};
      let resData;

      if (!isEmpty(dirtyFields)) {
        body = pick(data, Object.keys(dirtyFields));
      }

      if (router.query.id) {
        const discountAmount = get(body, "discount_amount");
        const discountType = get(body, "discount_type");
        const defaultDiscountAmount = get(data, "discount_amount");
        const defaultDiscountType = get(data, "discount_type");

        if (discountAmount && !discountType) {
          set(body, "discount_type", defaultDiscountType);
        }

        if (!discountAmount && discountType) {
          set(body, "discount_amount", defaultDiscountAmount);
        }

        set(body, "id", router.query.id);
        const { data: responseData } = await axios.patch(URL, body);
        resData = responseData;
      } else {
        const { data: responseData } = await axios.post(URL, data);
        resData = responseData;
      }

      if (resData.status === "success") {
        enqueueSnackbar(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "voucher",
          }),
          {
            variant: "success",
          }
        );

        if (router.query.id) {
          reset(data, {
            keepDirty: false,
          });
        }

        mutate({ data: resData });
      } else {
        createNotistackMessage(resData.message, enqueueSnackbar);
      }

      setLoading(false);
    } catch (err) {
      createNotistackMessage(err.message, enqueueSnackbar);

      setLoading(false);
    }
  }, []);

  useEffect(() => {
    passHandler({
      handleSubmit,
      dirtyFields,
      reset,
      onSubmit,
    });
  }, [dirtyFields]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) => {
        onSubmit({ data, router, dirtyFields });
      })}
    >
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Input
            {...{
              name: "name",
              control,
              InputLabelProps: {
                children: (
                  <FormattedMessage id="voucher.voucherName" defaultMessage={"Voucher"} />
                ),
              },
              FormControlProps: {
                required: true,
              },
              InputProps: {
                ...(!writePermission && {
                  readOnly: true,
                  disableUnderline: true,
                }),
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            {...{
              name: "code",
              control,
              InputLabelProps: {
                children: (
                  <FormattedMessage
                    id="voucher.voucherCode"
                    defaultMessage={"Mã Voucher"}
                  />
                ),
              },
              FormControlProps: {
                required: true,
              },
              InputProps: {
                ...(!writePermission && {
                  readOnly: true,
                  disableUnderline: true,
                }),
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            {...{
              inputType: "number",
              name: "usage_limit",
              control,
              InputLabelProps: {
                children: (
                  <FormattedMessage
                    id="voucher.usageLimit"
                    defaultMessage={"Lượt dùng tối đa"}
                  />
                ),
              },
              InputProps: {
                suffix: "",
                allowNegative: false,
                ...(!writePermission && {
                  readOnly: true,
                }),
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            {...{
              control,
              name: "type",
              InputLabelProps: {
                children: (
                  <FormattedMessage
                    id="voucher.voucherType"
                    defaultMessage={"Loại voucher"}
                  />
                ),
              },
              items: () => {
                return voucherTypeList.map((el) => {
                  return (
                    <MenuItem key={el[0]} value={el[0]}>
                      {el[1]}
                    </MenuItem>
                  );
                });
              },
              FormControlProps: {
                required: true,
                ...(!writePermission && {
                  disabled: true,
                }),
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            {...{
              control,
              name: "discount_type",
              InputLabelProps: {
                children: (
                  <FormattedMessage
                    id="voucher.discountType"
                    defaultMessage={"Loại giảm giá"}
                  />
                ),
              },
              items: () => {
                return discountTypeList.map((el) => {
                  return (
                    <MenuItem key={el[0]} value={el[0]}>
                      {el[1]}
                    </MenuItem>
                  );
                });
              },
              FormControlProps: {
                required: true,
                ...(!writePermission && {
                  disabled: true,
                }),
              },
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            {...{
              inputType: "number",
              name: "discount_amount",
              control,
              InputLabelProps: {
                children: (
                  <FormattedMessage
                    id="voucher.usageLimit"
                    defaultMessage={"Lượt dùng tối đa"}
                  />
                ),
              },
              InputProps: {
                allowNegative: false,
                ...(watch("discount_type") === "Absolute"
                  ? { suffix: " ₫" }
                  : { suffix: " %" }),
                ...(!writePermission && {
                  readOnly: true,
                }),
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            {...{
              inputType: "number",
              name: "min_spent_amount",
              control,
              InputLabelProps: {
                children: (
                  <FormattedMessage
                    id="voucher.minSpentAmount"
                    defaultMessage={"Giá trị đơn hàng tối thiểu"}
                  />
                ),
              },
              InputProps: {
                allowNegative: false,
                ...(!writePermission && {
                  readOnly: true,
                }),
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            {...{
              inputType: "number",
              name: "min_checkout_items_quantity",
              control,
              InputLabelProps: {
                children: (
                  <FormattedMessage
                    id="voucher.minCheckoutItemsQuantity"
                    defaultMessage={"Số lượng sản phẩm tối thiểu"}
                  />
                ),
              },
              InputProps: {
                allowNegative: false,
                ...(!writePermission && {
                  readOnly: true,
                }),
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Switch
            {...{
              control,
              name: "apply_once_per_order",
              FormControlLabelProps: {
                label: (
                  <FormattedMessage
                    id="voucher.applyOncePerOrder"
                    defaultMessage={"Áp dụng một lần mỗi đơn hàng"}
                  />
                ),
                ...(!writePermission && {
                  disabled: true,
                }),
              },
              ...(!writePermission && {
                disabled: true,
              }),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Switch
            {...{
              control,
              name: "apply_once_per_customer",
              FormControlLabelProps: {
                label: (
                  <FormattedMessage
                    id="voucher.applyOncePerCustomer"
                    defaultMessage={"Áp dụng một lần mỗi khách hàng"}
                  />
                ),
                ...(!writePermission && {
                  disabled: true,
                }),
              },
              ...(!writePermission && {
                disabled: true,
              }),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <DateTimePicker
            {...{
              control,
              name: "date_start",
              label: (
                <FormattedMessage
                  id="voucher.date_start"
                  defaultMessage={"Ngày bắt đầu"}
                />
              ),
              ...(!writePermission && {
                disabled: true,
              }),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <DateTimePicker
            {...{
              control,
              name: "date_end",
              label: (
                <FormattedMessage
                  id="voucher.date_end"
                  defaultMessage={"Ngày kết thúc"}
                />
              ),
              ...(!writePermission && {
                disabled: true,
              }),
              minDateTime: watch("date_start"),
            }}
          />
        </Grid>
        {typeof actionComponent === "function" ? (
          actionComponent()
        ) : (
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <BackButton pathname={`/${VOUCHERS}`} />
              <LoadingButton loading={loading} type="create">
                {loading ? messages["creatingStatus"] : messages["createStatus"]}
              </LoadingButton>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DiscountForm;
