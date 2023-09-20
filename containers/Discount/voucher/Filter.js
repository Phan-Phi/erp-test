import { Stack, Button } from "@mui/material";

import { useIntl } from "react-intl";
import { useState, useEffect } from "react";

import { useChoice } from "hooks";

import {
  RangeFilter as Range,
  SelectFilter as Select,
  LoadingDynamic as Loading,
  InputSearchFilter as InputSearch,
} from "components";
import { isEmpty, get } from "libs";

const Filter = ({ passHandler: setExternalFilter, data, reset }) => {
  const choice = useChoice();
  const { formatMessage, messages } = useIntl();
  const [voucherTypeList, setVoucherTypeList] = useState(null);
  const [discountTypeList, setDiscountTypeList] = useState(null);

  useEffect(() => {
    if (!isEmpty(choice)) {
      if (!voucherTypeList) {
        let voucherType = get(choice, "voucher_types");
        setVoucherTypeList(voucherType);
      }

      if (!discountTypeList) {
        let discountType = get(choice, "discount_types");
        setDiscountTypeList(discountType);
      }
    }
  }, [choice, voucherTypeList, discountTypeList]);

  if (!voucherTypeList || !discountTypeList) {
    return <Loading />;
  }

  return (
    <Stack spacing={3}>
      <InputSearch
        {...{
          initSearch: data["search"],
          passHandler: setExternalFilter,
          label: messages["filter.search"],
        }}
      />

      <Range
        {...{
          label: {
            start: messages["filter.discount_amount_start"],
            end: messages["filter.discount_amount_end"],
          },
          initState: {
            discount_amount_start: filter["discount_amount_start"],
            discount_amount_end: filter["discount_amount_end"],
          },
          passHandler: setExternalFilter,
          prefix: "discount_amount",
        }}
      />

      <Select
        {...{
          label: formatMessage({
            id: "filter.discountType",
            defaultMessage: "Lọc Theo Loại Giảm Giá",
          }),
          options: discountTypeList,
          displayName: 1,
          isOptionEqualToValue: (option, value) => {
            if (value == "") {
              return true;
            }

            return option[0] == value;
          },

          passHandler: ({ value }) => {
            setExternalFilter({
              discount_type: value?.[0],
            });
          },

          value: data["discount_type"],
        }}
      />

      <Select
        {...{
          label: formatMessage({
            id: "filter.voucherType",
            defaultMessage: "Lọc Theo Loại Voucher",
          }),
          options: voucherTypeList,
          displayName: 1,
          isOptionEqualToValue: (option, value) => {
            if (value == "") {
              return true;
            }

            return option[0] == value;
          },

          passHandler: ({ value }) => {
            setExternalFilter({
              type: value?.[0],
            });
          },

          value: data["type"],
        }}
      />

      <Button color="error" variant="contained" onClick={reset}>
        Bỏ filter
      </Button>
    </Stack>
  );
};

export default Filter;
