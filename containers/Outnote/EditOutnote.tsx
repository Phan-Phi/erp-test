import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useState, useEffect } from "react";
import { useForm, FieldNamesMarkedBoolean } from "react-hook-form";

import useSWR from "swr";
import { get, set, omit, pick, unset, isEmpty } from "lodash";
import { Grid, Stack, Checkbox, FormControlLabel } from "@mui/material";

import ViewOutnote from "./OrderItem/ViewOutnote";
import OutnoteForm from "./components/OutnoteForm";
import { Card, LoadingButton, BackButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import { OUTNOTES } from "routes";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { usePermission, useConfirmation, useNotification } from "hooks";

import {
  ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import { ADMIN_WAREHOUSES_OUT_NOTES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

interface DEFAULT_VALUES_TYPE_EXTENDS
  extends ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_YUP_SCHEMA_TYPE {
  warehouse: any;
}

const LineList = dynamic(() => import("./OrderItem/LineList"), {
  loading: () => {
    return <Loading />;
  },
});

const EditWarehouse = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<DEFAULT_VALUES_TYPE_EXTENDS>();

  let { data: outnoteData, mutate: outnoteMutate } =
    useSWR<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1>(() => {
      const id = router.query.id;

      if (id == undefined) return;

      const params = {
        use_cache: false,
      };

      return transformUrl(`${ADMIN_WAREHOUSES_OUT_NOTES_END_POINT}${id}`, params);
    });

  const setDefaultValuesHandler = useCallback((input: any) => {
    const data = pick(input, ["id", "sid", "status", "notes", "warehouse"]) as any;

    const amountObj = get(input, "amount");
    const shippingChargeObj = get(input, "shipping_charge");

    set(data, "amount", parseFloat(get(amountObj, "excl_tax")).toString());
    set(data, "amount_incl_tax", parseFloat(get(amountObj, "incl_tax")).toString());
    set(
      data,
      "shipping_incl_tax",
      parseFloat(get(shippingChargeObj, "incl_tax")).toString()
    );
    set(
      data,
      "shipping_excl_tax",
      parseFloat(get(shippingChargeObj, "excl_tax")).toString()
    );

    setDefaultValues(data);
  }, []);

  useEffect(() => {
    if (outnoteData == undefined) return;

    setDefaultValuesHandler(outnoteData);
  }, [outnoteData]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);

    const data = await outnoteMutate();

    if (data) {
      setDefaultValuesHandler(data);
    }
  }, []);

  if (defaultValues == undefined) return <Loading />;

  if (get(defaultValues, "status") === "Confirmed") {
    return <ViewOutnote />;
  }

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

interface RootComponentProps {
  defaultValues: DEFAULT_VALUES_TYPE_EXTENDS;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { hasPermission: writePermission } = usePermission("write_stock_out_note");
  const { hasPermission: approvePermission } = usePermission("approve_stock_out_note");

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_WAREHOUSES_OUT_NOTES_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const router = useRouter();
  const isMounted = useMountedState();
  const { onConfirm, onClose } = useConfirmation();

  const { formatMessage, messages } = useIntl();
  const [approve, setApprove] = useState(false);

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: DEFAULT_VALUES_TYPE_EXTENDS;
      dirtyFields: FieldNamesMarkedBoolean<typeof defaultValues>;
    }) => {
      try {
        if (!isEmpty(dirtyFields)) {
          setLoading(true);
          const outnoteId = get(data, "id");

          unset(data, "id");

          const body = omit(data, ["warehouse", "sid", "status"]);

          await axios.patch(`${ADMIN_WAREHOUSES_OUT_NOTES_END_POINT}${outnoteId}/`, body);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "phiếu xuất kho",
            })
          );
        }

        onSuccessHandler();
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

  const approveHandler = useCallback((id) => {
    return () => {
      const handler = async () => {
        try {
          setLoading(true);
          await axios.patch(`${ADMIN_WAREHOUSES_OUT_NOTES_END_POINT}${id}/`, {
            status: "Confirmed",
          });

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.approveSuccessfully, {
              content: "phiếu xuất kho",
            })
          );

          onClose();

          onSuccessHandler();
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          if (isMounted()) {
            setLoading(false);
          }
        }
      };

      onConfirm(handler, {
        message: messages["confirmOutnote"] as string,
        variant: "info",
      });
    };
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card
          title={messages["updateOutnote"]}
          body={<OutnoteForm control={control} defaultValues={defaultValues} />}
        />
      </Grid>

      <Grid item xs={12}>
        <LineList warehouse={defaultValues.warehouse} />
      </Grid>

      <Grid item xs={12}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${OUTNOTES}`} />

          {writePermission && (
            <Stack
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              columnGap={3}
            >
              {approvePermission && (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={approve}
                      onChange={(e) => {
                        setApprove((prev) => {
                          return !prev;
                        });
                      }}
                    />
                  }
                  label={messages["confirmOutnote"]}
                />
              )}

              {approve ? (
                <LoadingButton
                  {...{
                    loading: loading,
                    onClick: approveHandler(router.query.id),
                  }}
                >
                  {loading ? messages["approvingStatus"] : messages["approveStatus"]}
                </LoadingButton>
              ) : (
                <LoadingButton
                  {...{
                    loading,
                    onClick: handleSubmit((data) => {
                      onSubmit({ data, dirtyFields });
                    }),
                  }}
                >
                  {loading ? messages["updatingStatus"] : messages["updateStatus"]}
                </LoadingButton>
              )}
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditWarehouse;
