import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { Button, Stack, Typography } from "@mui/material";

import { usePermission } from "hooks";
import ReceiptOrderProvider from "./context";
import ReceiptOrderList from "./ReceiptOrderList";
import { Card, LoadingDynamic as Loading } from "components";

const ReceiptOrderDialog = dynamic(() => import("./ReceiptOrderDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const ReceiptOrder = () => {
  const { hasPermission: writePermission } = usePermission("write_receipt_order");

  const [open, toggle] = useToggle(false);

  const { messages } = useIntl();

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>{messages["listingReceiptOrderNote"]}</Typography>
            {writePermission && (
              <Button
                variant="contained"
                onClick={() => {
                  toggle(true);
                }}
              >
                {messages["createReceiptOrder"]}
              </Button>
            )}
          </Stack>
        );
      }}
      body={
        <ReceiptOrderProvider>
          <ReceiptOrderList />
          <ReceiptOrderDialog {...{ open, toggle }} />
        </ReceiptOrderProvider>
      }
    />
  );
};

export default ReceiptOrder;
