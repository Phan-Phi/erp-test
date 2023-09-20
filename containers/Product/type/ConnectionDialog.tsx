import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useCallback, useEffect, useContext, Fragment } from "react";

import { MenuItem } from "@mui/material";

import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";

import { ConnectionContext } from "./Connection";
import DynamicMessage from "messages";

import {
  LoadingButton,
  BackButton,
  LoadingDynamic as Loading,
  Dialog,
  Autocomplete,
} from "components";

import {
  PRODUCT_TYPE_PRODUCT_ATTRIBUTE,
  PRODUCT_TYPE_VARIANT_ATTRIBUTE,
  PRODUCT_ATTRIBUTE,
} from "apis";
import { transformUrl, getChoiceValue } from "libs";

import {
  connectProductAttributeSchema,
  defaultConnectProductAttributeFormState,
  ConnectProductAttributeSchemaProps,
} from "yups";

import { useChoice, useNotification } from "hooks";

import axios from "axios.config";

import { PRODUCT_ATTRIBUTE_ITEM } from "interfaces";

type ConnectionDialogProps = {
  open: boolean;
  toggle: (isToggle: boolean, isVariant?: boolean) => void;
  isVariant: boolean;
};

const ConnectionDialog = ({ open, toggle, isVariant }: ConnectionDialogProps) => {
  const choice = useChoice();

  const [defaultValues, setDefaultValues] =
    useState<ConnectProductAttributeSchemaProps>();
  const router = useRouter();
  const context = useContext(ConnectionContext);

  const { data: productAttribute, mutate: productAttributeMutate } = useSWR<
    PRODUCT_ATTRIBUTE_ITEM[]
  >(() => {
    const params = {
      get_all: true,
      use_cache: false,
      not_in_product_class: router.query.id,
    };

    if (isVariant && choice) {
      const { product_attribute_types } = choice;

      set(params, "is_variant_only", true);
      set(params, "input_type", getChoiceValue(product_attribute_types)?.[0]);

      return transformUrl(PRODUCT_ATTRIBUTE, params);
    } else {
      set(params, "is_variant_only", false);

      return transformUrl(PRODUCT_ATTRIBUTE, params);
    }
  });

  useEffect(() => {
    context.set({
      mutateProductAttributeForSelect: productAttributeMutate,
    });
  }, [productAttributeMutate]);

  useEffect(() => {
    if (router.query.id && typeof router.query.id === "string") {
      setDefaultValues({
        ...defaultConnectProductAttributeFormState(),
        product_class: router.query.id,
      });
    }
  }, [router.query.id]);

  const onSuccessHandler = useCallback(async () => {
    context.state.mutateProductAttribute();
    context.state.mutateVariantAttribute();
    productAttributeMutate();

    toggle(false);
  }, [productAttributeMutate, context]);

  if (productAttribute == undefined || defaultValues == undefined) {
    return <Loading />;
  }

  return (
    <RootComponent
      {...{
        defaultValues,
        data: productAttribute,
        open,
        toggle,
        onSuccessHandler,
        isVariant,
      }}
    />
  );
};

interface RootComponentProps extends ConnectionDialogProps {
  data: PRODUCT_ATTRIBUTE_ITEM[];
  onSuccessHandler: () => Promise<void>;
  defaultValues: ConnectProductAttributeSchemaProps;
}

const RootComponent = ({
  defaultValues,
  data,
  open,
  toggle,
  onSuccessHandler,
  isVariant,
}: RootComponentProps) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: connectProductAttributeSchema(),
  });

  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open]);

  const onSubmit = useCallback(
    async ({
      data,
      isVariant,
    }: {
      data: ConnectProductAttributeSchemaProps;
      isVariant: boolean;
    }) => {
      setLoading(true);

      let attributeId = get(data, "attribute.id");

      set(data, "attribute", attributeId);

      try {
        let URL = isVariant
          ? PRODUCT_TYPE_VARIANT_ATTRIBUTE
          : PRODUCT_TYPE_PRODUCT_ATTRIBUTE;

        await axios.post(URL, data);

        reset(defaultValues, {
          keepDirty: false,
        });

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "thuộc tính sản phẩm",
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
    [onSuccessHandler]
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

        DialogTitleProps: {
          children: messages["selectProductAttribute"],
        },
        dialogContentTextComponent: () => {
          return (
            <Autocomplete<ConnectProductAttributeSchemaProps, PRODUCT_ATTRIBUTE_ITEM>
              {...{
                name: "attribute",
                control,

                label: messages["productAttribute"] as string,
                placeholder: messages["productAttribute"] as string,

                AutocompleteProps: {
                  options: data,
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
                },
              }}
            />
          );
        },
        DialogActionsProps: {
          children: (
            <Fragment>
              <BackButton
                onClick={() => {
                  if (loading) {
                    return;
                  }

                  toggle(false);
                }}
              />

              <LoadingButton
                onClick={handleSubmit((data) => {
                  onSubmit({ data, isVariant });
                })}
                loading={loading}
                disabled={loading}
              >
                {loading ? messages["connectingStatus"] : messages["connectStatus"]}
              </LoadingButton>
            </Fragment>
          ),
        },
      }}
    ></Dialog>
  );
};

export default ConnectionDialog;
