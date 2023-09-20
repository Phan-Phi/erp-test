import useSWR from "swr";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Control, Path, UseFormWatch, UseFormSetValue } from "react-hook-form";

import { MenuItem, AutocompleteProps, InputProps } from "@mui/material";

import isEmpty from "lodash/isEmpty";

import { WARD } from "apis";
import { WardTuple, DistrictTuple, ProvinceTuple } from "interfaces";
import { Autocomplete } from "./Autocomplete";

type ExtractAutocompleteProps = Partial<
  Omit<
    AutocompleteProps<WardTuple, undefined, undefined, undefined>,
    "onChange" | "options" | "getOptionLabel" | "renderOption" | "ref" | "renderTags"
  >
>;

type CommonProps = {
  onChange?: (value: any) => void;
  InputProps?: InputProps;
};

type ConditionalProps<T extends object> =
  | {
      control: Control<T, any>;
      name: Path<T>;
      watch: UseFormWatch<T>;
      setValue: UseFormSetValue<T>;
    }
  | { control?: undefined; name?: never; watch?: never; setValue?: never };

type Props<T extends object> = ExtractAutocompleteProps &
  CommonProps &
  ConditionalProps<T>;

export const Ward = <T extends object>(props: Props<T> = {}) => {
  const { onChange, name, control, watch, setValue, InputProps, ...restProps } = props;

  const { messages } = useIntl();

  const [open, setOpen] = useState(false);

  const { data } = useSWR<WardTuple[]>(() => {
    if (watch) {
      const province = watch("province" as Path<T>);
      const district = watch("district" as Path<T>);

      if (open && district && province) {
        const [provinceValue] = district as DistrictTuple;
        const [districtValue] = district as ProvinceTuple;

        return `${WARD}?country=vn&value=${provinceValue}&step=2&value=${districtValue}&step=3`;
      } else {
        return null;
      }
    }
  });

  if (control && name) {
    return (
      <Autocomplete
        AutocompleteProps={{
          open,
          options: data ?? [],
          renderOption(props, option) {
            return <MenuItem {...props} value={option[0]} children={option[1]} />;
          },

          getOptionLabel: (option) => {
            const [, displayValue] = option;
            return displayValue;
          },
          onOpen: () => {
            setOpen(true);
          },
          onClose: () => {
            setOpen(false);
          },

          isOptionEqualToValue: (option, value) => {
            if (isEmpty(option) || isEmpty(value)) {
              return true;
            }

            return option?.[0] === value?.[0];
          },

          loading: !data && open,
          fullWidth: true,
          disabled: !!!watch("district" as Path<T>),

          ...restProps,
        }}
        FormControlProps={{
          disabled: !!!watch("district" as Path<T>),
        }}
        InputProps={InputProps}
        label={messages["ward"] as string}
        placeholder={messages["ward"] as string}
        control={control}
        name={name}
      />
    );
  } else {
    return null;
  }
};
