import useSWR from "swr";
import { useIntl } from "react-intl";
import React, { useState } from "react";
import { useUpdateEffect, usePrevious } from "react-use";
import { Control, Path, UseFormWatch, UseFormSetValue, PathValue } from "react-hook-form";

import { MenuItem, AutocompleteProps, InputProps } from "@mui/material";

import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import { PROVINCE } from "apis";
import { ProvinceTuple } from "interfaces";
import { Autocomplete } from "./Autocomplete";

type ExtractAutocompleteProps = Partial<
  Omit<
    AutocompleteProps<ProvinceTuple, undefined, undefined, undefined>,
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

export type ProvinceProps<T extends object> = ExtractAutocompleteProps &
  CommonProps &
  ConditionalProps<T>;

export const Province = <T extends object>(props: ProvinceProps<T> = {}) => {
  const { messages } = useIntl();
  const { onChange, name, control, watch, setValue, InputProps, ...restProps } = props;

  const [open, setOpen] = useState(false);
  const prevProvince = usePrevious(watch ? watch("province" as Path<T>) : null);

  const { data } = useSWR<ProvinceTuple[]>(() => {
    if (open) {
      return `${PROVINCE}?country=vn&step=1`;
    } else {
      return null;
    }
  });

  useUpdateEffect(() => {
    if (!prevProvince) {
      return;
    }

    if (!watch || !setValue) return;

    if (!isEqual(prevProvince, watch("province" as Path<T>))) {
      setValue("district" as Path<T>, null as PathValue<T, Path<T>>, {
        shouldDirty: true,
      });
      setValue("ward" as Path<T>, null as PathValue<T, Path<T>>, {
        shouldDirty: true,
      });
    }
  }, [prevProvince, watch && watch("province" as Path<T>)]);

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

            return option[0] === value[0];
          },
          loading: !data && open,
          fullWidth: true,

          ...restProps,
        }}
        InputProps={InputProps}
        label="Tỉnh/Thành"
        placeholder="Tỉnh/Thành"
        control={control}
        name={name}
      />
    );
  } else {
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
          onChange(event, value) {
            if (onChange) {
              onChange(value);
            }
          },
          loading: !data && open,
          fullWidth: true,

          ...restProps,
        }}
        InputProps={InputProps}
        label={messages["province"] as string}
        placeholder={messages["province"] as string}
      />
    );
  }
};
