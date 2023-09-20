import React from "react";
import { BarChart as OriginalBarChart } from "recharts";

const BarChart = (props: React.ComponentPropsWithoutRef<typeof OriginalBarChart>) => {
  return (
    <OriginalBarChart
      maxBarSize={48}
      margin={{
        top: 10,
        left: 40,
        right: 20,
      }}
      {...props}
    />
  );
};

export default BarChart;
