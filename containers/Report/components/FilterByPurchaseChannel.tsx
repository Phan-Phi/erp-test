import { Card, CardContent, CardHeader, MenuItem, Typography } from "@mui/material";
import { ORDER_PURCHASE_CHANNEL } from "apis";
import { LazyAutocomplete } from "components";
import { ORDER_PURCHASE_CHANNEL_ITEM } from "interfaces";
import React from "react";
import { useIntl } from "react-intl";

import isEmpty from "lodash/isEmpty";

interface FilterByPurchaseChannelProps {
  onChange: (props: any) => void;
}

const FilterByPurchaseChannel = ({ onChange }: FilterByPurchaseChannelProps) => {
  const { messages } = useIntl();

  return (
    <Card>
      <CardHeader title={messages["filterChannel"]} />
      <CardContent
        sx={{
          paddingTop: "0 !important",
        }}
      >
        <LazyAutocomplete<{}, ORDER_PURCHASE_CHANNEL_ITEM>
          {...{
            url: ORDER_PURCHASE_CHANNEL,
            placeholder: messages["filterChannel"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.name} />;
              },

              getOptionLabel: (option) => {
                return option.name;
              },
              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },

              onChange: (e, value) => {
                onChange({
                  purchase_channel: value?.id ? `${value?.id}` : undefined,
                });
              },
            },
            params: {
              nested_depth: 1,
            },
            initValue: null,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default FilterByPurchaseChannel;
