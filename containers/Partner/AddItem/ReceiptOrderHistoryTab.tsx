import { transformUrl } from "libs";
import ImportHistoryTable from "./ImportHistoryTable";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";

const OrderHistoryTab = () => {
  return (
    <ImportHistoryTable
      {...{
        noteUrl: transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT, {
          nested_depth: 3,
        }),
        noteLineUrl: transformUrl(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
          {
            nested_depth: 3,
          }
        ),
      }}
    />
  );
};

export default OrderHistoryTab;
