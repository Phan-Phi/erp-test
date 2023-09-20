import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useCallback, useState } from "react";

import { Box, Stack, Tab, Tabs } from "@mui/material";

import PurchaseOrderHistoryTab from "./PurchaseOrderHistoryTab";

import { LoadingDynamic as Loading } from "components";

const ReceiptOrderHistoryTab = dynamic(import("./ReceiptOrderHistoryTab"), {
  loading: () => {
    return <Loading />;
  },
});

const ReturnOrderHistoryTab = dynamic(import("./ReturnOrderHistoryTab"), {
  loading: () => {
    return <Loading />;
  },
});

const AccountPayable = dynamic(import("./AccountPayable"), {
  loading: () => {
    return <Loading />;
  },
});

function TabPanel({ children, value, index, ...props }) {
  return value == index ? <Box hidden={value !== index}>{children}</Box> : null;
}

const History = () => {
  const [value, setValue] = useState(0);

  const { messages } = useIntl();

  const handleChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, newValue: any) => {
      setValue(newValue);
    },
    []
  );

  return (
    <Stack spacing={3}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label={messages["purchaseOrderHistory"]} />
        <Tab label={messages["receiptOrderHistory"]} />
        <Tab label={messages["returnOrderHistory"]} />
        <Tab label={messages["payBackSupplier"]} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <PurchaseOrderHistoryTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReceiptOrderHistoryTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReturnOrderHistoryTab />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AccountPayable />
      </TabPanel>
    </Stack>
  );
};

export default History;
