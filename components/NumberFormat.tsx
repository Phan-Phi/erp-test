import React from "react";

import OriginalNumberFormat, { NumberFormatProps } from "react-number-format";

export const NumberFormat = (props: NumberFormatProps) => {
  const { suffix, ...restProps } = props;

  return (
    <OriginalNumberFormat
      displayType="text"
      thousandSeparator={true}
      isNumericString={true}
      suffix={suffix ?? " ₫"}
      {...restProps}
    />
  );
};
