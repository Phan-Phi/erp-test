import useSWR from "swr";
import dynamic from "next/dynamic";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useCallback, useState, createContext } from "react";

import get from "lodash/get";

import { Grid } from "@mui/material";

import { PRODUCTS, TYPE } from "routes";

import { BackButton, LoadingDynamic as Loading } from "components";

import { useMutation } from "hooks";

const ConnectionDialog = dynamic(() => import("./ConnectionDialog"), {
  loading: () => {
    return <Loading />;
  },
});

import ConnectProductAttribute from "./ConnectProductAttribute";
import ConnectVariantAttribute from "./ConnectVariantAttribute";

import { PRODUCT_TYPE } from "apis";
import { transformUrl } from "libs";

import { PRODUCT_TYPE_ITEM } from "interfaces";

export const ConnectionContext = createContext({
  state: {
    mutateProductAttribute: () => {},
    mutateVariantAttribute: () => {},
    mutateProductAttributeForSelect: () => {},
  },
  set: (obj: object) => {},
});

const Connection = () => {
  const router = useRouter();
  const [open, toggle] = useToggle(false);
  const [isVariant, setIsVariant] = useState(false);

  const { data: productTypeData } = useSWR<PRODUCT_TYPE_ITEM>(() => {
    const id = router.query.id;

    if (id) {
      return transformUrl(`${PRODUCT_TYPE}${id}`);
    }
  });

  const contextValue = useMutation({
    mutateProductAttribute: () => {},
    mutateVariantAttribute: () => {},
    mutateProductAttributeForSelect: () => {},
  });

  const decorateToggle = useCallback((isToggle, isVariant) => {
    if (isVariant == undefined) {
      toggle(isToggle);

      return;
    }

    toggle(isToggle);
    setIsVariant(isVariant);
  }, []);

  if (productTypeData == undefined) {
    return <Loading />;
  }

  return (
    <ConnectionContext.Provider value={contextValue}>
      <Grid container>
        <Grid item xs={9}>
          <ConnectProductAttribute
            {...{
              open,
              toggle: decorateToggle,
            }}
          />
        </Grid>

        {get(productTypeData, "has_variants") && (
          <Grid item xs={9}>
            <ConnectVariantAttribute
              {...{
                toggle: decorateToggle,
              }}
            />
          </Grid>
        )}

        <Grid item xs={9}>
          <BackButton pathname={`/${PRODUCTS}/${TYPE}`} />
        </Grid>

        <Grid item xs={9}>
          <ConnectionDialog
            {...{
              open,
              toggle: decorateToggle,
              isVariant,
            }}
          />
        </Grid>
      </Grid>
    </ConnectionContext.Provider>
  );
};

export default Connection;
