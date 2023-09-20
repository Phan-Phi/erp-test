import { formatISO } from "date-fns";
import { useIntl } from "react-intl";
import { useMountedState } from "react-use";
import { useChoice, useNotification } from "hooks";
import React, { useCallback, useContext, useMemo } from "react";
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";
import { Button, Grid, MenuItem, Stack, Typography } from "@mui/material";

import get from "lodash/get";
import set from "lodash/set";

import {
  exportTransactionSchema,
  ExportTransactionSchemaProps,
  defaultExportTransactionFormState,
} from "yups";

import {
  Select,
  Checkbox,
  CheckboxItem,
  LoadingButton,
  DateTimePicker,
} from "components";

import axios from "axios.config";
import { EXPORT_FILE } from "apis";
import { ExportTransactionContext } from "./ExportTransactionContext";

const CreateExportTransaction = () => {
  const context = useContext(ExportTransactionContext);

  const choice = useChoice();
  const { messages } = useIntl();
  const isMounted = useMountedState();

  const { export_file_extensions } = choice;

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: defaultExportTransactionFormState(choice),
    resolver: exportTransactionSchema(choice),
  });

  const { fields, update } = useFieldArray({
    name: "field_options",
    control,
    keyName: "formId",
  });

  const onSelectAllFieldHandler = useCallback(
    (
      fields: FieldArrayWithId<ExportTransactionSchemaProps, "field_options", "formId">[]
    ) => {
      return () => {
        fields.forEach((el, idx) => {
          update(idx, { ...el, checked: !el.checked });
        });
      };
    },
    []
  );

  const onSubmit = useCallback(
    async (data: ExportTransactionSchemaProps) => {
      try {
        let dateEnd = get(data, "date_end");
        let dateStart = get(data, "date_start");
        let fieldOptions = get(data, "field_options");

        if (dateStart) {
          set(data, "date_start", formatISO(dateStart));
        }

        if (dateEnd) {
          set(data, "date_end", formatISO(dateEnd));
        }

        const selectedFieldOptions: string[] = [];

        fieldOptions.forEach((el) => {
          if (el.checked) {
            selectedFieldOptions.push(el.value);
          }
        });

        set(data, "field_options", selectedFieldOptions);

        setLoading(true);

        await axios.post(EXPORT_FILE, data);

        enqueueSnackbarWithSuccess("Tạo báo cáo thành công");

        context.state.mutateExportTransaction();

        reset(defaultExportTransactionFormState(choice), {
          keepDirty: false,
        });
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) setLoading(false);
      }
    },
    [context.state.mutateExportTransaction]
  );

  const renderFileExtension = useMemo(() => {
    return (
      <Select
        label="Định dạng file"
        control={control}
        name="file_ext"
        renderItem={() => {
          return export_file_extensions.map((el) => {
            return (
              <MenuItem key={el[0]} value={el[0]}>
                {el[1]}
              </MenuItem>
            );
          });
        }}
      />
    );
  }, []);

  const renderFields = useMemo(() => {
    return (
      <Grid container justifyContent="flex-start">
        <Grid item xs={12}>
          <Stack flexDirection="row" alignItems="center" columnGap={3}>
            <Typography variant="h6">Trường dữ liệu</Typography>
            <Button onClick={onSelectAllFieldHandler(fields)}>Chọn tất cả</Button>
          </Stack>
        </Grid>

        {fields.map((el, idx) => {
          const { formId, title, checked } = el;

          return (
            <Grid key={formId} item xs={3}>
              <Checkbox
                renderItem={() => {
                  return (
                    <CheckboxItem
                      label={title}
                      CheckboxProps={{
                        checked: checked,
                        onChange: (e) => {
                          update(idx, { ...el, checked: e.target.checked });
                        },
                      }}
                    />
                  );
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }, [fields]);

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={12}>
        <Typography variant="h2">Xuất file giao dịch</Typography>
      </Grid>

      <Grid item xs={4}>
        {renderFileExtension}
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
        {renderFields}
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

export default CreateExportTransaction;
