import { transformUrl } from "libs";
import ReturnHistoryTable from "./ReturnHistoryTable";
import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";

const ReturnOrderHistoryTab = () => {
  return (
    <ReturnHistoryTable
      {...{
        noteUrl: transformUrl(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
          {
            nested_depth: 3,
          }
        ),
        noteLineUrl: transformUrl(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_END_POINT,
          {
            nested_depth: 4,
          }
        ),
      }}
    />
  );
};

export default ReturnOrderHistoryTab;
