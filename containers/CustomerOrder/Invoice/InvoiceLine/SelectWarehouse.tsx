import useSWR from "swr";
import { Fragment } from "react";
import { useIntl } from "react-intl";
import { Control, Controller } from "react-hook-form";

import { MenuItem } from "@mui/material";

import { transformUrl } from "libs";
import { LazyAutocomplete } from "compositions";
import { LoadingDynamic as Loading } from "components";

import { ADMIN_WAREHOUSES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { isEmpty } from "lodash";

interface SelectWarehouseProps {
  control: Control<any>;
}

const SelectWarehouse = ({ control }: SelectWarehouseProps) => {
  const { messages } = useIntl();

  const { data: warehouseData } = useSWR(() => {
    const params = {
      get_all: true,
      nested_depth: 1,
    };

    return transformUrl(ADMIN_WAREHOUSES_END_POINT, params);
  });

  if (warehouseData == undefined) {
    return <Loading />;
  }

  return (
    <Fragment>
      <Controller
        control={control}
        name="warehouse"
        render={(props) => {
          const { field, fieldState } = props;
          const { value, onChange } = field;
          const { error } = fieldState;

          return (
            <LazyAutocomplete<ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1>
              error={error}
              url={ADMIN_WAREHOUSES_END_POINT}
              label={messages["listingWarehouse"] as string}
              placeholder={messages["listingWarehouse"] as string}
              AutocompleteProps={{
                value: value as ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1,
                onChange: (_, value) => {
                  onChange(value);
                },
                renderOption(props, option) {
                  return (
                    <MenuItem
                      {...props}
                      key={option.id}
                      value={option.id}
                      children={option.name}
                    />
                  );
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
              }}
            />
          );
        }}
      />
    </Fragment>
  );
};

export default SelectWarehouse;
