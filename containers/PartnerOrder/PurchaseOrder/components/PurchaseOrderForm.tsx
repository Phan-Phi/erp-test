import { useIntl } from "react-intl";
import React, { Fragment } from "react";
import { useRouter } from "next/router";
import { Control, Controller } from "react-hook-form";

import { get, isEmpty } from "lodash";
import { Grid, MenuItem } from "@mui/material";

import { PARTNERS } from "routes";
import { Link } from "components";
import { FormControl, FormControlBase, LazyAutocomplete } from "compositions";

import {
  ADMIN_PARTNERS_END_POINT,
  ADMIN_WAREHOUSES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1,
  ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type PurchaseOrderFormProps = {
  control: any;
  defaultValues?: ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA_TYPE;
};

const PurchaseOrderForm = ({ control, defaultValues }: PurchaseOrderFormProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const _control =
    control as Control<ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA_TYPE>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        {router.query.id ? (
          <FormControlBase
            FormLabelProps={{ children: messages["warehouseName"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["warehouseName"] as string,
                defaultValue: get(defaultValues, "warehouse.name"),
              },
              readOnly: true,
            }}
          />
        ) : (
          <Fragment>
            <Controller
              name="warehouse"
              control={_control}
              render={(props) => {
                const { field, fieldState } = props;
                const { value, onChange } = field;
                const { error } = fieldState;
                return (
                  <LazyAutocomplete<ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1>
                    error={error}
                    url={ADMIN_WAREHOUSES_END_POINT}
                    label={messages["warehouseName"] as string}
                    placeholder={messages["warehouseName"] as string}
                    AutocompleteProps={{
                      value: value as any,
                      onChange: (_, value) => {
                        onChange(value);
                      },
                      getOptionLabel: (option) => option.name,
                      renderOption: (props, option) => {
                        return (
                          <MenuItem
                            {...props}
                            key={option.id}
                            value={option.id}
                            children={option.name}
                          />
                        );
                      },
                      isOptionEqualToValue: (option, value) => {
                        if (isEmpty(option) || isEmpty(value)) {
                          return true;
                        }

                        return option?.["id"] === value?.["id"];
                      },
                    }}
                  />
                );
              }}
            />
          </Fragment>
        )}
      </Grid>

      <Grid item xs={6}>
        {router.query.id ? (
          <Link
            href="#"
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault();
              const partnerId = get(defaultValues, "partner.id");

              if (partnerId) {
                window.open(`/${PARTNERS}/${partnerId}`, "_blank");
              }
            }}
          >
            <FormControlBase
              FormLabelProps={{ children: messages["partnerName"] as string }}
              InputProps={{
                inputProps: {
                  placeholder: messages["partnerName"] as string,
                  defaultValue: get(defaultValues, "partner.name"),
                },
                readOnly: true,
                sx: {
                  WebkitTextFillColor: ({ palette }) => {
                    return `${palette.primary2.main} !important`;
                  },
                },
              }}
            />
          </Link>
        ) : (
          <Fragment>
            <Controller
              name="partner"
              control={_control}
              render={(props) => {
                const { field, fieldState } = props;
                const { value, onChange } = field;
                const { error } = fieldState;
                return (
                  <LazyAutocomplete<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1>
                    error={error}
                    url={ADMIN_PARTNERS_END_POINT}
                    label={messages["partnerName"] as string}
                    placeholder={messages["partnerName"] as string}
                    AutocompleteProps={{
                      value: value as any,
                      onChange: (_, value) => {
                        onChange(value);
                      },
                      getOptionLabel: (option) => option.name,
                      renderOption: (props, option) => {
                        return (
                          <MenuItem
                            {...props}
                            key={option.id}
                            value={option.id}
                            children={option.name}
                          />
                        );
                      },
                      isOptionEqualToValue: (option, value) => {
                        if (isEmpty(option) || isEmpty(value)) {
                          return true;
                        }

                        return option?.["id"] === value?.["id"];
                      },
                    }}
                  />
                );
              }}
            />
          </Fragment>
        )}
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
                placeholder={messages["note"] as string}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  sx: {
                    padding: 1,
                  },
                }}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PurchaseOrderForm;
