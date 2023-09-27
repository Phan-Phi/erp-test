import { Card, CardHeader, CardContent } from "@mui/material";

import { Radio, RadioItem } from "components";

const DATA = [
  {
    value: "chart",
    displayValue: "Biểu đồ",
  },
  {
    value: "table",
    displayValue: "Báo cáo",
  },
];

type TValue = "chart" | "table";

interface DisplayCardProps {
  onChange: (value: TValue) => void;
  value: TValue;
}

export const DisplayCard = (props: DisplayCardProps) => {
  const { value, onChange } = props;

  return (
    <Card>
      <CardHeader title={"Kiểu hiển thị"} />
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
                  label={el.displayValue}
                  key={el.value}
                  RadioProps={{
                    value: el.value,
                  }}
                />
              );
            });
          }}
          RadioGroupProps={{
            onChange: (e, value) => {
              onChange(value as TValue);
            },
            value,
          }}
        />
      </CardContent>
    </Card>
  );
};
