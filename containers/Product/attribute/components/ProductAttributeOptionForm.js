import { useState } from "react";
import { useUpdateEffect } from "react-use";

import { useFieldArray, useController } from "react-hook-form";
import { useIntl } from "react-intl";
import { FormControl, Grid, Input, Chip, FormHelperText } from "@mui/material";

import { InputLabel } from "components";

import findIndex from "lodash/findIndex";

import isEmpty from "lodash/isEmpty";

const ProductAttributeOptionForm = ({ control, clearErrors }) => {
  const [inputValue, setInputValue] = useState("");
  const { messages } = useIntl();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const {
    fieldState: { error },
  } = useController({
    control,
    name: "options",
  });

  useUpdateEffect(() => {
    if (!isEmpty(fields) && error) {
      clearErrors("options");
    }
  }, [fields, error]);

  return (
    <Grid container spacing={3} marginTop={2}>
      <Grid item xs={12}>
        <InputLabel htmlFor="options" error={!!error}>
          {messages["optional"]}
        </InputLabel>
        <FormControl
          fullWidth
          margin="normal"
          variant="standard"
          error={!!error}
          sx={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 0,
            "& .MuiChip-root": {
              margin: "0.25rem",
            },
            "& .MuiInput-root": {
              flexGrow: 1,
            },
          }}
        >
          {fields.map((el, idx) => {
            return (
              <Chip
                key={el.id}
                label={el.value}
                onDelete={() => {
                  remove(idx);
                }}
              />
            );
          })}
          <Input
            id="options"
            error={!!error}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue && inputValue.trim()) {
                const index = findIndex(fields, {
                  value: inputValue,
                });

                if (index === -1) {
                  append({
                    name: inputValue,
                    value: inputValue,
                  });
                }
                setInputValue("");
                e.preventDefault();
              }
            }}
          />
        </FormControl>

        <FormHelperText
          sx={{
            paddingLeft: "16px",
            fontStyle: "italic",
          }}
          children={messages["pressHereToCreateOption"]}
        />

        {error && (
          <FormHelperText
            sx={{
              paddingLeft: "16px",
            }}
            error={!!error}
            children={error.message}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default ProductAttributeOptionForm;
