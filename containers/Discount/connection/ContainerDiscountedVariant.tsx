import dynamic from "next/dynamic";
import { useToggle } from "react-use";
import { useIntl } from "react-intl";

import { Button, Stack, Typography } from "@mui/material";

import AddedDiscountedVariant from "./AddedDiscountedVariant";

import { usePermission } from "hooks";
import { LoadingDynamic as Loading, Card } from "components";

import DiscountProvider from "./context";

const AddDiscountedVariantDialog = dynamic(() => import("./AddDiscountedVariantDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const AddDiscountedCategoryDialog = dynamic(
  () => import("./AddDiscountedCategoryDialog"),
  {
    loading: () => {
      return <Loading />;
    },
  }
);

const DiscountedVariant = () => {
  const { hasPermission: writePermission } = usePermission("write_sale");

  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);
  const [open2, toggle2] = useToggle(false);

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>{messages["listingDiscountProduct"]}</Typography>
            {writePermission && (
              <Stack flexDirection="row" columnGap={1}>
                <Button
                  variant="contained"
                  onClick={() => {
                    toggle2(true);
                  }}
                >
                  {messages["addCategory"]}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    toggle(true);
                  }}
                >
                  {messages["addProduct"]}
                </Button>
              </Stack>
            )}
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return (
          <DiscountProvider>
            <AddedDiscountedVariant />

            <AddDiscountedVariantDialog
              {...{
                open,
                toggle,
              }}
            />
            <AddDiscountedCategoryDialog
              {...{
                open: open2,
                toggle: toggle2,
              }}
            />
          </DiscountProvider>
        );
      }}
    />
  );
};

export default DiscountedVariant;
