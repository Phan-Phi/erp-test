import dynamic from "next/dynamic";
import { useToggle } from "react-use";
import { useIntl } from "react-intl";

import { Button, Stack, Typography } from "@mui/material";

import { usePermission } from "hooks";
import ReturnOrderProvider from "./context";
import ReturnOrderList from "./ReturnOrderList";
import { LoadingDynamic as Loading, Card } from "components";

const CreateReturnOrderDialog = dynamic(() => import("./CreateReturnOrderDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const ReturnOrder = () => {
  const { hasPermission: writePermission } = usePermission("write_return_order");

  const [open, toggle] = useToggle(false);

  const { messages } = useIntl();

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>{messages["listingReturnOrderNote"]}</Typography>
            {writePermission && (
              <Button
                variant="contained"
                onClick={() => {
                  toggle(true);
                }}
              >
                {messages["createReturnOrder"]}
              </Button>
            )}
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return (
          <ReturnOrderProvider>
            <ReturnOrderList />
            <CreateReturnOrderDialog {...{ open, toggle }} />
          </ReturnOrderProvider>
        );
      }}
    />
  );
};

export default ReturnOrder;
