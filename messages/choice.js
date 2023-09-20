import { defineMessages } from "react-intl";

export function TransalteChoice() {
  const choices = {
    genders: [
      ["Male", "Nam"],
      ["Female", "Nữ"],
    ],
    draft_customer_states: [
      ["Pending", "Chờ xử lý"],
      ["Confirmed", "Đã duyệt"],
    ],
    product_attribute_types: [
      ["Option", "Một lựa chọn"],
      ["Multi_option", "Nhiều lựa chọn"],
    ],
    purchase_order_statuses: [
      ["Draft", "Bản nháp"],
      ["Confirmed", "Đã duyệt"],
      ["Processed", "Đang xử lý"],
      ["Partial_fulfilled", "Bán hoàn thành"],
      ["Fulfilled", "Hoàn thành"],
      ["Cancelled", "Đã hủy"],
    ],
    receipt_order_statuses: [
      ["Draft", "Bản nháp"],
      ["Confirmed", "Bản đã duyệt"],
      ["Partial_paid", "Đã thanh toán một phần"],
      ["Paid", "Đã thanh toán"],
      ["Over_paid", "Đã thanh toán dư"],
    ],
    return_order_statuses: [
      ["Draft", "Bản nháp"],
      ["Confirmed", "Bản đã duyệt"],
    ],
    stock_out_note_statuses: [
      ["Draft", "Bản nháp"],
      ["Confirmed", "Bản đã duyệt"],
    ],
    transaction_target_types: [
      ["partner.partner", "Đối tác"],
      ["customer.customer", "Khách hàng"],
    ],
    transaction_statuses: [
      ["Draft", "Bản nháp"],
      ["Confirmed", "Bản xác nhận"],
    ],
    debt_source_types: [
      ["stock.receiptorder", "Đơn nhập hàng"],
      ["stock.returnorder", "Đơn trả hàng"],
      ["order.invoice", "Hóa đơn"],
    ],
    transaction_source_types: [
      ["stock.receiptorder", "Đơn nhập hàng"],
      ["stock.stockoutnote", "Đơn xuất kho"],
      ["order.invoice", "Hóa đơn"],
    ],
    transaction_flow_types: [
      ["Cash_out", "Chi tiền"],
      ["Cash_in", "Thu tiền"],
    ],
    creditor_types: [
      ["partner.partner", "Đối tác"],
      ["customer.customer", "Khách hàng"],
    ],
    shipping_method_types: [
      ["Price", "Tính theo giá"],
      ["Weight", "Tính theo cân nặng"],
    ],
    voucher_types: [
      ["Entire_order", "Giảm giá trên tổng đơn hàng"],
      ["Shipping", "Giảm giá trên phí giao hàng"],
      ["Specific_product_variant", "Giảm giá cho sản phẩm"],
    ],
    order_statuses: [
      ["Draft", "Bản nháp"],
      ["Confirmed", "Đã duyệt"],
      ["Processed", "Đang xử lý"],
      ["Fulfilled", "Hoàn thành"],
      ["Partial_fulfilled", "Bán hoàn thành"],
      ["Cancelled", "Đã hủy"],
    ],
    invoice_statuses: [
      ["Draft", "Bản nháp"],
      ["Confirmed", "Đã duyệt"],
      ["Processed", "Đang xử lý"],
      ["Partial_paid", "Đã thanh toán một phần"],
      ["Paid", "Đã thanh toán"],
      ["Cancelled", "Đã hủy"],
    ],
    shipping_statuses: [
      ["Pending", "Chờ xử lý"],
      ["Received", "Đã lấy hàng"],
      ["On delivery", "Đang vận chuyển"],
      ["Delivered", "Đã giao hàng"],
      ["Returned", "Trả hàng"],
    ],
    discount_types: [
      ["Percentage", "Giảm giá theo phần trăm"],
      ["Absolute", "Giảm giá theo giá trị"],
    ],
    permission_content_types: [
      ["cash.paymentmethod", "Phương thức thanh toán"],
      ["cash.transactiontype", "Loại giao dịch"],
      ["cash.transaction", "Giao dịch"],
      ["cash.debtrecord", "Lịch sử nợ"],
      ["site_setting.sitesettings", "Thông tin cài đặt"],
      ["account.user", "Tài khoản"],
      ["shipping.shippingmethod", "Phương thức vận chuyển"],
      ["shipping.shipper", "Đối tác giao hàng"],
      ["catalogue.productclass", "Loại sản phẩm"],
      ["catalogue.category", "Danh mục"],
      ["catalogue.product", "Sản phẩm"],
      ["catalogue.attribute", "Thuộc tính"],
      ["partner.partner", "Đối tác"],
      ["stock.warehouse", "Kho"],
      ["stock.purchaseorder", "Đơn đặt mua"],
      ["stock.receiptorder", "Đơn nhập hàng"],
      ["stock.returnorder", "Đơn trả hàng"],
      ["stock.stockoutnote", "Đơn xuất kho"],
      ["discount.voucher", "Voucher"],
      ["discount.sale", "Chương trình giảm giá"],
      ["order.purchasechannel", "Kênh bán"],
      ["order.order", "Đơn hàng"],
      ["order.invoice", "Hóa đơn"],
      ["customer.customer", "Khách hàng"],
      ["customer.customertype", "Nhóm khách hàng"],
    ],
  };

  // let messages = {};

  // for (const key of Object.keys(choices)) {
  //   choices[key].forEach((el) => {
  //     const newKey = `${key}.${el[0]}`;
  //     const message = `${el[1]}`;

  //     messages[newKey] = {
  //       id: newKey,
  //       defaultMessage: message,
  //     };
  //   });
  // }

  defineMessages({
    "genders.Male": {
      id: "genders.Male",
      defaultMessage: "Nam",
    },
    "genders.Female": {
      id: "genders.Female",
      defaultMessage: "Nữ",
    },
    "draft_customer_states.Pending": {
      id: "draft_customer_states.Pending",
      defaultMessage: "Chờ xử lý",
    },
    "draft_customer_states.Confirmed": {
      id: "draft_customer_states.Confirmed",
      defaultMessage: "Đã duyệt",
    },
    "product_attribute_types.Option": {
      id: "product_attribute_types.Option",
      defaultMessage: "Một lựa chọn",
    },
    "product_attribute_types.Multi_option": {
      id: "product_attribute_types.Multi_option",
      defaultMessage: "Nhiều lựa chọn",
    },
    "purchase_order_statuses.Draft": {
      id: "purchase_order_statuses.Draft",
      defaultMessage: "Bản nháp",
    },
    "purchase_order_statuses.Confirmed": {
      id: "purchase_order_statuses.Confirmed",
      defaultMessage: "Đã duyệt",
    },
    "purchase_order_statuses.Processed": {
      id: "purchase_order_statuses.Processed",
      defaultMessage: "Đang xử lý",
    },
    "purchase_order_statuses.Partial_fulfilled": {
      id: "purchase_order_statuses.Partial_fulfilled",
      defaultMessage: "Bán hoàn thành",
    },
    "purchase_order_statuses.Fulfilled": {
      id: "purchase_order_statuses.Fulfilled",
      defaultMessage: "Hoàn thành",
    },
    "purchase_order_statuses.Cancelled": {
      id: "purchase_order_statuses.Cancelled",
      defaultMessage: "Đã hủy",
    },
    "receipt_order_statuses.Draft": {
      id: "receipt_order_statuses.Draft",
      defaultMessage: "Bản nháp",
    },
    "receipt_order_statuses.Confirmed": {
      id: "receipt_order_statuses.Confirmed",
      defaultMessage: "Đã nhập kho",
    },
    "receipt_order_statuses.Partial_paid": {
      id: "receipt_order_statuses.Partial_paid",
      defaultMessage: "Đã thanh toán một phần",
    },
    "receipt_order_statuses.Paid": {
      id: "receipt_order_statuses.Paid",
      defaultMessage: "Đã thanh toán",
    },
    "receipt_order_statuses.Over_paid": {
      id: "receipt_order_statuses.Over_paid",
      defaultMessage: "Đã thanh toán dư",
    },
    "return_order_statuses.Draft": {
      id: "return_order_statuses.Draft",
      defaultMessage: "Bản nháp",
    },
    "return_order_statuses.Confirmed": {
      id: "return_order_statuses.Confirmed",
      defaultMessage: "Đã trả hàng",
    },
    "stock_out_note_statuses.Draft": {
      id: "stock_out_note_statuses.Draft",
      defaultMessage: "Bản nháp",
    },
    "stock_out_note_statuses.Confirmed": {
      id: "stock_out_note_statuses.Confirmed",
      defaultMessage: "Bản đã duyệt",
    },
    "transaction_target_types.partner.partner": {
      id: "transaction_target_types.partner.partner",
      defaultMessage: "Đối tác",
    },
    "transaction_target_types.customer.customer": {
      id: "transaction_target_types.customer.customer",
      defaultMessage: "Khách hàng",
    },
    "transaction_statuses.Draft": {
      id: "transaction_statuses.Draft",
      defaultMessage: "Bản nháp",
    },
    "transaction_statuses.Confirmed": {
      id: "transaction_statuses.Confirmed",
      defaultMessage: "Bản xác nhận",
    },
    "debt_source_types.stock.receiptorder": {
      id: "debt_source_types.stock.receiptorder",
      defaultMessage: "Đơn nhập hàng",
    },
    "debt_source_types.stock.returnorder": {
      id: "debt_source_types.stock.returnorder",
      defaultMessage: "Đơn trả hàng",
    },
    "debt_source_types.order.invoice": {
      id: "debt_source_types.order.invoice",
      defaultMessage: "Hóa đơn",
    },
    "transaction_source_types.stock.receiptorder": {
      id: "transaction_source_types.stock.receiptorder",
      defaultMessage: "Đơn nhập hàng",
    },
    "transaction_source_types.stock.stockoutnote": {
      id: "transaction_source_types.stock.stockoutnote",
      defaultMessage: "Đơn xuất kho",
    },
    "transaction_source_types.order.invoice": {
      id: "transaction_source_types.order.invoice",
      defaultMessage: "Hóa đơn",
    },
    "transaction_flow_types.Cash_out": {
      id: "transaction_flow_types.Cash_out",
      defaultMessage: "Chi tiền",
    },
    "transaction_flow_types.Cash_in": {
      id: "transaction_flow_types.Cash_in",
      defaultMessage: "Thu tiền",
    },
    "creditor_types.partner.partner": {
      id: "creditor_types.partner.partner",
      defaultMessage: "Đối tác",
    },
    "creditor_types.customer.customer": {
      id: "creditor_types.customer.customer",
      defaultMessage: "Khách hàng",
    },
    "shipping_method_types.Price": {
      id: "shipping_method_types.Price",
      defaultMessage: "Tính theo giá",
    },
    "shipping_method_types.Weight": {
      id: "shipping_method_types.Weight",
      defaultMessage: "Tính theo cân nặng",
    },
    "voucher_types.Entire_order": {
      id: "voucher_types.Entire_order",
      defaultMessage: "Giảm giá trên tổng đơn hàng",
    },
    "voucher_types.Shipping": {
      id: "voucher_types.Shipping",
      defaultMessage: "Giảm giá trên phí giao hàng",
    },
    "voucher_types.Specific_product_variant": {
      id: "voucher_types.Specific_product_variant",
      defaultMessage: "Giảm giá cho sản phẩm",
    },
    "order_statuses.Draft": {
      id: "order_statuses.Draft",
      defaultMessage: "Bản nháp",
    },
    "order_statuses.Confirmed": {
      id: "order_statuses.Confirmed",
      defaultMessage: "Đã duyệt",
    },
    "order_statuses.Processed": {
      id: "order_statuses.Processed",
      defaultMessage: "Đang xử lý",
    },
    "order_statuses.Fulfilled": {
      id: "order_statuses.Fulfilled",
      defaultMessage: "Hoàn thành",
    },
    "order_statuses.Partial_fulfilled": {
      id: "order_statuses.Partial_fulfilled",
      defaultMessage: "Bán hoàn thành",
    },
    "order_statuses.Cancelled": {
      id: "order_statuses.Cancelled",
      defaultMessage: "Đã hủy",
    },
    "invoice_statuses.Draft": {
      id: "invoice_statuses.Draft",
      defaultMessage: "Bản nháp",
    },
    "invoice_statuses.Confirmed": {
      id: "invoice_statuses.Confirmed",
      defaultMessage: "Đã duyệt",
    },
    "invoice_statuses.Processed": {
      id: "invoice_statuses.Processed",
      defaultMessage: "Đang xử lý",
    },
    "invoice_statuses.Partial_paid": {
      id: "invoice_statuses.Partial_paid",
      defaultMessage: "Đã thanh toán một phần",
    },
    "invoice_statuses.Paid": {
      id: "invoice_statuses.Paid",
      defaultMessage: "Đã thanh toán",
    },
    "invoice_statuses.Cancelled": {
      id: "invoice_statuses.Cancelled",
      defaultMessage: "Đã hủy",
    },
    "shipping_statuses.Pending": {
      id: "shipping_statuses.Pending",
      defaultMessage: "Chờ xử lý",
    },
    "shipping_statuses.Received": {
      id: "shipping_statuses.Received",
      defaultMessage: "Đã lấy hàng",
    },
    "shipping_statuses.On delivery": {
      id: "shipping_statuses.On delivery",
      defaultMessage: "Đang vận chuyển",
    },
    "shipping_statuses.Delivered": {
      id: "shipping_statuses.Delivered",
      defaultMessage: "Đã giao hàng",
    },
    "shipping_statuses.Returned": {
      id: "shipping_statuses.Returned",
      defaultMessage: "Trả hàng",
    },
    "discount_types.Percentage": {
      id: "discount_types.Percentage",
      defaultMessage: "Giảm giá theo phần trăm",
    },
    "discount_types.Absolute": {
      id: "discount_types.Absolute",
      defaultMessage: "Giảm giá theo giá trị",
    },
    "permission_content_types.cash.paymentmethod": {
      id: "permission_content_types.cash.paymentmethod",
      defaultMessage: "Phương thức thanh toán",
    },
    "permission_content_types.cash.transactiontype": {
      id: "permission_content_types.cash.transactiontype",
      defaultMessage: "Loại giao dịch",
    },
    "permission_content_types.cash.transaction": {
      id: "permission_content_types.cash.transaction",
      defaultMessage: "Giao dịch",
    },
    "permission_content_types.cash.debtrecord": {
      id: "permission_content_types.cash.debtrecord",
      defaultMessage: "Lịch sử nợ",
    },
    "permission_content_types.site_setting.sitesettings": {
      id: "permission_content_types.site_setting.sitesettings",
      defaultMessage: "Thông tin cài đặt",
    },
    "permission_content_types.account.user": {
      id: "permission_content_types.account.user",
      defaultMessage: "Tài khoản",
    },
    "permission_content_types.shipping.shippingmethod": {
      id: "permission_content_types.shipping.shippingmethod",
      defaultMessage: "Phương thức vận chuyển",
    },
    "permission_content_types.shipping.shipper": {
      id: "permission_content_types.shipping.shipper",
      defaultMessage: "Đối tác giao hàng",
    },
    "permission_content_types.catalogue.productclass": {
      id: "permission_content_types.catalogue.productclass",
      defaultMessage: "Loại sản phẩm",
    },
    "permission_content_types.catalogue.category": {
      id: "permission_content_types.catalogue.category",
      defaultMessage: "Danh mục",
    },
    "permission_content_types.catalogue.product": {
      id: "permission_content_types.catalogue.product",
      defaultMessage: "Sản phẩm",
    },
    "permission_content_types.catalogue.attribute": {
      id: "permission_content_types.catalogue.attribute",
      defaultMessage: "Thuộc tính",
    },
    "permission_content_types.partner.partner": {
      id: "permission_content_types.partner.partner",
      defaultMessage: "Đối tác",
    },
    "permission_content_types.stock.warehouse": {
      id: "permission_content_types.stock.warehouse",
      defaultMessage: "Kho",
    },
    "permission_content_types.stock.purchaseorder": {
      id: "permission_content_types.stock.purchaseorder",
      defaultMessage: "Đơn đặt mua",
    },
    "permission_content_types.stock.receiptorder": {
      id: "permission_content_types.stock.receiptorder",
      defaultMessage: "Đơn nhập hàng",
    },
    "permission_content_types.stock.returnorder": {
      id: "permission_content_types.stock.returnorder",
      defaultMessage: "Đơn trả hàng",
    },
    "permission_content_types.stock.stockoutnote": {
      id: "permission_content_types.stock.stockoutnote",
      defaultMessage: "Đơn xuất kho",
    },
    "permission_content_types.discount.voucher": {
      id: "permission_content_types.discount.voucher",
      defaultMessage: "Voucher",
    },
    "permission_content_types.discount.sale": {
      id: "permission_content_types.discount.sale",
      defaultMessage: "Chương trình giảm giá",
    },
    "permission_content_types.order.purchasechannel": {
      id: "permission_content_types.order.purchasechannel",
      defaultMessage: "Kênh bán",
    },
    "permission_content_types.order.order": {
      id: "permission_content_types.order.order",
      defaultMessage: "Đơn hàng",
    },
    "permission_content_types.order.invoice": {
      id: "permission_content_types.order.invoice",
      defaultMessage: "Hóa đơn",
    },
    "permission_content_types.customer.customer": {
      id: "permission_content_types.customer.customer",
      defaultMessage: "Khách hàng",
    },
    "permission_content_types.customer.customertype": {
      id: "permission_content_types.customer.customertype",
      defaultMessage: "Nhóm khách hàng",
    },
  });
}
