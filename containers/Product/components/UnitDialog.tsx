import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useCallback, useEffect, Fragment } from "react";

import { Grid } from "@mui/material";

import { FormControlForNumber, FormControl } from "compositions";
import { Dialog, BackButton, LoadingButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification, useSetting } from "hooks";

import {
  ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_RESOLVER,
  ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCTS_VARIANTS_UNITS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

type UnitDialogProps = {
  open: boolean;
  toggle: (nextValue?: boolean) => void;
  onSuccessHandler: () => Promise<void>;
};

const UnitDialog = ({ open, toggle, onSuccessHandler: callback }: UnitDialogProps) => {
  const [defaultValues, setDefaultValues] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const variantId = router.query.variantId;
    if (typeof variantId === "string") {
      setDefaultValues(() => {
        return {
          ...ADMIN_PRODUCTS_VARIANTS_UNITS_POST_DEFAULT_VALUE,
          variant: variantId,
        };
      });
    }
  }, [router, open]);

  const onSuccessHandler = useCallback(async () => {
    toggle(false);
    setDefaultValues(undefined);
    await callback();
  }, [callback]);

  if (!open && defaultValues == undefined) return null;

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, open, toggle, onSuccessHandler }} />;
};

interface RootComponentProps extends UnitDialogProps {
  defaultValues: ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA_TYPE;
}

const RootComponent = ({
  defaultValues,
  open,
  toggle,
  onSuccessHandler,
}: RootComponentProps) => {
  const setting = useSetting();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { control, handleSubmit } = useForm({
    defaultValues,
    resolver: ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_PRODUCTS_VARIANTS_UNITS_POST_YUP_SCHEMA_TYPE }) => {
      setLoading(true);

      try {
        await axios.post(ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "đơn vị tính",
          })
        );

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

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          if (loading) {
            return;
          }

          toggle(false);
        },

        DialogProps: {
          PaperProps: {
            sx: {
              minWidth: "50vw",
            },
          },
        },

        DialogTitleProps: {
          children: messages["createExtendUnit"],
        },
        dialogContentTextComponent: () => {
          return (
            <Grid container>
              <Grid item xs={6}>
                <Controller
                  name="unit"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["unit"] as string}
                        placeholder={messages["unit"] as string}
                        FormControlProps={{
                          required: true,
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="editable_sku"
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["editableSku"] as string}
                        placeholder={messages["editableSku"] as string}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="multiply"
                  render={(props) => {
                    return (
                      <FormControlForNumber
                        controlState={props}
                        label={messages["multiply"] as string}
                        InputProps={{
                          inputProps: {
                            placeholder: messages["multiply"] as string,
                          },
                        }}
                        NumberFormatProps={{
                          allowNegative: false,
                          suffix: "",
                        }}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="weight"
                  render={(props) => {
                    return (
                      <FormControlForNumber
                        controlState={props}
                        label={messages["weight"] as string}
                        InputProps={{
                          inputProps: {
                            placeholder: messages["weight"] as string,
                          },
                        }}
                        NumberFormatProps={{
                          allowNegative: false,
                          suffix: ` ${setting?.weight_unit}`,
                        }}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="price_incl_tax"
                  render={(props) => {
                    return (
                      <FormControlForNumber
                        controlState={props}
                        label={messages["priceInclTax"] as string}
                        InputProps={{
                          inputProps: {
                            placeholder: messages["priceInclTax"] as string,
                          },
                        }}
                        NumberFormatProps={{
                          allowNegative: false,
                          suffix: " ₫",
                        }}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="bar_code"
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["barcode"] as string}
                        placeholder={messages["barcode"] as string}
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          );
        },
        DialogActionsProps: {
          children: (
            <Fragment>
              <BackButton
                onClick={() => {
                  toggle(false);
                }}
                disabled={loading}
              />
              <LoadingButton
                onClick={handleSubmit((data) => {
                  onSubmit({ data });
                })}
                loading={loading}
                disabled={loading}
              >
                {loading ? messages["creatingStatus"] : messages["createStatus"]}
              </LoadingButton>
            </Fragment>
          ),
        },
      }}
    />
  );
};

export default UnitDialog;
