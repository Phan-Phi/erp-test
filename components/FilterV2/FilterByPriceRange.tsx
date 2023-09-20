import { useIntl } from "react-intl";
import { InputBase } from "components";
import { useUpdateEffect } from "react-use";
import NumberFormat from "react-number-format";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import { Stack, styled, Typography, Button } from "@mui/material";

type FilterByPriceRangeProps = {
  initPriceStart?: string;
  initPriceEnd?: string;
  onChangePriceStart?: (value: unknown) => void;
  onChangePriceEnd?: (value: unknown) => void;
};

const FilterByPriceRange = (props: FilterByPriceRangeProps) => {
  const {
    initPriceStart = "",
    initPriceEnd = "",
    onChangePriceStart,
    onChangePriceEnd,
  } = props;

  const [priceStart, setPriceStart] = useState<string>(initPriceStart);

  const [priceEnd, setPriceEnd] = useState<string>(initPriceEnd);

  const { messages } = useIntl();

  useUpdateEffect(() => {
    setPriceStart(initPriceStart);
  }, [initPriceStart]);

  useUpdateEffect(() => {
    setPriceEnd(initPriceEnd);
  }, [initPriceEnd]);

  const onFilterHandler = useCallback((priceStart: string, priceEnd: string) => {
    return () => {
      onChangePriceStart?.(priceStart);
      onChangePriceEnd?.(priceEnd);
    };
  }, []);

  const isDisabled = useMemo(() => {
    if (priceStart == "" || priceEnd == "") {
      return false;
    }

    if (parseFloat(priceStart) > parseFloat(priceEnd)) {
      return true;
    }

    return false;
  }, [priceStart, priceEnd]);

  return (
    <Fragment>
      <Stack spacing={2}>
        <StyledCardItem rowGap={1}>
          <StyledTypography variant="subtitle1">Từ</StyledTypography>

          <NumberFormat
            customInput={InputBase}
            suffix=" ₫"
            thousandSeparator
            onValueChange={(values) => {
              const { value } = values;

              setPriceStart(value);
            }}
            placeholder="Giá từ"
            value={priceStart}
            allowNegative={false}
          />
        </StyledCardItem>

        <StyledCardItem rowGap={1}>
          <StyledTypography variant="subtitle1">Đến</StyledTypography>
          <NumberFormat
            customInput={InputBase}
            suffix=" ₫"
            thousandSeparator
            onValueChange={(values) => {
              const { value } = values;

              setPriceEnd(value);
            }}
            placeholder="Giá đến"
            value={priceEnd}
            allowNegative={false}
          />
        </StyledCardItem>

        <Button
          children={messages["filter"]}
          disabled={!!isDisabled}
          onClick={onFilterHandler(priceStart, priceEnd)}
        />
      </Stack>
    </Fragment>
  );
};

const StyledTypography = styled(Typography)({});

const StyledCardItem = styled(Stack)(() => {
  return {};
});

export default FilterByPriceRange;
