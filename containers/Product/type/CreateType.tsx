import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import { get, set } from "lodash";
import { Grid, Stack } from "@mui/material";

import ProductTypeForm from "./components/ProductTypeForm";
import { BackButton, LoadingButton, Card } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";
import { PRODUCTS, TYPE } from "routes";

import {
  ADMIN_PRODUCTS_TYPES_POST_YUP_RESOLVER,
  ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_PRODUCTS_TYPES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";
import { ADMIN_PRODUCTS_TYPES_END_POINT } from "__generated__/END_POINT";

const CreateType = () => {
  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { control, handleSubmit } = useForm({
    defaultValues: ADMIN_PRODUCTS_TYPES_POST_DEFAULT_VALUE,
    resolver: ADMIN_PRODUCTS_TYPES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_PRODUCTS_TYPES_POST_YUP_SCHEMA_TYPE }) => {
      try {
        setLoading(true);

        const taxRate = get(data, "tax_rate");

        if (taxRate) {
          const transformedTaxRate = parseFloat(taxRate) / 100;

          set(data, "tax_rate", transformedTaxRate);
        }

        await axios.post(ADMIN_PRODUCTS_TYPES_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "loại sản phẩm",
          })
        );

        const pathname = `/${PRODUCTS}/${TYPE}`;

        router.replace(pathname);
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  return (
    <Grid container>
      <Grid item xs={9}>
        <Card
          title={messages["createProductClass"]}
          body={<ProductTypeForm control={control} />}
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${PRODUCTS}/${TYPE}`} />
          <LoadingButton
            loading={loading}
            onClick={handleSubmit((data) => {
              onSubmit({ data });
            })}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateType;
