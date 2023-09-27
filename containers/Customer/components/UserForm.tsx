import { useMemo } from "react";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import {
  Control,
  Controller,
  UseFormWatch,
  UseFormSetError,
  UseFormClearErrors,
} from "react-hook-form";

import useSWR from "swr";
import AddIcon from "@mui/icons-material/Add";
import { get, unset, groupBy, isEmpty } from "lodash";

import {
  Box,
  Grid,
  Stack,
  MenuItem,
  Autocomplete,
  FormControl as MuiFormControl,
} from "@mui/material";

import {
  Switch,
  Select,
  DatePicker,
  FormLabel,
  IconButton,
  FormControlForUpload,
  LoadingDynamic as Loading,
} from "components";

import {
  FormControl,
  InputForAutocomplete,
  FormControlForPhoneNumber,
} from "compositions";

import { transformUrl } from "libs";
import CreateTypeDialog from "../type/CreateTypeDialog";

import { usePermission, useChoice } from "hooks";
import { ADMIN_CUSTOMERS_TYPES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";
import { ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

interface ControlledUserDetailFormProps {
  control: any;
  watch: any;
  setError: any;
  clearErrors: any;
}

const ControlledUserDetailForm = (props: ControlledUserDetailFormProps) => {
  const choice = useChoice();
  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);
  const { hasPermission } = usePermission("write_customer_type");

  const control = props.control as Control<ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE>;
  const watch = props.watch as UseFormWatch<ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE>;
  const setError =
    props.setError as UseFormSetError<ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE>;

  const clearErrors =
    props.clearErrors as UseFormClearErrors<ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE>;

  const { data: customerTypeData, mutate } = useSWR<
    Required<ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1>[]
  >(() => {
    return transformUrl(ADMIN_CUSTOMERS_TYPES_END_POINT, {
      get_all: true,
      nested_depth: 1,
      use_cache: false,
    });
  });

  const renderGender = useMemo(() => {
    const { genders } = choice;

    return (
      <Select
        {...{
          name: "gender",
          control,
          label: messages["gender"] as string,

          renderItem: () => {
            return genders.map((el) => {
              return (
                <MenuItem key={el[0]} value={el[0]}>
                  {el[1]}
                </MenuItem>
              );
            });
          },
          FormControlProps: {
            required: true,
          },
        }}
      />
    );
  }, [choice]);

  const transformedData = useMemo(() => {
    if (customerTypeData == undefined) return;

    if (get(customerTypeData, "length") === 0) return [];

    let groupedData = groupBy(customerTypeData, "parent");

    const roots = get(groupedData, "null");
    unset(groupedData, "null");

    let orderedData: Required<ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1>[] = [];

    let traverseTree = (id: number, level: number) => {
      if (groupedData[id]) {
        for (let el of groupedData[id]) {
          orderedData.push(el);
          traverseTree(el.id, level + 1);
        }
      }

      return;
    };

    for (let root of roots) {
      orderedData.push(root);
      traverseTree(root.id, 1);
    }

    return orderedData;
  }, [customerTypeData]);

  const renderCustomerType = useMemo(() => {
    if (transformedData == undefined) return <Loading />;

    return (
      <Stack flexDirection="row" alignItems="center" columnGap={2}>
        <Box sx={{ flexGrow: 1 }}>
          <Controller
            control={control}
            name="type"
            render={(props) => {
              const { field, fieldState } = props;
              const { value, onChange } = field;
              const { error } = fieldState;

              return (
                <Autocomplete
                  fullWidth={true}
                  options={transformedData}
                  getOptionLabel={(option) => option.name}
                  value={value as any}
                  onChange={(_, value) => {
                    onChange(value);
                  }}
                  renderOption={(props, option) => {
                    return (
                      <MenuItem
                        {...props}
                        value={option.id}
                        children={option.name}
                        sx={{
                          marginLeft: option.level * 1.5,
                          fontWeight: (theme) => {
                            if (option.level === 0) {
                              return theme.typography.fontWeightBold;
                            } else if (option.level === 1) {
                              return theme.typography.fontWeightMedium;
                            } else {
                              return theme.typography.fontWeightRegular;
                            }
                          },
                          fontSize: (theme) => {
                            if (option.level === 0) {
                              return "16px";
                            } else if (option.level === 1) {
                              return "15px";
                            } else {
                              return "14px";
                            }
                          },
                        }}
                      />
                    );
                  }}
                  renderInput={(props) => {
                    return (
                      <InputForAutocomplete
                        {...props}
                        label={messages["customerType"] as string}
                        placeholder={messages["customerType"] as string}
                        error={!!error}
                        errorMessage={error && error.message}
                      />
                    );
                  }}
                  isOptionEqualToValue={(option, value) => {
                    if (isEmpty(option) || isEmpty(value)) {
                      return true;
                    }

                    return option?.["id"] === value?.["id"];
                  }}
                />
              );
            }}
          />
        </Box>

        {hasPermission && (
          <MuiFormControl fullWidth={false}>
            <FormLabel
              children="label"
              sx={{
                visibility: "hidden",
              }}
            />

            <IconButton
              children={<AddIcon />}
              onClick={() => {
                toggle(true);
              }}
            />
          </MuiFormControl>
        )}

        <CreateTypeDialog
          {...{
            open,
            toggle,
            mutate,
          }}
        />
      </Stack>
    );
  }, [transformedData, open]);

  return (
    <Grid container>
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
            placeholder: messages["birthday"] as string,
            DatePickerProps: {
              maxDate: new Date(),
            },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        {renderGender}
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="email"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["email"] as string}
                placeholder={messages["email"] as string}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="main_phone_number"
          render={(props) => {
            return (
              <FormControlForPhoneNumber
                controlState={props}
                label={messages["phoneNumber"] as string}
                InputProps={{
                  inputProps: {
                    placeholder: messages["phoneNumber"] as string,
                  },
                }}
                FormControlProps={{ required: true }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlForUpload
          control={control}
          setError={setError}
          clearErrors={clearErrors}
          name="avatar"
          label={messages["avatar"] as string}
          FormHelperTextProps={{
            children: "Dung lượng không được vượt quá 500Kb",
          }}
          DropzoneOptions={{
            maxSize: 500 * 1024,
          }}
        />
      </Grid>

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
          name="facebook"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["facebook"] as string}
                placeholder={messages["facebook"] as string}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        {renderCustomerType}
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="note"
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

      <Grid item xs={6}>
        <Switch
          {...{
            control,
            name: "in_business",
            label: watch("in_business")
              ? (messages["onBusiness"] as string) || ""
              : (messages["offBusiness"] as string) || "",
          }}
        />
      </Grid>
      <Grid item xs={6}></Grid>
    </Grid>
  );
};

export default ControlledUserDetailForm;
