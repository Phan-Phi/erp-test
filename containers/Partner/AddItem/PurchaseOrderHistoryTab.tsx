import { transformUrl } from "libs";
import HistoryTable from "./HistoryTable";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT,
} from "__generated__/END_POINT";

const OrderHistoryTab = () => {
  return (
    <HistoryTable
      {...{
        noteUrl: transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT, {
          nested_depth: 3,
        }),
        noteLineUrl: transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, {
          nested_depth: 3,
        }),
      }}
    />
  );
};

export default OrderHistoryTab;
