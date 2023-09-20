import { MenuItem } from "@mui/material";

import { Select } from "components";

const DATA = [
  {
    value: "by_revenue",
    displayValue: "Theo doanh thu",
  },
  {
    value: "by_quantity",
    displayValue: "Theo số lượng",
  },
];

interface SelectTypeProps {
  onChange: (value: any) => void;
}

const SelectTypeOfTopSale = ({ onChange }: SelectTypeProps) => {
  return (
    <Select
      {...{
        renderItem: () => {
          return DATA.map((el) => {
            return (
              <MenuItem key={el.value} value={el.value}>
                {el.displayValue}
              </MenuItem>
            );
          });
        },

        SelectProps: {
          defaultValue: "by_revenue",
          autoWidth: true,
          onChange: (e) => {
            onChange(e.target.value);
          },
        },

        defaultValue: "by_revenue",
        FormControlProps: {
          sx: {
            width: 200,
          },
        },
      }}
    />
  );
};

export default SelectTypeOfTopSale;
