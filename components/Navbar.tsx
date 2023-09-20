import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useEffect, useRef, useContext, Fragment, useMemo } from "react";
import { usePopupState, bindHover, bindPopper } from "material-ui-popup-state/hooks";
import { Box, Stack, Typography, Popper, Fade, useTheme, styled } from "@mui/material";
import {
  TYPE,
  USERS,
  CASHES,
  ORDERS,
  SHIPPER,
  CATEGORY,
  PRODUCTS,
  OUTNOTES,
  PARTNERS,
  ATTRIBUTE,
  CUSTOMERS,
  DISCOUNTS,
  WAREHOUSES,
  PAYMENT_METHOD,
  PURCHASE_ORDERS,
  SHIPPING_METHOD,
  PURCHASE_CHANNEL,
  REPORTS,
  SALE_REPORT,
  PRODUCT_REPORT,
  CUSTOMER_REPORT,
  PARTNER_REPORT,
  STAFF_REPORT,
  FINANCE_REPORT,
} from "routes";

import { usePermission } from "hooks";
import { LayoutContext } from "contexts";
import { Link, Container } from "components";

export const Navbar = () => {
  const { messages } = useIntl();
  const router = useRouter();

  const layoutContext = useContext(LayoutContext);
  const navbarRef = useRef<HTMLDivElement>();
  const theme = useTheme();

  const productPopupState = usePopupState({ variant: "popper", popupId: "productMenu" });

  const transactionPopState = usePopupState({
    variant: "popper",
    popupId: "transactionMenu",
  });

  const cashPopupState = usePopupState({ variant: "popper", popupId: "cashMenu" });

  const managementPopupState = usePopupState({
    variant: "popper",
    popupId: "managementMenu",
  });

  const partnerPopupState = usePopupState({ variant: "popper", popupId: "partnerMenu" });

  const reportPopupState = usePopupState({ variant: "popper", popupId: "reportMenu" });

  // CUSTOMER

  const { hasPermission: readCustomerPermission } = usePermission("read_customer");

  const { hasPermission: readCustomerTypePermission } =
    usePermission("read_customer_type");

  // PRODUCT

  const { hasPermission: readProductPermission } = usePermission("read_product");

  const { hasPermission: readAttributePermission } = usePermission("read_attribute");

  const { hasPermission: readCategoryPermission } = usePermission("read_category");

  const { hasPermission: readProductClassPermission } =
    usePermission("read_product_class");

  // WAREHOUSE

  const { hasPermission: readWarehousePermission } = usePermission("read_warehouse");

  const { hasPermission: readStockOutNotePermission } =
    usePermission("read_stock_out_note");

  const { hasPermission: readPurchaseOrderPermission } =
    usePermission("read_purchase_order");

  // PARTNER

  const { hasPermission: readPartnerPermission } = usePermission("read_partner");

  // CASH

  const { hasPermission: readTransactionPermission } = usePermission("read_transaction");

  const { hasPermission: readDebtRecordPermission } = usePermission("read_debt_record");

  const { hasPermission: readTransactionTypePermission } = usePermission(
    "read_transaction_type"
  );

  // DISCOUNT

  const { hasPermission: readSalePermission } = usePermission("read_sale");

  // USER

  const { hasPermission: readUserPermission } = usePermission("read_user");

  // ORDER

  const { hasPermission: readOrderPermission } = usePermission("read_order");

  const { hasPermission: readInvoicePermission } = usePermission("read_invoice");

  const { hasPermission: readPurchaseChannelPermission } = usePermission(
    "read_purchase_channel"
  );

  const { hasPermission: readShipperPermission } = usePermission("read_shipper");

  const { hasPermission: readShippingMethodPermission } =
    usePermission("read_shipping_method");

  const { hasPermission: readPaymentMethodPermission } =
    usePermission("read_payment_method");

  const { hasPermission: readSaleReportPermission } = usePermission("read_sale_report");

  const { hasPermission: readProductReportPermission } =
    usePermission("read_product_report");

  const { hasPermission: readCustomerReportPermission } =
    usePermission("read_customer_report");

  const { hasPermission: readPartnerReportPermission } =
    usePermission("read_partner_report");

  const { hasPermission: readStaffPermission } = usePermission("read_staff_report");

  const { hasPermission: readCashPermission } = usePermission("read_cash_report");

  useEffect(() => {
    if (navbarRef.current) {
      let navbarHeight = navbarRef.current.offsetHeight;

      if (navbarHeight < 57.5) {
        navbarHeight = 57.5;
      }

      layoutContext.setState({
        navbarHeight,
      });
    }
  }, []);

  const renderProduct = useMemo(() => {
    if (
      !readAttributePermission &&
      !readProductClassPermission &&
      !readCategoryPermission &&
      !readProductPermission
    ) {
      return null;
    }

    return (
      <Fragment>
        <CustomTypography
          {...bindHover(productPopupState)}
          sx={{
            ...(router.pathname.includes("products") && {
              color: "primary.main",
            }),
          }}
        >
          {messages["product"]}
        </CustomTypography>
        <Popper
          {...bindPopper(productPopupState)}
          transition
          placement="bottom-start"
          style={{
            zIndex: 1301,
          }}
        >
          {({ TransitionProps }) => {
            return (
              <Fade {...TransitionProps} timeout={300}>
                <CustomStack spacing={1}>
                  {readProductPermission && (
                    <CustomLink href={`/${PRODUCTS}`}>
                      {messages["listingProduct"]}
                    </CustomLink>
                  )}

                  {readAttributePermission && (
                    <CustomLink
                      sx={{
                        pointerEvents: "none",
                        opacity: 0.5,
                        userSelect: "none",
                      }}
                      href={`/${PRODUCTS}/${ATTRIBUTE}`}
                    >
                      {messages["productAttribute"]}
                    </CustomLink>
                  )}

                  {readCategoryPermission && (
                    <CustomLink href={`/${PRODUCTS}/${CATEGORY}`}>
                      {messages["productCategory"]}
                    </CustomLink>
                  )}

                  {readProductClassPermission && (
                    <CustomLink href={`/${PRODUCTS}/${TYPE}`}>
                      {messages["productType"]}
                    </CustomLink>
                  )}
                </CustomStack>
              </Fade>
            );
          }}
        </Popper>
      </Fragment>
    );
  }, [
    readAttributePermission,
    readProductClassPermission,
    readCategoryPermission,
    readProductPermission,
    productPopupState,
    router.pathname,
  ]);

  const renderTransaction = useMemo(() => {
    if (
      !readPurchaseOrderPermission &&
      !readOrderPermission &&
      !readStockOutNotePermission
    ) {
      return null;
    }

    return (
      <Fragment>
        <CustomTypography
          {...bindHover(transactionPopState)}
          sx={{
            ...((router.pathname.includes("purchase-orders") ||
              (router.pathname.includes("orders") &&
                !router.pathname.includes("shipper") &&
                !router.pathname.includes("purchase-channel") &&
                !router.pathname.includes("shipping-method")) ||
              router.pathname.includes("outnotes")) && {
              color: "primary.main",
            }),
          }}
        >
          {messages["transaction"]}
        </CustomTypography>
        <Popper
          {...bindPopper(transactionPopState)}
          transition
          placement="bottom-start"
          style={{
            zIndex: 1301,
          }}
        >
          {({ TransitionProps }) => {
            return (
              <Fade {...TransitionProps} timeout={300}>
                <CustomStack spacing={1}>
                  {readPurchaseOrderPermission && (
                    <CustomLink href={`/${PURCHASE_ORDERS}`}>
                      {messages["partnerOrder"]}
                    </CustomLink>
                  )}

                  {readOrderPermission && (
                    <CustomLink href={`/${ORDERS}`}>{messages["clientOrder"]}</CustomLink>
                  )}

                  {readStockOutNotePermission && (
                    <CustomLink href={`/${OUTNOTES}`}>{messages["outnote"]}</CustomLink>
                  )}
                </CustomStack>
              </Fade>
            );
          }}
        </Popper>
      </Fragment>
    );
  }, [
    readPurchaseOrderPermission,
    readOrderPermission,
    readStockOutNotePermission,
    transactionPopState,
    router.pathname,
  ]);

  const renderPartner = useMemo(() => {
    if (!readCustomerPermission && !readPartnerPermission && !readShipperPermission) {
      return null;
    }

    return (
      <Fragment>
        <CustomTypography
          {...bindHover(partnerPopupState)}
          sx={{
            ...(((router.pathname.includes("customers") &&
              !router.pathname.includes("type")) ||
              router.pathname.includes("partners") ||
              router.pathname.includes("orders/shipper")) && {
              color: "primary.main",
            }),
          }}
        >
          {messages["partner"]}
        </CustomTypography>
        <Popper
          {...bindPopper(partnerPopupState)}
          transition
          placement="bottom-start"
          style={{
            zIndex: 1301,
          }}
        >
          {({ TransitionProps }) => {
            return (
              <Fade {...TransitionProps} timeout={300}>
                <CustomStack spacing={1}>
                  {readCustomerPermission && (
                    <CustomLink href={`/${CUSTOMERS}`}>{messages["customer"]}</CustomLink>
                  )}

                  {readPartnerPermission && (
                    <CustomLink href={`/${PARTNERS}`}>{messages["supplier"]}</CustomLink>
                  )}

                  {readShipperPermission && (
                    <CustomLink href={`/${ORDERS}/${SHIPPER}`}>
                      {messages["shipperPartner"]}
                    </CustomLink>
                  )}
                </CustomStack>
              </Fade>
            );
          }}
        </Popper>
      </Fragment>
    );
  }, [
    readCustomerPermission,
    readPartnerPermission,
    readShipperPermission,
    partnerPopupState,
    router.pathname,
  ]);

  const renderCash = useMemo(() => {
    if (
      !readTransactionPermission &&
      !readTransactionTypePermission &&
      !readPaymentMethodPermission
    ) {
      return null;
    }

    return (
      <Fragment>
        <CustomTypography
          {...bindHover(cashPopupState)}
          sx={{
            ...(router.pathname.includes("cashes") && {
              color: "primary.main",
            }),
          }}
        >
          {messages["cash"]}
        </CustomTypography>
        <Popper
          {...bindPopper(cashPopupState)}
          transition
          placement="bottom-start"
          style={{
            zIndex: 1301,
          }}
        >
          {({ TransitionProps }) => {
            return (
              <Fade {...TransitionProps} timeout={300}>
                <CustomStack spacing={1}>
                  {readTransactionPermission && (
                    <CustomLink href={`/${CASHES}`}>{messages["transaction"]}</CustomLink>
                  )}
                  {readTransactionTypePermission && (
                    <CustomLink href={`/${CASHES}/${TYPE}`}>
                      {messages["transactionType"]}
                    </CustomLink>
                  )}
                  {readPaymentMethodPermission && (
                    <CustomLink href={`/${CASHES}/${PAYMENT_METHOD}`}>
                      {messages["paymentMethod"]}
                    </CustomLink>
                  )}
                </CustomStack>
              </Fade>
            );
          }}
        </Popper>
      </Fragment>
    );
  }, [
    readTransactionPermission,
    readTransactionTypePermission,
    readPaymentMethodPermission,
    cashPopupState,
    router.pathname,
  ]);

  const renderManagement = useMemo(() => {
    if (
      !readUserPermission &&
      !readWarehousePermission &&
      !readPurchaseChannelPermission &&
      !readShippingMethodPermission &&
      !readCustomerTypePermission &&
      !readSalePermission
    ) {
      return null;
    }

    return (
      <Fragment>
        <CustomTypography
          {...bindHover(managementPopupState)}
          sx={{
            ...((router.pathname.includes("users") ||
              router.pathname.includes("warehouses") ||
              router.pathname.includes("orders/purchase-channel") ||
              router.pathname.includes("orders/shipping-method") ||
              router.pathname.includes("discount") ||
              router.pathname.includes("customers/type")) && {
              color: "primary.main",
            }),
          }}
        >
          {messages["management"]}
        </CustomTypography>
        <Popper
          {...bindPopper(managementPopupState)}
          transition
          placement="bottom-start"
          style={{
            zIndex: 1301,
          }}
        >
          {({ TransitionProps }) => {
            return (
              <Fade {...TransitionProps} timeout={300}>
                <CustomStack spacing={1}>
                  {readUserPermission && (
                    <CustomLink href={`/${USERS}/`}>{messages["user"]}</CustomLink>
                  )}

                  {readWarehousePermission && (
                    <CustomLink href={`/${WAREHOUSES}`}>
                      {messages["warehouse"]}
                    </CustomLink>
                  )}

                  {readPurchaseChannelPermission && (
                    <CustomLink href={`/${ORDERS}/${PURCHASE_CHANNEL}`}>
                      {messages["purchaseChannel"]}
                    </CustomLink>
                  )}

                  {readShippingMethodPermission && (
                    <CustomLink href={`/${ORDERS}/${SHIPPING_METHOD}`}>
                      {messages["shippingMethod"]}
                    </CustomLink>
                  )}

                  {readSalePermission && (
                    <CustomLink href={`/${DISCOUNTS}/`}>
                      {messages["discount"]}
                    </CustomLink>
                  )}

                  {/* {readVoucherPermission && (
              <CustomLink href={`/${VOUCHERS}/`}>
                <FormattedMessage id="navbar.voucherList" defaultMessage="Mã giảm giá" />
              </CustomLink>
            )} */}
                  {readCustomerTypePermission && (
                    <CustomLink href={`/${CUSTOMERS}/${TYPE}`}>
                      {messages["customerType"]}
                    </CustomLink>
                  )}
                </CustomStack>
              </Fade>
            );
          }}
        </Popper>
      </Fragment>
    );
  }, [
    readUserPermission,
    readWarehousePermission,
    readPurchaseChannelPermission,
    readShippingMethodPermission,
    readCustomerTypePermission,
    managementPopupState,
    readSalePermission,
    router.pathname,
  ]);

  const renderReport = useMemo(() => {
    if (
      !readSaleReportPermission &&
      !readProductReportPermission &&
      !readCustomerReportPermission &&
      !readPartnerReportPermission &&
      !readStaffPermission &&
      !readCashPermission
    ) {
      return null;
    }

    return (
      <Fragment>
        <CustomTypography
          {...bindHover(reportPopupState)}
          sx={{
            ...(router.pathname.includes("reports") && {
              color: "primary.main",
            }),
          }}
        >
          {messages["report"]}
        </CustomTypography>
        <Popper
          {...bindPopper(reportPopupState)}
          transition
          placement="bottom-start"
          style={{
            zIndex: 1301,
          }}
        >
          {({ TransitionProps }) => {
            return (
              <Fade {...TransitionProps} timeout={300}>
                <CustomStack spacing={1}>
                  {readSaleReportPermission && (
                    <CustomLink href={`/${REPORTS}/${SALE_REPORT}`}>
                      {messages["saleReport"]}
                    </CustomLink>
                  )}
                  {readProductReportPermission && (
                    <CustomLink href={`/${REPORTS}/${PRODUCT_REPORT}`}>
                      {messages["productReport"]}
                    </CustomLink>
                  )}
                  {readCustomerReportPermission && (
                    <CustomLink href={`/${REPORTS}/${CUSTOMER_REPORT}`}>
                      {messages["customerReport"]}
                    </CustomLink>
                  )}
                  {readPartnerReportPermission && (
                    <CustomLink href={`/${REPORTS}/${PARTNER_REPORT}`}>
                      {messages["partnerReport"]}
                    </CustomLink>
                  )}
                  {readStaffPermission && (
                    <CustomLink href={`/${REPORTS}/${STAFF_REPORT}`}>
                      {messages["staffReport"]}
                    </CustomLink>
                  )}
                  {readCashPermission && (
                    <CustomLink href={`/${REPORTS}/${FINANCE_REPORT}`}>
                      {messages["financeReport"]}
                    </CustomLink>
                  )}
                </CustomStack>
              </Fade>
            );
          }}
        </Popper>
      </Fragment>
    );
  }, [
    reportPopupState,
    router.pathname,
    readSaleReportPermission,
    readProductReportPermission,
    readCustomerReportPermission,
    readPartnerReportPermission,
    readStaffPermission,
    readCashPermission,
  ]);

  return (
    <Box
      ref={navbarRef}
      sx={{
        display: "flex",
        justifyContent: "center",
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(2, 0),
        backgroundColor: "background.default",
      }}
    >
      <Container>
        <Stack flexDirection="row" columnGap={3} alignItems="center">
          <CustomLink
            href={`/`}
            sx={{
              fontWeight: "bold",
              ...(router.pathname === "/" && {
                color: "primary.main",
              }),
              fontFamily: "Mulish",
            }}
          >
            {messages["overview"]}
          </CustomLink>

          {renderProduct}

          {renderTransaction}

          {renderPartner}

          {renderCash}

          {renderManagement}

          {renderReport}
        </Stack>
      </Container>
    </Box>
  );
};

const CustomTypography = styled(Typography)(({ theme }) => {
  return {
    padding: 1,
    cursor: "pointer",
    fontWeight: "bold",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  };
});

const CustomLink = styled(Link)(({ theme }) => {
  return {
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  };
});

const CustomStack = styled(Stack)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2.5),
  };
});
