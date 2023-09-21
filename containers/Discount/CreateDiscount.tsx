import { useCallback } from "react";
import { formatISO } from "date-fns";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Grid, Stack } from "@mui/material";
import { useMountedState } from "react-use";

import get from "lodash/get";
import set from "lodash/set";

import axios from "axios.config";
import DynamicMessage from "messages";
import DiscountForm from "./components/DiscountForm";

import { DISCOUNT } from "apis";
import { useIntl } from "react-intl";
import { DISCOUNTS, EDIT } from "routes";
import { useChoice, useNotification } from "hooks";
import { Card, BackButton, LoadingButton } from "components";
import { ADMIN_DISCOUNTS_END_POINT } from "__generated__/END_POINT";
import { discountSchema, defaultDiscountFormState, DiscountSchemaProps } from "yups";

const CreateDiscount = () => {
  const router = useRouter();
  const choice = useChoice();

  const isMounted = useMountedState();

  const { messages, formatMessage } = useIntl();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: defaultDiscountFormState(choice),
    resolver: discountSchema(choice),
  });

  const onSubmit = useCallback(async ({ data }: { data: DiscountSchemaProps }) => {
    try {
      let dateStart = get(data, "date_start");
      let dateEnd = get(data, "date_end");

      if (dateStart) {
        set(data, "date_start", formatISO(dateStart));
      }

      if (dateEnd) {
        set(data, "date_end", formatISO(dateEnd));
      }

      setLoading(true);

      // return;
      const { data: resData } = await axios.post(ADMIN_DISCOUNTS_END_POINT, data);

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "giảm giá",
        })
      );

      const discountId = get(resData, "id");

      if (discountId) {
        let pathname = `/${DISCOUNTS}/${EDIT}/${discountId}`;

        router.push(pathname, pathname, {
          shallow: true,
        });
      }
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  return (
    <Grid container>
      <Grid item xs={10}>
        <Card
          title={messages["createDiscount"]}
          body={<DiscountForm {...{ control, watch }} />}
        />
      </Grid>
      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${DISCOUNTS}`} disabled={loading} />

          <LoadingButton
            {...{
              loading,
              disabled: loading,
              onClick: handleSubmit((data) => {
                onSubmit({ data });
              }),
            }}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateDiscount;
