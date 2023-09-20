import { useIntl } from "react-intl";
import { useUpdateEffect } from "react-use";
import { useState, forwardRef } from "react";
import NumberFormat from "react-number-format";
import { TextField, Stack, Button } from "@mui/material";

const NumberFormatCustom = forwardRef((props, ref) => {
  const { data, setData, keyProps, ...other } = props;

  return (
    <NumberFormat
      getInputRef={ref}
      suffix=" ₫"
      isNumericString
      thousandSeparator
      allowNegative={false}
      onValueChange={({ floatValue }) => {
        setData((prev) => {
          return {
            ...prev,
            [keyProps]: floatValue,
          };
        });
      }}
      {...other}
    />
  );
});

const DateRangeFilter = ({
  passHandler = () => {},
  initState,
  prefix = "price",
  label = {
    start: "",
    end: "",
  },
  ...props
}) => {
  const [data, setData] = useState(initState);
  const { messages } = useIntl();

  useUpdateEffect(() => {
    setData(initState);
  }, [initState]);

  return (
    <Stack spacing={3}>
      <TextField
        variant="standard"
        label={label.start}
        InputLabelProps={{
          sx: {
            fontSize: "14px",
          },
        }}
        InputProps={{
          inputComponent: NumberFormatCustom,
          inputProps: {
            ...props,
            data,
            setData,
            keyProps: `${prefix}_start`,
            defaultValue: data[`${prefix}_start`],
          },
          sx: {
            fontSize: "14px",
            paddingLeft: 0,
          },
        }}
      />

      <TextField
        variant="standard"
        label={label.end}
        InputLabelProps={{
          sx: {
            fontSize: "14px",
          },
        }}
        InputProps={{
          inputComponent: NumberFormatCustom,
          inputProps: {
            ...props,
            data,
            setData,
            keyProps: `${prefix}_end`,
            defaultValue: data[`${prefix}_end`],
          },
          sx: {
            fontSize: "14px",
            paddingLeft: 0,
          },
        }}
      />

      <Button
        variant="contained"
        disabled={data[`${prefix}_end`] < data[`${prefix}_start`]}
        onClick={() => {
          passHandler({
            [`${prefix}_start`]: data[`${prefix}_start`],
            [`${prefix}_end`]: data[`${prefix}_end`],
          });
        }}
      >
        {messages["filter"]}
      </Button>
    </Stack>
  );
};

export default DateRangeFilter;
