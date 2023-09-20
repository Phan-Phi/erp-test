import { defineMessages } from "react-intl";

import { TransalteChoice } from "./choice";
import { TranslateTable } from "./table";
import { TranslateFilter } from "./filter";

TransalteChoice();
TranslateTable();
TranslateFilter();

function Component() {
  // ERROR MESSAGE

  defineMessages({
    "message.error.catchError": {
      id: "message.error.catchError",
      defaultMessage: "Có lỗi xảy ra vui lòng kiểm tra lại",
    },
    "message.error.common": {
      id: "message.error.common",
      defaultMessage: "Có lỗi xảy ra",
    },
    "customer.step1": {
      id: "customer.step1",
      defaultMessage: "Thông tin khách hàng",
    },
    "customer.step2": {
      id: "customer.step2",
      defaultMessage: "Địa chỉ khách hàng",
    },
    "user.step1": {
      id: "user.step1",
      defaultMessage: "Thông tin người dùng",
    },
    "user.step2": {
      id: "user.step2",
      defaultMessage: "Địa chỉ người dùng",
    },
    "boolean.true": {
      id: "boolean.true",
      defaultMessage: "Có",
    },
    "boolean.false": {
      id: "boolean.false",
      defaultMessage: "Không",
    },
    none: {
      id: "none",
      defaultMessage: "-",
    },
    avatar: {
      id: "avatar",
      defaultMessage: "Ảnh đại diện",
    },
    createStatus: {
      id: "createStatus",
      defaultMessage: "Tạo",
    },
    creatingStatus: {
      id: "creatingStatus",
      defaultMessage: "Đang tạo",
    },
    updateStatus: {
      id: "updateStatus",
      defaultMessage: "Cập nhật",
    },
    updatingStatus: {
      id: "updatingStatus",
      defaultMessage: "Đang cập nhật",
    },
    deleteStatus: {
      id: "deleteStatus",
      defaultMessage: "Xóa",
    },
    deletingStatus: {
      id: "deletingStatus",
      defaultMessage: "Đang xóa",
    },
    addStatus: {
      id: "addStatus",
      defaultMessage: "Thêm",
    },
    addingStatus: {
      id: "addingStatus",
      defaultMessage: "Đang thêm",
    },
    connectStatus: {
      id: "connectStatus",
      defaultMessage: "Liên kết",
    },
    connectingStatus: {
      id: "connectingStatus",
      defaultMessage: "Đang liên kết",
    },
    connectStatus: {
      id: "connectStatus",
      defaultMessage: "Liên kết",
    },
    connectingStatus: {
      id: "connectingStatus",
      defaultMessage: "Đang liên kết",
    },
    approveStatus: {
      id: "approveStatus",
      defaultMessage: "Duyệt",
    },
    approvingStatus: {
      id: "approvingStatus",
      defaultMessage: "Đang duyệt",
    },
    backButton: {
      id: "backButton",
      defaultMessage: "Quay lại",
    },
    completeButton: {
      id: "completeButton",
      defaultMessage: "Hoàn Thành",
    },
    continueButton: {
      id: "continueButton",
      defaultMessage: "Tiếp tục",
    },
    resetButton: {
      id: "resetButton",
      defaultMessage: "Reset",
    },
    invoice_qr_code: {
      id: "invoice_qr_code",
      defaultMessage: "QR Code trên phiếu in hóa đơn",
    },
    logo: {
      id: "logo",
      defaultMessage: "Logo Công Ty",
    },
    password: {
      id: "password",
      defaultMessage: "Mật khẩu",
    },
    controlPanel: {
      id: "controlPanel",
      defaultMessage: "Bảng điều khiển",
    },
    createNewButton: {
      id: "createNewButton",
      defaultMessage: "Tạo mới",
    },
    viewDetail: {
      id: "viewDetail",
      defaultMessage: "Xem chi tiết",
    },
    addNewAddress: {
      id: "addNewAddress",
      defaultMessage: "Thêm địa chỉ mới",
    },
    updateAddress: {
      id: "updateAddress",
      defaultMessage: "Cập nhật địa chỉ",
    },
    approved: {
      id: "approved",
      defaultMessage: "Đã duyệt",
    },
    noApprove: {
      id: "noApprove",
      defaultMessage: "Chưa duyệt",
    },
    phoneNumber: {
      id: "phoneNumber",
      defaultMessage: "Số điện thoại",
    },
    defaultShippingAddress: {
      id: "defaultShippingAddress",
      defaultMessage: "Địa chỉ giao hàng mặc định",
    },
    defaultBillingAddress: {
      id: "defaultBillingAddress",
      defaultMessage: "Địa chỉ thanh toán mặc định",
    },
    lastName: {
      id: "lastName",
      defaultMessage: "Họ",
    },
    firstName: {
      id: "firstName",
      defaultMessage: "Tên",
    },
    birthday: {
      id: "birthday",
      defaultMessage: "Ngày sinh nhật",
    },
    gender: {
      id: "gender",
      defaultMessage: "Giới tính",
    },
    email: {
      id: "email",
      defaultMessage: "Email",
    },
    companyName: {
      id: "companyName",
      defaultMessage: "Tên công ty",
    },
    taxIdentificationNumber: {
      id: "taxIdentificationNumber",
      defaultMessage: "Mã số thuế",
    },
    facebook: {
      id: "facebook",
      defaultMessage: "Facebook",
    },
    maxDebt: {
      id: "maxDebt",
      defaultMessage: "Nợ tối đa",
    },
    refuse: {
      id: "refuse",
      defaultMessage: "Từ chối",
    },
    approve: {
      id: "approve",
      defaultMessage: "Duyệt",
    },
    true: {
      id: "true",
      defaultMessage: "Có",
    },
    false: {
      id: "false",
      defaultMessage: "Không",
    },
    dateStart: {
      id: "dateStart",
      defaultMessage: "Ngày bắt đầu",
    },
    dateEnd: {
      id: "dateEnd",
      defaultMessage: "Ngày kết thúc",
    },
    shippingCharge: {
      id: "shippingCharge",
      defaultMessage: "Phí giao hàng",
    },
    createOrder: {
      id: "createOrder",
      defaultMessage: "Tạo đơn hàng",
    },
    cancelOrder: {
      id: "cancelOrder",
      defaultMessage: "Hủy đơn hàng",
    },
    cancelInvoice: {
      id: "cancelInvoice",
      defaultMessage: "Hủy hóa đơn",
    },
    processOrder: {
      id: "processOrder",
      defaultMessage: "Xử lý đơn hàng",
    },
    shippingAddress: {
      id: "shippingAddress",
      defaultMessage: "Địa chỉ giao hàng",
    },
    billingAddress: {
      id: "billingAddress",
      defaultMessage: "Địa chỉ thanh toán",
    },
    confirmOrder: {
      id: "confirmOrder",
      defaultMessage: "Xác nhận đơn hàng",
    },
    noOption: {
      id: "noOption",
      defaultMessage: "Chưa chọn",
    },
    processStatus: {
      id: "processStatus",
      defaultMessage: "Xử lý",
    },
    datePlaced: {
      id: "datePlaced",
      defaultMessage: "Ngày tạo",
    },
    dateCreated: {
      id: "dateCreated",
      defaultMessage: "Ngày tạo",
    },
    price: {
      id: "price",
      defaultMessage: "Giá",
    },
    priceInclTax: {
      id: "priceInclTax",
      defaultMessage: "Giá có thuế",
    },
    printNote: {
      id: "printNote",
      defaultMessage: "In phiếu",
    },
    status: {
      id: "status",
      defaultMessage: "Trạng thái",
    },
    noteCreator: {
      id: "noteCreator",
      defaultMessage: "Người tạo phiếu",
    },
    login: {
      id: "login",
      defaultMessage: "Đăng nhập",
    },
    loggingIn: {
      id: "loggingIn",
      defaultMessage: "Đang đăng nhập",
    },
    loginSuccessfully: {
      id: "loginSuccessfully",
      defaultMessage: "Đăng nhập thành công",
    },
    totalPrice: {
      id: "totalPrice",
      defaultMessage: "Tổng giá trị",
    },
    surcharge: {
      id: "surcharge",
      defaultMessage: "Phụ phí",
    },
    storeName: {
      id: "storeName",
      defaultMessage: "Tên cửa hàng",
    },
    website: {
      id: "website",
      defaultMessage: "Website",
    },
    storeDescription: {
      id: "storeDescription",
      defaultMessage: "Mô tả cửa hàng",
    },
    hotline1: {
      id: "hotline1",
      defaultMessage: "Hotline 1",
    },
    hotline2: {
      id: "hotline2",
      defaultMessage: "Hotline 2",
    },
    currency: {
      id: "currency",
      defaultMessage: "Đơn vị tiền",
    },
    invoiceNote: {
      id: "invoiceNote",
      defaultMessage: "Ghi chú trên hóa đơn",
    },
    "message.error.fileInvalidType": {
      id: "message.error.fileInvalidType",
      defaultMessage: "Vui lòng chọn đúng định dạng file",
    },
    "message.error.fileToLarge": {
      id: "message.error.fileToLarge",
      defaultMessage: "Dung lượng file  quá lớn",
    },
    "customer.step1": {
      id: "customer.create.step1",
      defaultMessage: "Thông tin khách hàng",
    },
    "customer.step2": {
      id: "customer.create.step2",
      defaultMessage: "Địa chỉ khách hàng",
    },
    "user.create.step1": {
      id: "user.create.step1",
      defaultMessage: "Thông tin người dùng",
    },
    "user.create.step2": {
      id: "user.create.step2",
      defaultMessage: "Địa chỉ người dùng",
    },
    confirm: {
      id: "confirm",
      defaultMessage: "Xác nhận",
    },
    confirmDeleteContent: {
      id: "confirmDeleteContent",
      defaultMessage: "Bạn có chắc muốn xóa không?",
    },
    cancel: {
      id: "cancel",
      defaultMessage: "Hủy",
    },
    filter: {
      id: "filter",
      defaultMessage: "Lọc",
    },
    print: {
      id: "print",
      defaultMessage: "In",
    },
    noData: {
      id: "noData",
      defaultMessage: "Không có dữ liệu",
    },
    rowsPerPage: {
      id: "rowsPerPage",
      defaultMessage: "Số dòng mỗi trang",
    },
    district: {
      id: "district",
      defaultMessage: "Quận / Huyện",
    },
    province: {
      id: "province",
      defaultMessage: "Tỉnh / Thành",
    },
    ward: {
      id: "ward",
      defaultMessage: "Phường / Xã",
    },
    printError: {
      id: "printError",
      defaultMessage: "Có lỗi xảy ra trong lúc in. Vui lòng thử lại",
    },
    previewNote: {
      id: "previewNote",
      defaultMessage: "Xem trước mẫu hóa đơn",
    },
    addProduct: {
      id: "addProduct",
      defaultMessage: "Thêm sản phẩm",
    },
    address: {
      id: "address",
      defaultMessage: "Địa chỉ",
    },
    note: {
      id: "note",
      defaultMessage: "Ghi chú",
    },
    upload: {
      id: "upload",
      defaultMessage: "Tải hình ảnh",
    },
    payment: {
      id: "payment",
      defaultMessage: "Thanh toán",
    },
    "error.required": {
      id: "error.required",
      defaultMessage: "Trường này được yêu cầu",
    },
    yes: {
      id: "yes",
      defaultMessage: "Đồng ý",
    },
    info: {
      id: "info",
      defaultMessage: "Thông tin",
    },
    saleHistory: {
      id: "saleHistory",
      defaultMessage: "Lịch sử bán hàng",
    },
    recoverPublicDebt: {
      id: "recoverPublicDebt",
      defaultMessage: "Nợ cần thu",
    },
    refuseButton: {
      id: "refuseButton",
      defaultMessage: "Từ chối",
    },
    approveButton: {
      id: "approveButton",
      defaultMessage: "Duyệt",
    },
    manipulation: {
      id: "manipulation",
      defaultMessage: "Thao tác",
    },
    purchaseOrderHistory: {
      id: "purchaseOrderHistory",
      defaultMessage: "Lịch sử đặt hàng",
    },
    receiptOrderHistory: {
      id: "receiptOrderHistory",
      defaultMessage: "Lịch sử nhập hàng",
    },
    returnOrderHistory: {
      id: "returnOrderHistory",
      defaultMessage: "Lịch sử trả hàng",
    },
    payBackSupplier: {
      id: "payBackSupplier",
      defaultMessage: "Nợ cần trả NCC",
    },
    monday: {
      id: "monday",
      defaultMessage: "Thứ hai",
    },
    tuesday: {
      id: "tuesday",
      defaultMessage: "Thứ ba",
    },
    wednesday: {
      id: "wednesday",
      defaultMessage: "Thứ tư",
    },
    thursday: {
      id: "thursday",
      defaultMessage: "Thứ năm",
    },
    friday: {
      id: "friday",
      defaultMessage: "Thứ sáu",
    },
    saturday: {
      id: "saturday",
      defaultMessage: "Thứ bảy",
    },
    sunday: {
      id: "sunday",
      defaultMessage: "Chủ nhật",
    },
    revenue: {
      id: "revenue",
      defaultMessage: "Doanh thu",
    },
    netRevenue: {
      id: "netRevenue",
      defaultMessage: "Doanh thu thuần",
    },
    profit: {
      id: "profit",
      defaultMessage: "Lợi nhuận",
    },
    baseAmount: {
      id: "baseAmount",
      defaultMessage: "Giá vốn",
    },
    quantity: {
      id: "quantity",
      defaultMessage: "Số lượng",
    },
    listingImportProduct: {
      id: "listingImportProduct",
      defaultMessage: "Danh sách sản phẩm nhập kho",
    },
    confirmCancelORder: {
      id: "confirmCancelOrder",
      defaultMessage: "Xác nhận hủy đơn đặt hàng",
    },
    report: {
      id: "report",
      defaultMessage: "Báo cáo",
    },
    saleReport: {
      id: "saleReport",
      defaultMessage: "Báo cáo bán hàng",
    },
    productReport: {
      id: "productReport",
      defaultMessage: "Báo cáo sản phẩm",
    },
    customerReport: {
      id: "customerReport",
      defaultMessage: "Báo cáo khách hàng",
    },
    partnerReport: {
      id: "partnerReport",
      defaultMessage: "Báo cáo nhà cung cấp",
    },
    staffReport: {
      id: "staffReport",
      defaultMessage: "Báo cáo nhân viên",
    },
    financeReport: {
      id: "financeReport",
      defaultMessage: "Báo cáo tài chính",
    },
    debtAmount: {
      id: "debtAmount",
      defaultMessage: "Nợ",
    },
    receiptAmount: {
      id: "receiptAmount",
      defaultMessage: "Giá trị nhập hàng",
    },
    ros: {
      id: "ros",
      defaultMessage: "Tỷ suất",
    },
  });

  return defineMessages({
    createSuccessfully: {
      id: "createSuccessfully",
      defaultMessage: "Tạo {content} mới thành công",
    },
    updateSuccessfully: {
      id: "updateSuccessfully",
      defaultMessage: "Cập nhật {content} thành công",
    },
    deleteSuccessfully: {
      id: "deleteSuccessfully",
      defaultMessage: "Xóa {content} thành công",
    },
    approveSuccessfully: {
      id: "approveSuccessfully",
      defaultMessage: "Duyệt {content} thành công",
    },
    addSuccessfully: {
      id: "addSuccessfully",
      defaultMessage: "Thêm {content} thành công",
    },
    refuseSuccessfully: {
      id: "refuseSuccessfully",
      defaultMessage: "Từ chối {content} thành công",
    },
    cancelSuccessfully: {
      id: "cancelSuccessfully",
      defaultMessage: "Hủy {content} thành công",
    },
    selectedRow: {
      id: "selectedRow",
      defaultMessage: "Số dòng được chọn: {length}",
    },
  });
}

export default Component();
