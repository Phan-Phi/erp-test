import useSWR from "swr";
import { useIntl } from "react-intl";
import { useState, Fragment } from "react";
import { CircularProgress, TextField } from "@mui/material";

import isEmpty from "lodash/isEmpty";

import Autocomplete from "../Autocomplete";
import { CHOICE_COUNTRY_DIVISION } from "../../apis";

const ProvinceInput = ({ control, setValue, getValues, watch, ...rest }) => {
  const { messages } = useIntl();
  const [open, setOpen] = useState(false);

  const { data: wardData } = useSWR(() => {
    const province = watch("province");
    const ward = watch("district");

    if (province && ward && open) {
      return `${CHOICE_COUNTRY_DIVISION}?country=vn&value=${province[0]}&step=2&value=${ward[0]}&step=3`;
    } else {
      return null;
    }
  });

  let loading = !wardData && open;

  return (
    <Autocomplete
      {...{
        name: "ward",
        control,
        label: messages["ward"],
        options: wardData || [],
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
              {...params}
              label={messages["ward"]}
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
        disabled: !watch("district"),
        ...rest,
      }}
    />
  );
};

export default ProvinceInput;
