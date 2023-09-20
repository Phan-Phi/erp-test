import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMemo, useCallback, useState, useContext, useEffect, Fragment } from "react";

import get from "lodash/get";

import {
  Stack,
  Button,
  ListItem,
  Typography,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import { PRODUCT_TYPE_PRODUCT_ATTRIBUTE } from "apis";
import { usePermission, useConfirmation, useNotification, useChoice } from "hooks";
import { PRODUCTS, ATTRIBUTE, EDIT } from "routes";
import DynamicMessage from "messages";
import { ConnectionContext } from "./Connection";
import { transformUrl, getDisplayValueFromChoiceItem } from "libs";
import axios from "axios.config";

import { Card, NoData, LoadingDynamic as Loading, DeleteButton } from "components";

import { PRODUCT_TYPE_PRODUCT_ATTRIBUTE_ITEM } from "interfaces";

const ConnectProductAttribute = ({ toggle }) => {
  const { hasPermission: writePermission } = usePermission("write_product_class");

  const router = useRouter();
  const choice = useChoice();

  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const { onConfirm, onClose } = useConfirmation();

  const context = useContext(ConnectionContext);
  const { formatMessage, messages } = useIntl();

  const { data: productAttributeData, mutate: productAttributeMutate } = useSWR<
    PRODUCT_TYPE_PRODUCT_ATTRIBUTE_ITEM[]
  >(() => {
    let id = router.query.id;
    if (id) {
      const params = {
        get_all: true,
        product_class: id,
        use_cache: false,
      };

      return transformUrl(PRODUCT_TYPE_PRODUCT_ATTRIBUTE, params);
    }
    return null;
  });

  useEffect(() => {
    context.set({
      mutateProductAttribute: productAttributeMutate,
    });
  }, []);

  const removeProductAttributeConnectionHandler = useCallback(
    ({ data }: { data: PRODUCT_TYPE_PRODUCT_ATTRIBUTE_ITEM }) => {
      const handler = async () => {
        const { id } = data;

        try {
          setLoading((prev) => {
            return {
              ...prev,
              [id]: true,
            };
          });

          await axios.delete(`${PRODUCT_TYPE_PRODUCT_ATTRIBUTE}${id}/`);

          await productAttributeMutate();

          context.state.mutateProductAttributeForSelect();

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "thuộc tính sản phẩm",
            })
          );

          onClose();
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          setLoading((prev) => {
            return {
              ...prev,
              [id]: false,
            };
          });
        }
      };

      onConfirm(handler, {
        message: "Bạn có chắc muốn xóa?",
      });
    },
    [context]
  );

  const children = useMemo(() => {
    if (productAttributeData == undefined) {
      return <Loading />;
    }

    if (productAttributeData?.length === 0) {
      return <NoData />;
    }

    const { product_attribute_types } = choice;

    return (
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start">
        {productAttributeData.map((el) => {
          const isUsed = get(el, "is_used");

          const displayInputType = getDisplayValueFromChoiceItem(
            product_attribute_types,
            el.attribute.input_type
          );

          return (
            <ListItem
              dense
              key={el.id}
              divider
              secondaryAction={
                writePermission &&
                !isUsed && (
                  <DeleteButton
                    disabled={!!loading[el.id]}
                    onClick={() => {
                      removeProductAttributeConnectionHandler({ data: el });
                    }}
                  />
                )
              }
            >
              <ListItemButton
                onClick={() => {
                  router.push(`/${PRODUCTS}/${ATTRIBUTE}/${EDIT}/${el.attribute.id}`);
                }}
              >
                <ListItemText
                  primary={el.attribute.name}
                  secondary={
                    <Typography
                      sx={{
                        fontStyle: "italic",
                        fontSize: 12,
                      }}
                    >
                      {displayInputType}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </Stack>
    );
  }, [productAttributeData, writePermission]);

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography variant="h6">{messages["productAttribute"]}</Typography>

            {writePermission && (
              <Button
                variant="contained"
                onClick={() => {
                  toggle(true, false);
                }}
              >
                {messages["createProductAttribute"]}
              </Button>
            )}
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return <Fragment>{children}</Fragment>;
      }}
    />
  );
};

export default ConnectProductAttribute;
