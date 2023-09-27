import {
  Grid,
  Button,
  MenuItem,
  FormControl as OriginalFormControl,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useMemo, useState, Fragment } from "react";
import { useUpdateEffect, useToggle } from "react-use";

import get from "lodash/get";
import dynamic from "next/dynamic";
import isEmpty from "lodash/isEmpty";

import {
  Switch,
  FormLabel,
  LazyAutocomplete,
  LoadingDynamic as Loading,
} from "components";

import {
  FormControl,
  FormControlForSelect,
  FormControlForNumber,
  LazyAutocomplete as LazyAutocomplete2,
} from "compositions";

import { useIntl } from "react-intl";
import { usePermission, useChoice } from "hooks";

import {
  ADMIN_PARTNERS_END_POINT,
  ADMIN_CUSTOMERS_END_POINT,
  ADMIN_ORDERS_INVOICES_END_POINT,
  ADMIN_CASH_PAYMENT_METHODS_END_POINT,
  ADMIN_WAREHOUSES_OUT_NOTES_END_POINT,
  ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

const ViewDetailLineDialog = dynamic(() => import("../ViewDetailLineDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const TransactionForm = ({ control, getValues, setValue, watch }: any) => {
  const { hasPermission: writePermission } = usePermission("write_transaction");

  const choice = useChoice();
  const [open, toggle] = useToggle(false);

  const { messages } = useIntl();
  const [maxAmount, setMaxAmount] = useState(0);

  useUpdateEffect(() => {
    setValue("target_id", null);
    setValue("source_id", null);
    setValue("target_name", "");
    setValue("amount", "0");
    setValue("source_type", "");
    setValue("source_id", null);
  }, [watch("target_type")]);

  useUpdateEffect(() => {
    const source = getValues("source_id");

    if (source) {
      const amount = parseFloat(get(source, "amount.incl_tax") || 0);
      const surcharge = parseFloat(get(source, "surcharge.incl_tax") || 0);
      const shippingCharge = parseFloat(get(source, "shipping_charge.incl_tax") || 0);
      const inMoney = parseFloat(
        get(source, "total_transaction_in_amount.incl_tax") || 0
      );
      const outMoney = parseFloat(
        get(source, "total_transaction_out_amount.incl_tax") || 0
      );

      const result = Math.abs(
        amount + surcharge + shippingCharge - Math.abs(inMoney - outMoney)
      );

      setValue("amount", result.toString());
      setMaxAmount(result);
    }
  }, [watch("source_id")]);

  useUpdateEffect(() => {
    const targetId = watch("target_id");
    const targetType = watch("target_type");

    let fullName = "-";

    if (targetType === "customer.customer") {
      const firstName = get(targetId, "first_name");
      const lastName = get(targetId, "last_name");

      fullName = `${firstName} ${lastName}`;
    } else if (targetType === "partner.partner") {
      fullName = get(targetId, "name");
    }

    if (targetId) {
      setValue("target_name", fullName);
    }
  }, [watch("target_id"), watch("target_type")]);

  useUpdateEffect(() => {
    setValue("source_id", null);
  }, [watch("source_type")]);

  const targetIdMemo = useMemo(() => {
    const targetType = watch("target_type");

    if (targetType !== "") {
      return (
        <Fragment>
          {targetType === "partner.partner" && (
            <Fragment>
              <Controller
                name="target_id"
                control={control}
                render={(props) => {
                  const { field, fieldState } = props;
                  const { value, onChange } = field;
                  const { error } = fieldState;
                  return (
                    <LazyAutocomplete2<any>
                      url={ADMIN_PARTNERS_END_POINT}
                      label={messages["targetId"] as string}
                      AutocompleteProps={{
                        disabled: !writePermission,
                        value: value as any,
                        onChange: (_, value) => {
                          onChange(value);
                        },
                        renderOption(props, option) {
                          return (
                            <MenuItem
                              {...props}
                              value={option.id}
                              children={`ID: ${option?.id} (${option?.name})`}
                            />
                          );
                        },
                        isOptionEqualToValue: (option, value) => {
                          if (isEmpty(option) || isEmpty(value)) {
                            return true;
                          }

                          return option?.["id"] === value?.["id"];
                        },
                        getOptionLabel: (option) => {
                          return `ID: ${option?.id} (${option?.name})`;
                        },
                      }}
                    />
                  );
                }}
              />
            </Fragment>
          )}

          {targetType === "customer.customer" && (
            <Fragment>
              <Controller
                name="target_id"
                control={control}
                render={(props) => {
                  const { field, fieldState } = props;
                  const { value, onChange } = field;
                  const { error } = fieldState;
                  return (
                    <LazyAutocomplete2<any>
                      url={ADMIN_CUSTOMERS_END_POINT}
                      label={messages["targetId"] as string}
                      AutocompleteProps={{
                        disabled: !writePermission,
                        value: value as any,
                        onChange: (_, value) => {
                          onChange(value);
                        },
                        renderOption(props, option) {
                          return (
                            <MenuItem
                              {...props}
                              value={option.id}
                              children={`ID: ${option?.id} (${option?.last_name} ${option?.first_name})`}
                            />
                          );
                        },

                        getOptionLabel: (option) => {
                          return `ID: ${option?.id} (${option?.last_name} ${option?.first_name})`;
                        },
                      }}
                    />
                  );
                }}
              />
            </Fragment>
          )}
        </Fragment>
      );
    } else {
      return null;
    }
  }, [watch("target_type")]);

  const allowedSourceTypeMemo = useMemo(() => {
    const targetType = watch("target_type");

    let filteredList = [""];

    if (targetType === "partner.partner") {
      filteredList.push("stock.receiptorder");
    } else if (targetType === "customer.customer") {
      filteredList.push("order.invoice");
    } else {
      filteredList.push("stock.stockoutnote");
    }

    return filteredList;
  }, [watch("target_type")]);

  const sourceIdMemo = useMemo(() => {
    const sourceType = watch("source_type");

    const Component = (url: string) => {
      return (
        <Fragment>
          <Controller
            name="source_id"
            control={control}
            render={(props) => {
              const { field, fieldState } = props;
              const { value, onChange } = field;
              const { error } = fieldState;
              return (
                <LazyAutocomplete2<any>
                  url={url}
                  label={messages["noteSid"] as string}
                  AutocompleteProps={{
                    disabled: !writePermission,
                    value: value as any,
                    onChange: (_, value) => {
                      onChange(value);
                    },
                    renderOption(props, option) {
                      return (
                        <MenuItem {...props} value={option.id} children={option.sid} />
                      );
                    },
                    isOptionEqualToValue: (option, value) => {
                      if (isEmpty(option) || isEmpty(value)) {
                        return true;
                      }

                      return option?.["id"] === value?.["id"];
                    },
                    getOptionLabel: (option) => {
                      return option.sid;
                    },
                  }}
                />
              );
            }}
          />
        </Fragment>
      );
    };

    if (sourceType !== "") {
      return (
        <Fragment>
          {sourceType === "stock.receiptorder" &&
            Component(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT)}
          {sourceType === "stock.stockoutnote" &&
            Component(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT)}
          {sourceType === "order.invoice" && Component(ADMIN_ORDERS_INVOICES_END_POINT)}
        </Fragment>
      );
    } else {
      return null;
    }
  }, [watch("source_type")]);

  const { transaction_source_types, transaction_flow_types, transaction_target_types } =
    choice;

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={4}>
        <Switch
          {...{
            name: "affect_creditor",
            control,
            label: messages["affectCreditor"] as string,
            FormControlProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Controller
          control={control}
          name="target_type"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  return [["", "None"], ...transaction_target_types].map((el) => {
                    if (el[0] === "") {
                      return (
                        <MenuItem key={el[0]} value={el[0]}>
                          {messages["none"]}
                        </MenuItem>
                      );
                    }

                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                }}
                label={messages["targetType"] as string}
                FormControlProps={{ disabled: !writePermission }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={4}>
        {targetIdMemo}
      </Grid>

      <Grid item xs={4}>
        <Controller
          control={control}
          name="target_name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["targetName"] as string}
                placeholder={messages["targetName"] as string}
                FormControlProps={{ disabled: !!watch("target_id") || !writePermission }}
                InputProps={{ readOnly: !writePermission }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Controller
          control={control}
          name="flow_type"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  return transaction_flow_types.map((el) => {
                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                }}
                label={messages["flowType"] as string}
                FormControlProps={{ required: true, disabled: !writePermission }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Controller
          name="type"
          control={control}
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;
            return (
              <LazyAutocomplete2<any>
                // error={error}
                url={ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT}
                label={messages["transactionType"] as string}
                placeholder={messages["transactionType"] as string}
                AutocompleteProps={{
                  disabled: !writePermission,
                  value: value as any,
                  onChange: (_, value) => {
                    onChange(value);
                  },
                  renderOption(props, option) {
                    return (
                      <MenuItem {...props} value={option.id} children={option.name} />
                    );
                  },
                  isOptionEqualToValue: (option, value) => {
                    if (isEmpty(option) || isEmpty(value)) {
                      return true;
                    }

                    return option?.["id"] === value?.["id"];
                  },
                  getOptionLabel: (option) => {
                    return option.name;
                  },
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Controller
          control={control}
          name="source_type"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  return [["", "None"], ...transaction_source_types].map((el) => {
                    if (el[0] === "") {
                      return (
                        <MenuItem key={el[0]} value={el[0]}>
                          {messages["none"]}
                        </MenuItem>
                      );
                    }

                    return (
                      <MenuItem
                        key={el[0]}
                        value={el[0]}
                        disabled={!allowedSourceTypeMemo.includes(el[0])}
                      >
                        {el[1]}
                      </MenuItem>
                    );
                  });
                }}
                label={messages["sourceType"] as string}
                FormControlProps={{ disabled: !writePermission }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={4}>
        {sourceIdMemo}
      </Grid>

      <Grid item xs={4}>
        {!!watch("source_id") && (
          <OriginalFormControl>
            <FormLabel
              children="Label"
              sx={{
                visibility: "hidden",
              }}
            />
            <Button
              variant="contained"
              sx={{
                width: "fit-content",
              }}
              onClick={() => {
                toggle(true);
              }}
            >
              {messages["viewDetail"]}
            </Button>
            {open && (
              <ViewDetailLineDialog
                {...{
                  open,
                  toggle,
                  sourceType: watch("source_type"),
                  source: watch("source_id"),
                }}
              />
            )}
          </OriginalFormControl>
        )}
      </Grid>

      <Grid item xs={4}>
        <Controller
          control={control}
          name="amount"
          render={(props) => {
            return (
              <FormControlForNumber
                placeholder={messages["amount"] as string}
                label={messages["amount"] as string}
                controlState={props}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                  isAllowed: ({ floatValue }) => {
                    return true;
                  },
                }}
                readOnly={!writePermission}
                FormControlProps={{
                  disabled: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <LazyAutocomplete<
          ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE,
          ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1
        >
          {...{
            url: ADMIN_CASH_PAYMENT_METHODS_END_POINT,
            control,
            name: "payment_method",
            label: messages["paymentMethod"] as string,
            placeholder: messages["paymentMethod"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.name} />;
              },

              getOptionLabel: (option) => {
                return option.name;
              },
              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },
              ...(!writePermission && {
                disabled: true,
              }),
            },
            InputProps: {
              ...(!writePermission && {
                readOnly: true,
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="address"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["address"] as string}
                FormControlProps={{
                  ...(!writePermission && {
                    disabled: true,
                  }),
                }}
                InputProps={{
                  ...(!writePermission && {
                    readOnly: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="notes"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["note"] as string}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  sx: {
                    padding: 1,
                  },
                  ...(!writePermission && {
                    readOnly: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TransactionForm;
