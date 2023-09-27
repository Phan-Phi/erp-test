import { Fragment } from "react";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";

import { Button, Stack, Typography } from "@mui/material";

import { usePermission } from "hooks";
import InvoiceList from "./InvoiceList";
import { LoadingDynamic as Loading, Card } from "components";

const CreateInvoiceDialog = dynamic(() => import("./CreateInvoiceDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const Invoice = () => {
  const { hasPermission: writePermission } = usePermission("write_invoice");

  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={700}>{messages["listingInvoice"]}</Typography>

            {writePermission && (
              <Button
                onClick={() => {
                  toggle(true);
                }}
              >
                {messages["createInvoice"]}
              </Button>
            )}
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return (
          <Fragment>
            <InvoiceList />
            <CreateInvoiceDialog {...{ open, toggle }} />
          </Fragment>
        );
      }}
    />
  );
};

export default Invoice;
