import {
  Control,
  Controller,
  UseFormWatch,
  UseFormSetValue,
  UseFormSetError,
  UseFormClearErrors,
} from "react-hook-form";
import { get } from "lodash";
import { Fragment } from "react";
import Dropzone from "react-dropzone";
import { Box, Grid, MenuItem, FormControl as FormControlV2 } from "@mui/material";

import currencyObj from "currency";
import { useIntl } from "react-intl";
import { dropzoneRejected } from "libs";
import { SettingSchemaProps } from "yups";
import { Ward, District, Province, Select, FormLabel } from "components";
import { AvatarForUpload, FormControl, FormControlForSelect } from "compositions";
import FormControlForPhoneNumber from "compositions/Input/FormControlForPhoneNumber";

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
                FormControlProps={{ required: true }}
              />
            );
          }}
        />
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
        <Controller
          control={control}
          name="tax_identification_number"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["taxIdentificationNumber"] as string}
                placeholder={messages["taxIdentificationNumber"] as string}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="store_name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["storeName"] as string}
                placeholder={messages["storeName"] as string}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="store_website"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["website"] as string}
                placeholder={messages["website"] as string}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="store_description"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["storeDescription"] as string}
                placeholder={messages["storeDescription"] as string}
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

      <Grid item xs={6}>
        <Controller
          control={control}
          name="hotline_1"
          render={(props) => {
            return (
              <FormControlForPhoneNumber
                controlState={props}
                // label={messages["hotline1"] as string}
              />
            );
          }}
        />
        {/* <FormControlForPhoneNumber
          {...{
            control,
            name: "hotline_1",
            label: messages["hotline1"] as string,
            placeholder: messages["hotline1"] as string,
          }}
        /> */}
      </Grid>

      <Grid item xs={6}>
        {/* <FormControlForPhoneNumber
          {...{
            control,
            name: "hotline_2",
            label: messages["hotline2"] as string,
            placeholder: messages["hotline2"] as string,
          }}
        /> */}
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="weight_unit"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["unit"] as string}
                placeholder={messages["unit"] as string}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="currency"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
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
                }}
                label={messages["currency"] as string}
                FormControlProps={{ required: true }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="bank_account_info"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label="Thông tin chuyển khoản"
                placeholder="Thông tin chuyển khoản"
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="invoice_notes"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["invoiceNote"] as string}
                placeholder={messages["invoiceNote"] as string}
                InputProps={{
                  multiline: true,
                  rows: 10,
                  sx: {
                    padding: 1,
                  },
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="logo"
          render={(props) => {
            const { field, fieldState } = props;

            const { onChange, value, name } = field;
            const { error } = fieldState;

            const src = get(value, "[0].file");

            return (
              <Dropzone
                onDrop={(acceptedFiles, rejectedFiles) => {
                  const isError = dropzoneRejected(rejectedFiles, name, setError);

                  if (isError) return;

                  clearErrors(name);

                  const transformedAcceptedFiles = acceptedFiles.map((el) => {
                    return {
                      file: el,
                    };
                  });

                  onChange(transformedAcceptedFiles);
                }}
                accept={{
                  "image/*": [],
                }}
                maxSize={1024 * 1024}
                multiple={false}
                maxFiles={1}
                disabled={!!src}
              >
                {({ getRootProps }) => {
                  return (
                    <FormControlV2 error={!!error}>
                      <FormLabel>{messages["logo"] as string}</FormLabel>
                      <Box {...getRootProps({})}>
                        <AvatarForUpload
                          src={src}
                          onRemove={() => {
                            onChange(null);
                          }}
                        />
                      </Box>
                    </FormControlV2>
                  );
                }}
              </Dropzone>
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="invoice_qr_code"
          render={(props) => {
            const { field, fieldState } = props;

            const { onChange, value, name } = field;
            const { error } = fieldState;

            const src = get(value, "[0].file");

            return (
              <Dropzone
                onDrop={(acceptedFiles, rejectedFiles) => {
                  const isError = dropzoneRejected(rejectedFiles, name, setError);

                  if (isError) return;

                  clearErrors(name);

                  const transformedAcceptedFiles = acceptedFiles.map((el) => {
                    return {
                      file: el,
                    };
                  });

                  onChange(transformedAcceptedFiles);
                }}
                accept={{
                  "image/*": [],
                }}
                maxSize={1024 * 1024}
                multiple={false}
                maxFiles={1}
                disabled={!!src}
              >
                {({ getRootProps }) => {
                  return (
                    <FormControlV2 error={!!error}>
                      <FormLabel>{messages["invoice_qr_code"] as string}</FormLabel>
                      <Box {...getRootProps({})}>
                        <AvatarForUpload
                          src={src}
                          onRemove={() => {
                            onChange(null);
                          }}
                        />
                      </Box>
                    </FormControlV2>
                  );
                }}
              </Dropzone>
            );
          }}
        />
      </Grid>
    </Fragment>
  );
};

export default SettingForm;
