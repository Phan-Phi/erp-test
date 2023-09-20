import React from "react";

import { Card, CardHeader, CardContent } from "@mui/material";

import { Radio, RadioItem } from "components";

const DATA = [
  {
    value: "import",
    displayValue: "Nhập hàng",
  },
  {
    value: "debt",
    displayValue: "Công nợ",
  },
];

type TValue = "import" | "debt";

interface ViewTypeProps {
  value: string;
  onChange: (value: TValue) => void;
}

export const ViewTypeForPartner = (props: ViewTypeProps) => {
  const { value } = props;

  return (
    <Card>
      <CardHeader title={"Mối quan tâm"} />
      <CardContent
        sx={{
          paddingTop: "0 !important",
        }}
      >
        <Radio
          renderItem={() => {
            return DATA.map((el) => {
              return (
                <RadioItem
                  key={el.value}
                  label={el.displayValue}
                  RadioProps={{
                    value: el.value,
                  }}
                />
              );
            });
          }}
          RadioGroupProps={{
            onChange: (e, value) => {
              props.onChange(value as TValue);
            },
            value,
          }}
        />
      </CardContent>
    </Card>
  );
};
