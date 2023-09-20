import { formatISO } from "date-fns";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useChoice, useNotification } from "hooks";
import React, { useCallback, useContext, useMemo } from "react";
import { Grid, MenuItem, Stack, Typography } from "@mui/material";

import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";

import {
  exportDebtRecordSchema,
  ExportDebtRecordSchemaProps,
  defaultExportDebtRecordFormState,
} from "yups";

import { LoadingButton, DateTimePicker, LazyAutocomplete } from "components";

import axios from "axios.config";
import { EXPORT_FILE, CUSTOMER } from "apis";
import { ExportDebtRecordContext } from "./ExportDebtRecordContext";
import { CUSTOMER_ITEM } from "interfaces";

const CreateExportDebtRecord = () => {
  const context = useContext(ExportDebtRecordContext);

  const choice = useChoice();
  const { messages } = useIntl();
  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: defaultExportDebtRecordFormState(),
    resolver: exportDebtRecordSchema(choice),
  });

  const onSubmit = useCallback(
    async (data: ExportDebtRecordSchemaProps) => {
      try {
        let dateEnd = get(data, "date_end");
        let dateStart = get(data, "date_start");

        if (dateStart) {
          set(data, "date_start", formatISO(dateStart));
        }

        if (dateEnd) {
          set(data, "date_end", formatISO(dateEnd));
        }

        set(data, "customer", get(data, "customer.id"));

        setLoading(true);

        await axios.post(EXPORT_FILE, data);

        enqueueSnackbarWithSuccess("Tạo báo cáo thành công");

        context.state.mutateExportDebtRecord();

        reset(defaultExportDebtRecordFormState(), {
          keepDirty: false,
        });
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) setLoading(false);
      }
    },
    [context.state.mutateExportDebtRecord]
  );

  const renderCustomerField = useMemo(() => {
    return (
      <LazyAutocomplete<ExportDebtRecordSchemaProps, CUSTOMER_ITEM>
        {...{
          url: CUSTOMER,
          control,
          shouldSearch: true,
          name: "customer",
          label: messages["customer"] as string,
          placeholder: messages["customer"] as string,
          AutocompleteProps: {
            renderOption: (props, option) => {
              const lastName = get(option, "last_name");
              const firstName = get(option, "first_name");
              const fullName = `${lastName} ${firstName}`;

              return (
                <MenuItem
                  {...props}
                  key={option.id}
                  value={option.id}
                  children={fullName}
                />
              );
            },
            getOptionLabel: (option) => {
              const lastName = get(option, "last_name");
              const firstName = get(option, "first_name");
              const fullName = `${lastName} ${firstName}`;

              return fullName;
            },
            isOptionEqualToValue: (option, value) => {
              if (isEmpty(option) || isEmpty(value)) {
                return true;
              }

              return option?.["id"] === value?.["id"];
            },
          },
        }}
      />
    );
  }, []);

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={12}>
        <Typography variant="h2">Xuất file công nợ</Typography>
      </Grid>

      <Grid item xs={4}>
        {renderCustomerField}
      </Grid>

      <Grid item xs={4}>
        <DateTimePicker
          {...{
            control,
            name: "date_start",
            label: messages["dateStart"] as string,
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <DateTimePicker
          {...{
            control,
            name: "date_end",
            label: messages["dateEnd"] as string,
            DateTimePickerProps: {
              minDateTime: watch("date_start"),
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack flexDirection="row" justifyContent="flex-end" alignItems="center">
          <LoadingButton
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateExportDebtRecord;
