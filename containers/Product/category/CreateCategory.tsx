import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import { get, set, isEmpty } from "lodash";
import { Grid, Stack } from "@mui/material";

import CategoryForm from "./components/CategoryForm";
import { Card, BackButton, LoadingButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";
import { PRODUCTS, CATEGORY } from "routes";

import {
  ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER,
  ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";
import { ADMIN_PRODUCTS_CATEGORIES_END_POINT } from "__generated__/END_POINT";

const CreateCategory = () => {
  const router = useRouter();
  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { control, handleSubmit } = useForm({
    defaultValues: { ...ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE },
    resolver: ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE }) => {
      setLoading(true);

      if (!isEmpty(data.parent)) {
        set(data, "parent", get(data, "parent.id"));
      }

      try {
        await axios.post(ADMIN_PRODUCTS_CATEGORIES_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "danh mục",
          })
        );

        router.replace(`/${PRODUCTS}/${CATEGORY}`);
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
          title={messages["createProductCategory"]}
          body={<CategoryForm control={control} />}
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${PRODUCTS}/${CATEGORY}`} />

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

export default CreateCategory;
