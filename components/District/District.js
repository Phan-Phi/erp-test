import useSWR from "swr";
import { useIntl } from "react-intl";
import { usePrevious } from "react-use";
import { useState, Fragment } from "react";
import { useUpdateEffect } from "react-use";

import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import { CircularProgress, TextField } from "@mui/material";

import Autocomplete from "../Autocomplete";
import { CHOICE_COUNTRY_DIVISION } from "../../apis";

const ProvinceInput = ({ control, setValue, getValues, watch, ...rest }) => {
  const { messages } = useIntl();
  const [open, setOpen] = useState(false);

  const prevDistrict = usePrevious(getValues("district"));

  useUpdateEffect(() => {
    if (!prevDistrict) {
      return;
    }

    if (!isEqual(prevDistrict, getValues("district"))) {
      setValue("ward", null, {
        shouldDirty: true,
      });
    }
  }, [prevDistrict, getValues("district")]);

  const { data: districtData } = useSWR(() => {
    const province = watch("province");

    if (province && open) {
      return `${CHOICE_COUNTRY_DIVISION}?country=vn&step=1&value=${province[0]}&step=2`;
    } else {
      return null;
    }
  });

  let loading = !districtData && open;

  return (
    <Autocomplete
      {...{
        name: "district",
        control,
        label: messages["district"],
        options: districtData || [],
        isOptionEqualToValue: (option, value) => {
          if (isEmpty(option) || isEmpty(value)) {
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
              label={messages["district"]}
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
        disabled: !watch("province"),
        ...rest,
      }}
    />
  );
};

export default ProvinceInput;
