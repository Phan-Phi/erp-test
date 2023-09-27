import { Card, CardHeader, CardContent } from "@mui/material";

import { Radio, RadioItem } from "components";

const DATA = [
  {
    value: "time",
    displayValue: "Thời gian",
  },
  {
    value: "profit",
    displayValue: "Lợi nhuận",
  },
  {
    value: "discount",
    displayValue: "Giảm giá hóa đơn",
  },
  // {
  //   value: "return",
  //   displayValue: "Trả hàng",
  // },
  // {
  //   value: "employee",
  //   displayValue: "Nhân viên",
  // },
];

type TValue = "time" | "profit" | "discount";

interface ViewTypeProps {
  value: string;
  onChange: (value: TValue) => void;
}

export const ViewTypeForSale = (props: ViewTypeProps) => {
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
