import { Fragment } from "react";
import { useIntl } from "react-intl";

import {
  Control,
  UseFormSetValue,
  UseFormWatch,
  UseFormSetError,
  UseFormClearErrors,
  Controller,
} from "react-hook-form";

import { Grid, MenuItem } from "@mui/material";

import {
  Ward,
  District,
  Province,
  FormControlForPhoneNumber,
  FormControlForUpload,
  Select,
} from "components";

import currencyObj from "currency";
import { SettingSchemaProps } from "yups";
import { FormControl } from "compositions";

interface SettingFormProps<T extends SettingSchemaProps = SettingSchemaProps> {
  control: Control<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
}

const SettingForm = ({
  control,
  setValue,
  watch,
  setError,
  clearErrors,
}: SettingFormProps) => {
  const { messages } = useIntl();

  return (
    <Fragment>
      <Grid item xs={6}>
        {/* <FormControl
          {...{
            control,
            name: "company_name",
            label: messages["companyName"] as string,
            placeholder: messages["companyName"] as string,
          }}
        /> */}

        <Controller
          control={control}
          name="company_name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["companyName"] as string}
                placeholder={messages["companyName"] as string}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="line1"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["address"] as string}
                placeholder={messages["address"] as string}
              />
            );
          }}
        />
        {/* <FormControl
          {...{
            control,
            name: "line1",
            label: messages["address"] as string,
            placeholder: messages["address"] as string,
            FormControlProps: {
              required: true,
            },
          }}
        /> */}
      </Grid>

      <Grid item xs={6}>
        <Province
          {...{
            control,
            setValue,
            watch,
            name: "province",
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <District
          {...{
            control,
            setValue,
            watch,
            name: "district",
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Ward
          {...{
            control,
            setValue,
            watch,
            name: "ward",
          }}
        />
      </Grid>

      <Grid item xs={6}>
        {/* <FormControl
          {...{
            control,
            name: "tax_identification_number",
            label: messages["taxIdentificationNumber"] as string,
            placeholder: messages["taxIdentificationNumber"] as string,
          }}
        /> */}
      </Grid>

      <Grid item xs={6}>
        {/* <FormControl
          {...{
            control,
            name: "store_name",
            label: messages["storeName"] as string,
            placeholder: messages["storeName"] as string,
          }}
        /> */}
      </Grid>

      <Grid item xs={6}>
        {/* <FormControl
          {...{
            control,
            name: "store_website",
            label: messages["website"] as string,
            placeholder: messages["website"] as string,
          }}
        /> */}
      </Grid>

      <Grid item xs={12}>
        {/* <FormControl
          {...{
            control,
            name: "store_description",
            label: messages["storeDescription"] as string,
            placeholder: messages["storeDescription"] as string,
            InputProps: {
              multiline: true,
              rows: 5,
              sx: {
                padding: 1,
              },
            },
          }}
        /> */}
      </Grid>

      <Grid item xs={6}>
        <FormControlForPhoneNumber
          {...{
            control,
            name: "hotline_1",
            label: messages["hotline1"] as string,
            placeholder: messages["hotline1"] as string,
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <FormControlForPhoneNumber
          {...{
            control,
            name: "hotline_2",
            label: messages["hotline2"] as string,
            placeholder: messages["hotline2"] as string,
          }}
        />
      </Grid>

      <Grid item xs={6}>
        {/* <FormControl
          {...{
            control,
            name: "weight_unit",
            label: messages["unit"] as string,
            placeholder: messages["unit"] as string,
          }}
        /> */}
      </Grid>

      <Grid item xs={6}>
        <Select
          {...{
            name: "currency",
            control,
            label: messages["currency"] as string,
            renderItem() {
              let data: JSX.Element[] = [];

              for (const key of Object.keys(currencyObj)) {
                const temp = (
                  <MenuItem key={key} value={currencyObj[key].currency}>
                    {currencyObj[key].currency}
                  </MenuItem>
                );

                data.push(temp);
              }

              return data;
            },
            FormControlProps: {
              required: true,
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        {/* <FormControl
          {...{
            control,
            name: "bank_account_info",
            label: "Thông tin chuyển khoản",
            placeholder: "Thông tin chuyển khoản",
          }}
        /> */}
      </Grid>

      <Grid item xs={12}>
        {/* <FormControl
          {...{
            control,
            name: "invoice_notes",
            label: messages["invoiceNote"] as string,
            placeholder: messages["invoiceNote"] as string,
            InputProps: {
              multiline: true,
              rows: 10,
              sx: {
                padding: 1,
              },
            },
          }}
        /> */}
      </Grid>

      <Grid item xs={6}>
        <FormControlForUpload
          {...{
            control,
            name: "logo",
            label: messages["logo"] as string,
            clearErrors,
            setError,
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <FormControlForUpload
          {...{
            control,
            name: "invoice_qr_code",
            label: messages["invoice_qr_code"] as string,
            clearErrors,
            setError,
          }}
        />
      </Grid>
    </Fragment>
  );
};

export default SettingForm;
