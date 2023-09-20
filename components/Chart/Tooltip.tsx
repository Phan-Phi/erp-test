import { TooltipProps } from "recharts";

import { Box, Typography } from "@mui/material";

import FormatNumber from "components/FormatNumber";

type ValueType = number | string | Array<number | string>;
type NameType = number | string;

const Tooltip = <TValue extends ValueType, TName extends NameType>(
  props: TooltipProps<TValue, TName>
) => {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    const value = payload[0].value;
    const dataKey = payload[0].dataKey;

    return (
      <Box textAlign={"center"}>
        <Typography variant="h6">{payload[0]["name"]}</Typography>
        <FormatNumber
          children={value}
          {...(dataKey === "quantity" && {
            suffix: "",
          })}
        />
      </Box>
    );
  }

  return null;
};

export default Tooltip;
