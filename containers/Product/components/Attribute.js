import useSWR from "swr";
import { Fragment } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useFieldArray } from "react-hook-form";

import get from "lodash/get";

import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { Card, NoData, LoadingDynamic as Loading } from "components";
import { PRODUCT_ATTRIBUTE_OPTION, PRODUCT_ATTRIBUTE } from "apis";
import usePermission from "hooks/usePermission";

import { transformUrl } from "libs";

const Attribute = ({ control }) => {
  const { fields, update } = useFieldArray({
    control,
    name: "attributes",
    keyName: "formId",
  });

  const { messages } = useIntl();

  const router = useRouter();

  if (fields?.length === 0) {
    return <NoData children={messages["noAttribute"]} />;
  }

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">
              {router.query.variantId
                ? messages["variantAttribute"]
                : messages["productAttribute"]}
            </Typography>
          </Stack>
        );
      }}
      body={
        <Fragment>
          {fields.map((el, idx) => {
            return (
              <AttributeItem
                key={el.formId}
                data={el}
                onChange={(data) => {
                  update(idx, data);
                }}
              />
            );
          })}
        </Fragment>
      }
    />
  );
};

const AttributeItem = ({ data, onChange }) => {
  const { hasPermission: writePermission } = usePermission("write_product");

  const {
    assignment: { attribute: attributeId },
    values,
  } = data;

  const { data: productAttributeData } = useSWR(() => {
    return transformUrl(`${PRODUCT_ATTRIBUTE}${attributeId}`, {
      use_cache: false,
    });
  });

  const { data: productAttributeOptionData } = useSWR(() => {
    return transformUrl(PRODUCT_ATTRIBUTE_OPTION, {
      get_all: true,
      use_cache: false,
      attribute: attributeId,
    });
  });

  if (productAttributeData == undefined || productAttributeOptionData == undefined) {
    return <Loading />;
  }

  const attributeName = get(productAttributeData, "name");
  // const inputType = get(productAttributeData, "input_type");

  const inputType = "Option";

  const idList = values.map((el) => {
    if (typeof el === "object") {
      return el.id;
    } else {
      return el;
    }
  });

  return (
    <List>
      <ListItem>
        <ListItemText>{attributeName}</ListItemText>
        <FormControl
          sx={{ minWidth: 150 }}
          variant="standard"
          disabled={!writePermission}
        >
          <InputLabel>{attributeName}</InputLabel>
          <Select
            sx={{
              paddingLeft: 0,
            }}
            value={inputType === "Option" ? idList || "" : idList}
            // multiple={inputType === "Multi_option"}
            onChange={(e) => {
              const value = e.target.value;

              if (inputType === "Option") {
                onChange({ ...data, values: [value] });
              } else if (inputType === "Multi_option") {
                onChange({ ...data, values: value });
              }
            }}
            label={`${attributeName}`}
          >
            {inputType === "Option" && <MenuItem value={""}>None</MenuItem>}
            {productAttributeOptionData.map((el) => {
              return (
                <MenuItem key={el.id} value={el.id}>
                  {el.value}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </ListItem>
    </List>
  );
};

export default Attribute;
