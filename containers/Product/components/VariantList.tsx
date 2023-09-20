import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

import get from "lodash/get";
import { Stack, List, ListItemText, ListItemButton } from "@mui/material";

import { transformUrl } from "libs";
import { PRODUCTS, VARIANT } from "routes";
import { Card, LoadingDynamic as Loading } from "components";

import { ADMIN_PRODUCTS_VARIANTS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const VariantList = ({ selectVariantHandler }) => {
  const router = useRouter();

  const { data: productVariantData } = useSWR<
    Required<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>[]
  >(() => {
    const id = router.query.id;

    if (id) {
      const params = {
        get_all: true,
        product: id,
        use_cache: false,
      };

      return transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, params);
    }
  });

  const { messages } = useIntl();

  if (productVariantData == undefined) {
    return <Loading />;
  }

  return (
    <Card
      title={messages["otherVariant"]}
      cardBodyComponent={() => {
        return (
          <Stack direction="column">
            <List>
              {productVariantData.map((el) => {
                const currentVariantId: string = get(router, "query.variantId");

                const stringId = el.id.toString();

                return (
                  <ListItemButton
                    key={el.id}
                    onClick={() => {
                      selectVariantHandler();
                      router.push(`/${PRODUCTS}/${router.query.id}/${VARIANT}/${el.id}`);
                    }}
                    sx={{
                      borderLeft: (theme) => {
                        if (stringId === currentVariantId) {
                          return `2px solid ${theme.palette.primary2.main}`;
                        } else {
                          return null;
                        }
                      },
                      backgroundColor: (theme) => {
                        if (stringId === currentVariantId) {
                          return theme.palette.action.selected;
                        } else {
                          return null;
                        }
                      },
                    }}
                  >
                    <ListItemText primary={el?.name} />
                  </ListItemButton>
                );
              })}
            </List>
          </Stack>
        );
      }}
    />
  );
};

export default VariantList;
