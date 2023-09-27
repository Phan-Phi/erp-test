import React, { useCallback, useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import OrderList from "./OrderList";
import { TabPanel } from "components";
import InvoiceList from "./InvoiceList";

export default function ContainerOrder() {
  const [tab, setTab] = useState(0);

  const onChangeTab = useCallback((_, newTab) => {
    setTab(newTab);
  }, []);

  return (
    <Box>
      <Tabs value={tab} onChange={onChangeTab}>
        <Tab label="Đơn hàng" />

        <Tab label="Hóa đơn" />
      </Tabs>

      <Box padding="10px" />

      <TabPanel value={tab} index={0}>
        <OrderList />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <InvoiceList />
      </TabPanel>
    </Box>
  );
}
