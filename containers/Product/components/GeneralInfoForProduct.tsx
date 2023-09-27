import { useIntl } from "react-intl";
import { Grid } from "@mui/material";
import { Control, useFieldArray, Controller } from "react-hook-form";

import { Card } from "components";
import ImageUploadBox from "./ImageUploadBox";
import ImageThumbList from "./ImageThumbList";
import { FormControl, FormControlForRichText } from "compositions";

import { usePermission } from "hooks";
import { ProductImageSchemaProps } from "yups";
import { ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE } from "__generated__/PATCH_YUP";

type GeneralInfoProps = {
  control: any;
  productImageControl: Control<ProductImageSchemaProps>;
};

const GeneralInfo = (props: GeneralInfoProps) => {
  const { hasPermission: writePermission } = usePermission("write_product");

  const { productImageControl } = props;
  const control = props.control as Control<ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE>;

  const { fields, append, swap, remove } = useFieldArray({
    control: productImageControl,
    name: "images",
    keyName: "formId",
  });

  const { messages } = useIntl();

  return (
    <Grid item xs={12}>
      <Card
        title={messages["productInfo"]}
        cardBodyComponent={() => {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="name"
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["productName"] as string}
                        placeholder={messages["productName"] as string}
                        FormControlProps={{ required: true }}
                        InputProps={{
                          readOnly: !writePermission,
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="description"
                  render={(props) => {
                    return (
                      <FormControlForRichText
                        controlState={props}
                        label={messages["productDescription"] as string}
                      />
                    );
                  }}
                />
                {/* <Controller
                  control={control}
                  name="description"
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["productDescription"] as string}
                        placeholder={messages["productDescription"] as string}
                        InputProps={{
                          multiline: true,
                          rows: 5,
                          readOnly: !writePermission,
                          sx: {
                            padding: 1,
                          },
                        }}
                      />
                    );
                  }}
                /> */}
              </Grid>

              {writePermission && (
                <Grid item xs={12}>
                  <ImageUploadBox
                    onDrop={(acceptedFiles) => {
                      acceptedFiles.forEach((el, idx) => {
                        const { name } = el;
                        append({
                          file: el,
                          alt: name,
                          sort_order: fields.length + idx,
                        });
                      });
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <ImageThumbList
                  {...{
                    data: fields,
                    swap,
                    remove,
                  }}
                />
              </Grid>
            </Grid>
          );
        }}
      />
    </Grid>
  );
};

export default GeneralInfo;
