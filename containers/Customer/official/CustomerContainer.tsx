import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";

import { Tabs, Tab, Grid, Stack, Button } from "@mui/material";

import ExportButton from "components/Button/ExportButton";
import { TabPanel, LoadingDynamic as Loading, BackButton, Container } from "components";

import { usePermission } from "hooks";
import CustomerProvider from "./context";
import { CUSTOMERS, DEBT_RECORD, EXPORTS } from "routes";

const ViewCustomer = dynamic(import("./ViewCustomerDetail"), {
  loading: () => {
    return <Loading />;
  },
});

const EditCustomer = dynamic(import("./EditCustomerDetail"), {
  loading: () => {
    return <Loading />;
  },
});

const InvoiceHistoryTab = dynamic(import("./InvoiceHistoryTab"), {
  loading: () => {
    return <Loading />;
  },
});

const AccountPayable = dynamic(import("./AccountPayable"), {
  loading: () => {
    return <Loading />;
  },
});

const CreateTransactionDialog = dynamic(import("./CreateTransactionDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const CustomerContainer = () => {
  const router = useRouter();
  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);
  const [currentTab, setCurrentTab] = useState(0);

  const { hasPermission: writePermission } = usePermission("write_transaction");
  const { hasPermission: exportCustomerDebtRecordPermission } = usePermission(
    "export_customer_debt_record"
  );

  const changeTabHandler = useCallback((_, newTab) => {
    setCurrentTab(newTab);
  }, []);

  const onGotoExportFileHandler = useCallback(() => {
    window.open(`/${EXPORTS}/${DEBT_RECORD}`, "_blank");
  }, []);

  return (
    <CustomerProvider>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <Tabs value={currentTab} onChange={changeTabHandler}>
              <Tab label={messages["info"]} />
              <Tab label={messages["saleHistory"]} />
              <Tab label={messages["recoverPublicDebt"]} />
            </Tabs>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              paddingLeft: "0 !important",
              paddingRight: "0 !important",
            }}
          >
            <TabPanel value={currentTab} index={0}>
              {router.query?.draft?.[0] ? <EditCustomer /> : <ViewCustomer />}
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <InvoiceHistoryTab />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <Stack spacing={3}>
                <AccountPayable />
                <Stack flexDirection="row" justifyContent="space-between">
                  <BackButton pathname={`/${CUSTOMERS}`} />

                  <Stack flexDirection="row" columnGap={2}>
                    {exportCustomerDebtRecordPermission && (
                      <ExportButton onClick={onGotoExportFileHandler} />
                    )}

                    {writePermission && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          toggle(true);
                        }}
                      >
                        {messages["payment"]}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Stack>

              <CreateTransactionDialog
                {...{
                  open,
                  toggle,
                }}
              />
            </TabPanel>
          </Grid>
        </Grid>
      </Container>
    </CustomerProvider>
  );
};

export default CustomerContainer;
