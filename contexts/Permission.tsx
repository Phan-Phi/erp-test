import useSWR from "swr";
import { useSession } from "next-auth/react";
import React, { useMemo, useEffect, createContext } from "react";

import { transformUrl } from "libs";
import { ME, ME_PERMISSION, PERMISSION } from "apis";
import { ME_ITEM, ME_PERMISSION_ITEM, PERMISSION_ITEM } from "interfaces";

export type PERMISSION_TYPE = (typeof APP_PERMISSION_LIST)[number];

export const PermissionContext = createContext<{
  userPermission: PERMISSION_TYPE[];
  appPermission: PERMISSION_TYPE[];
}>({
  userPermission: [],
  appPermission: [],
});

const Permission = ({ children }) => {
  const { data: session, status } = useSession();

  const { data: meData } = useSWR<ME_ITEM>(() => {
    if (status !== "authenticated" || (session && session.user.login_as_default)) return;

    return ME;
  });

  const { data: mePermissionData, mutate } = useSWR<ME_PERMISSION_ITEM[]>(
    () => {
      if (status !== "authenticated" || (session && session.user.login_as_default))
        return;

      return transformUrl(ME_PERMISSION, {
        get_all: true,
      });
    },
    {
      refreshInterval: 5 * 60 * 1000,
    }
  );

  const { data: appPermissionData, mutate: mutateDefault } = useSWR<PERMISSION_ITEM[]>(
    () => {
      if (status !== "authenticated" || (session && session.user.login_as_default))
        return;

      return transformUrl(PERMISSION, { get_all: true });
    },
    {
      refreshInterval: 30 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (status === "authenticated") {
      mutate();
      mutateDefault();
    }
  }, [status]);

  const contextValue = useMemo(() => {
    if (status === "unauthenticated" || (session && session.user.login_as_default)) {
      return {
        userPermission: [],
        appPermission: [],
      };
    }

    if (
      mePermissionData == undefined ||
      appPermissionData == undefined ||
      meData == undefined
    )
      return null;

    const appPermission = appPermissionData.map((el) => el.codename) as PERMISSION_TYPE[];

    let userPermission: PERMISSION_TYPE[] = [];

    if (meData.is_superuser) {
      userPermission = appPermission;
    } else {
      userPermission = mePermissionData.map((el) => el.codename) as PERMISSION_TYPE[];
    }

    return {
      userPermission,
      appPermission,
    };
  }, [status, mePermissionData, appPermissionData, meData, session]);

  if (contextValue == undefined) return null;

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};

export default Permission;

const APP_PERMISSION_LIST = [
  "read_payment_method",
  "write_payment_method",
  "read_transaction_type",
  "write_transaction_type",
  "read_transaction",
  "write_transaction",
  "approve_transaction",
  "read_debt_record",
  "write_site",
  "write_user",
  "read_user",
  "read_sale_report",
  "read_product_report",
  "read_customer_report",
  "read_partner_report",
  "read_staff_report",
  "read_cash_report",
  "read_shipping_method",
  "write_shipping_method",
  "read_shipper",
  "write_shipper",
  "write_attribute",
  "read_attribute",
  "read_category",
  "write_category",
  "read_product",
  "write_product",
  "manage_availability_of_product",
  "write_product_class",
  "read_product_class",
  "read_partner",
  "write_partner",
  "read_purchase_order",
  "write_purchase_order",
  "approve_purchase_order",
  "read_receipt_order",
  "write_receipt_order",
  "approve_receipt_order",
  "read_return_order",
  "write_return_order",
  "approve_return_order",
  "read_stock_out_note",
  "write_stock_out_note",
  "approve_stock_out_note",
  "read_warehouse",
  "write_warehouse",
  "read_sale",
  "write_sale",
  "read_voucher",
  "write_voucher",
  "read_invoice",
  "write_invoice",
  "approve_invoice",
  "read_order",
  "write_order",
  "approve_order",
  "read_purchase_channel",
  "write_purchase_channel",
  "write_customer_type",
  "read_customer_type",
  "approve_customer",
  "write_customer",
  "read_customer",
  "export_invoice_quantity",
  "export_transaction",
  "export_customer_debt_record",
] as const;
