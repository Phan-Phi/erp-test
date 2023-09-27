import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Control } from "react-hook-form";
import { useState, useEffect } from "react";

import get from "lodash/get";
import { MenuItem } from "@mui/material";

import { transformUrl } from "libs";
import { NoData, LoadingDynamic as Loading, Select } from "components";

import { ADMIN_STOCK_RECEIPT_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

interface RETURN_ORDER_EXTENDS
  extends ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_SCHEMA_TYPE {
  id?: number;
}

interface SelectReceiptOrderProps {
  control: Control<any>;
}

const SelectReceiptOrder = (props: SelectReceiptOrderProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const control = props.control as Control<RETURN_ORDER_EXTENDS>;

  const [receiptOrderList, setReceiptOrderList] =
    useState<ADMIN_STOCK_RECEIPT_ORDER_VIEW_TYPE_V1[]>();

  const { data: receiptOrderData } = useSWR<ADMIN_STOCK_RECEIPT_ORDER_VIEW_TYPE_V1[]>(
    () => {
      const id = router.query.id;
      if (id) {
        return transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT, {
          order: id,
          get_all: true,
          can_be_returned: true,
        });
      }
    }
  );

  useEffect(() => {
    if (receiptOrderData == undefined) return;

    setReceiptOrderList(receiptOrderData);
  }, [receiptOrderData]);

  if (receiptOrderList == undefined) return <Loading />;

  if (get(receiptOrderList, "length") === 0) return <NoData />;

  return (
    <Select
      {...{
        control,
        name: "order",
        renderItem: () => {
          return receiptOrderList.map((el) => {
            return (
              <MenuItem key={el.id} value={el.id}>
                {el.sid}
              </MenuItem>
            );
          });
        },

        label: messages["receiptOrder"] as string,
      }}
    />
  );
};

export default SelectReceiptOrder;
