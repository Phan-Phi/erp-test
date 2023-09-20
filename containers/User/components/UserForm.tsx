import {
  Control,
  Controller,
  UseFormClearErrors,
  UseFormSetError,
} from "react-hook-form";
import {
  Grid,
  MenuItem,
  FormControl as FormControlV2,
  Box,
  FormHelperText,
} from "@mui/material";

import {
  Select,
  Switch,
  DatePicker,
  FormControlForPhoneNumber,
  FormControlForUpload,
  FormLabel,
} from "components";
import { useIntl } from "react-intl";
import { UserSchemaProps } from "yups";
import { AvatarForUpload, FormControl, FormControlForSelect } from "compositions";
import { useChoice, usePermission } from "hooks";
import Dropzone from "react-dropzone";
import { dropzoneRejected } from "libs";
import { get } from "lodash";

interface UserFormProps<T extends UserSchemaProps = UserSchemaProps> {
  control: Control<T>;
  clearErrors: UseFormClearErrors<T>;
  setError: UseFormSetError<T>;
}

const UserForm = ({ control, clearErrors, setError }: any) => {
  const { hasPermission: writePermission } = usePermission("write_user");

  const choice = useChoice();
  const { messages } = useIntl();

  const { genders } = choice;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Controller
          name="username"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["username"] as string}
                placeholder={messages["username"] as string}
                InputProps={{ readOnly: !writePermission }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={6}>
        <Controller
          name="last_name"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["lastName"] as string}
                placeholder={messages["lastName"] as string}
                InputProps={{ readOnly: !writePermission }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="first_name"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["firstName"] as string}
                placeholder={messages["firstName"] as string}
                InputProps={{ readOnly: !writePermission }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <DatePicker
          {...{
            control,
            name: "birthday",
            label: messages["birthday"] as string,
            DatePickerProps: {
              disabled: !writePermission,
              maxDate: new Date(),
            },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="gender"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  return genders.map((el) => {
                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                }}
                label={messages["gender"] as string}
                FormControlProps={{ required: true, disabled: !writePermission }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="email"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["email"] as string}
                placeholder={messages["email"] as string}
                InputProps={{ readOnly: !writePermission }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlForPhoneNumber
          {...{
            control,
            name: "main_phone_number",
            label: messages["phoneNumber"] as string,
            placeholder: messages["phoneNumber"] as string,

            FormControlProps: {
              required: true,
              disabled: !writePermission,
            },
            InputProps: {
              readOnly: !writePermission,
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="avatar"
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
                maxSize={500 * 1024}
                multiple={false}
                maxFiles={1}
                disabled={!!src}
              >
                {({ getRootProps }) => {
                  return (
                    <FormControlV2 error={!!error}>
                      <FormLabel>{messages["avatar"] as string}</FormLabel>
                      <Box {...getRootProps({})}>
                        <AvatarForUpload
                          src={src}
                          onRemove={() => {
                            onChange(null);
                          }}
                        />
                      </Box>

                      <FormHelperText>
                        Dung lượng không được vượt quá 500Kb
                      </FormHelperText>
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
          name="facebook"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["facebook"] as string}
                placeholder={messages["facebook"] as string}
                InputProps={{ readOnly: !writePermission }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}></Grid>

      <Grid item xs={12}>
        <Controller
          name="note"
          control={control}
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
                  readOnly: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Switch
          {...{
            control,
            name: "is_staff",
            label: (messages["staff"] as string) || "",
            FormControlProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Switch
          {...{
            control,
            name: "is_active",
            label: (messages["active"] as string) || "",
            FormControlProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default UserForm;
