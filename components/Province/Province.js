import useSWR from "swr";
import { useIntl } from "react-intl";
import { useState, Fragment } from "react";
import { usePrevious, useUpdateEffect } from "react-use";

import { CircularProgress, TextField } from "@mui/material";

import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import Autocomplete from "../Autocomplete";

import { CHOICE_COUNTRY_DIVISION } from "../../apis";
import { transformUrl } from "../../libs";

const ProvinceInput = ({ control, setValue, getValues, watch, ...props }) => {
  const { messages } = useIntl();
  const [open, setOpen] = useState(false);
  const prevProvince = usePrevious(getValues("province"));

  const { data: provinceData } = useSWR(() => {
    if (open) {
      return transformUrl(CHOICE_COUNTRY_DIVISION, {
        country: "vn",
        step: 1,
      });
    } else {
      return null;
    }
  });

  useUpdateEffect(() => {
    if (!prevProvince) {
      return;
    }

    if (!isEqual(prevProvince, getValues("province"))) {
      setValue("district", null, {
        shouldDirty: true,
      });
      setValue("ward", null, {
        shouldDirty: true,
      });
    }
  }, [prevProvince, getValues("province")]);

  let loading = !provinceData && open;

  return (
    <Autocomplete
      {...{
        control,
        name: "province",
        label: messages["province"],
        options: provinceData || [],
        isOptionEqualToValue: (option, value) => {
          if (isEmpty(option) || isEmpty(value)) {
            return true;
          }

          if (value?.[0] === null) {
            return true;
          }

          return option?.[0] === value?.[0];
        },
        open: open,
        loading: loading,
        onOpen: () => {
          setOpen(true);
        },
        onClose: () => {
          setOpen(false);
        },
        renderInput: (params) => {
          const { InputLabelProps, InputProps, ...otherProps } = params;

          return (
            <TextField
              label={messages["province"]}
              variant="standard"
              InputLabelProps={{
                ...InputLabelProps,
              }}
              InputProps={{
                ...InputProps,
                endAdornment: (
                  <Fragment>
                    {loading ? <CircularProgress color="inherit" size={24} /> : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              }}
              {...otherProps}
            />
          );
        },
        ...props,
      }}
    />
  );
};

export default ProvinceInput;
