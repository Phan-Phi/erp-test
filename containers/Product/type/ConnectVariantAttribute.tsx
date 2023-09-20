import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMemo, useCallback, useState, useContext, useEffect, Fragment } from "react";

import get from "lodash/get";

import {
  Stack,
  Button,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { usePermission, useConfirmation, useNotification, useChoice } from "hooks";
import { Card, NoData, LoadingDynamic as Loading } from "components";
import { transformUrl, getDisplayValueFromChoiceItem } from "libs";
import { PRODUCT_TYPE_VARIANT_ATTRIBUTE } from "apis";
import { PRODUCTS, ATTRIBUTE, EDIT } from "routes";
import DynamicMessage from "messages";
import axios from "axios.config";
import { ConnectionContext } from "./Connection";

import { PRODUCT_TYPE_VARIANT_ATTRIBUTE_ITEM } from "interfaces";

const ConnectVariantAttribute = ({ toggle }) => {
  const { hasPermission: writePermission } = usePermission("write_product_class");

  const router = useRouter();
  const choice = useChoice();
  const [loading, setLoading] = useState({});
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const context = useContext(ConnectionContext);

  const { data: variantAttributeData, mutate: variantAttributeMutate } = useSWR<
    PRODUCT_TYPE_VARIANT_ATTRIBUTE_ITEM[]
  >(() => {
    let id = router.query.id;
    if (id) {
      const params = {
        get_all: true,
        product_class: id,
        use_cache: false,
      };

      return transformUrl(PRODUCT_TYPE_VARIANT_ATTRIBUTE, params);
    }
    return null;
  });

  useEffect(() => {
    context.set({
      mutateVariantAttribute: variantAttributeMutate,
    });
  }, []);

  const removeProductAttributeConnectionHandler = useCallback(
    ({ data }) => {
      const handler = async () => {
        const { id } = data;

        try {
          setLoading((prev) => {
            return {
              ...prev,
              [id]: true,
            };
          });

          await axios.delete(`${PRODUCT_TYPE_VARIANT_ATTRIBUTE}${id}/`);

          await variantAttributeMutate();

          context.state.mutateProductAttributeForSelect();

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "thuộc tính biến thể",
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
    if (variantAttributeData == undefined) {
      return <Loading />;
    }

    if (variantAttributeData?.length === 0) {
      return <NoData />;
    }

    const { product_attribute_types } = choice;

    return (
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
      >
        {variantAttributeData.map((el) => {
          const isUsed = get(el, "is_used");

          const displayValueInputType = getDisplayValueFromChoiceItem(
            product_attribute_types,
            el.attribute.input_type
          );

          return (
            <ListItem
              key={el.id}
              divider
              dense
              secondaryAction={
                writePermission &&
                !isUsed && (
                  <IconButton
                    disabled={!!loading[el.id]}
                    onClick={() => {
                      removeProductAttributeConnectionHandler({ data: el });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
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
                      {displayValueInputType}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </Stack>
    );
  }, [variantAttributeData]);

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography variant="h6">{messages["variantAttribute"]}</Typography>

            {writePermission && (
              <Button
                variant="contained"
                onClick={() => {
                  toggle(true, true);
                }}
              >
                {messages["createVariantAttribute"]}
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

export default ConnectVariantAttribute;
