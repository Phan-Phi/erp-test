import { transformUrl } from "libs";
import HistoryTable from "./HistoryTable";

import {
  ADMIN_ORDERS_INVOICES_END_POINT,
  ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";

const InvoiceHistoryTab = () => {
  return (
    <HistoryTable
      {...{
        noteUrl: ADMIN_ORDERS_INVOICES_END_POINT,
        noteLineUrl: transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
          nested_depth: 3,
        }),
      }}
    />
  );
};

export default InvoiceHistoryTab;
