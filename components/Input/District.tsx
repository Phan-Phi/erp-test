import useSWR from "swr";
import { useIntl } from "react-intl";
import React, { useState } from "react";
import { usePrevious, useUpdateEffect } from "react-use";
import { Control, Path, UseFormWatch, UseFormSetValue, PathValue } from "react-hook-form";

import { MenuItem, AutocompleteProps, InputProps } from "@mui/material";

import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import { DISTRICT } from "apis";
import { DistrictTuple, ProvinceTuple } from "interfaces";
import { Autocomplete } from "./Autocomplete";

import { transformUrl } from "libs";

type ExtractAutocompleteProps = Partial<
  Omit<
    AutocompleteProps<DistrictTuple, undefined, undefined, undefined>,
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

export const District = <T extends object>(props: Props<T> = {}) => {
  const { messages } = useIntl();

  const { onChange, name, control, watch, setValue, InputProps, ...restProps } = props;

  const [open, setOpen] = useState(false);

  const prevDistrict = usePrevious(watch && watch("district" as Path<T>));

  useUpdateEffect(() => {
    if (!prevDistrict) {
      return;
    }

    if (watch && setValue) {
      if (!isEqual(prevDistrict, watch("district" as Path<T>))) {
        setValue("ward" as Path<T>, null as PathValue<T, Path<T>>, {
          shouldDirty: true,
        });
      }
    }
  }, [prevDistrict, watch && watch("district" as Path<T>)]);

  const { data } = useSWR<DistrictTuple[]>(() => {
    if (watch) {
      const province = watch("province" as Path<T>);

      if (open && province) {
        const [value] = province as ProvinceTuple;

        return transformUrl(DISTRICT, {
          country: "vn",
          step: 2,
          value,
        });
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

          disabled: !!!watch("province" as Path<T>),

          ...restProps,
        }}
        FormControlProps={{
          disabled: !!!watch("province" as Path<T>),
        }}
        InputProps={InputProps}
        label={messages["district"] as string}
        placeholder={messages["district"] as string}
        control={control}
        name={name}
      />
    );
  } else {
    return null;
  }
};
