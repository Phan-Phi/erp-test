import { Card, CardHeader, CardContent } from "@mui/material";

import { Radio, RadioItem } from "components";

const DATA = [
  {
    value: "sale",
    displayValue: "Bán hàng",
  },
  {
    value: "profit",
    displayValue: "Lợi nhuận",
  },
  {
    value: "warehouse_value",
    displayValue: "Giá trị kho",
  },
  {
    value: "import_export_stock",
    displayValue: "Xuất nhập tồn",
  },
];

type TValue = "sale" | "profit" | "warehouse_value" | "import_export_stock";

interface ViewTypeProps {
  value: string;
  onChange: (value: TValue) => void;
}

export const ViewTypeForProduct = (props: ViewTypeProps) => {
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
