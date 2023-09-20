import { defineMessages } from "react-intl";

export function TranslateCustomer() {
  defineMessages({
    createDiscount: {
      id: "createDiscount",
      defaultMessage: "Tạo chương trình khuyến mại",
    },
    updateDiscount: {
      id: "updateDiscount",
      defaultMessage: "Cập nhật chương trình khuyến mại",
    },
    discountName: {
      id: "discountName",
      defaultMessage: "Tên chương trình khuyến mại",
    },
    discountType: {
      id: "discountType",
      defaultMessage: "Loại khuyến mại",
    },
    discountAmount: {
      id: "discountAmount",
      defaultMessage: "Lượng giảm",
    },
    listingDiscount: {
      id: "listingDiscount",
      defaultMessage: "Danh sách khuyến mại",
    },
    addCategory: {
      id: "addCategory",
      defaultMessage: "Thêm danh mục",
    },
    listingDiscountProduct: {
      id: "listingDiscountProduct",
      defaultMessage: "Danh sách sản phẩm giảm giá",
    },
  });
}
