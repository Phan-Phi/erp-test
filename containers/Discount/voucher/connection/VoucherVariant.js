import dynamic from "next/dynamic";
import { useToggle } from "react-use";
import { FormattedMessage, useIntl } from "react-intl";

import { Button, Stack, Typography } from "@mui/material";

import AddedVoucherVariant from "./AddedVoucherVariant";

import { useMutation, usePermission } from "hooks";

import { LoadingDynamic as Loading, Card } from "components";

const AddVoucherVariantDialog = dynamic(() => import("./AddVoucherVariantDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const AddVoucherCategoryDialog = dynamic(() => import("./AddVoucherCategoryDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const DiscountedVariant = () => {
  const { hasPermission: writePermission } = usePermission({
    codename: "write_voucher",
    isRedirect: false,
  });

  const [open, toggle] = useToggle(false);
  const [open2, toggle2] = useToggle(false);
  const contextValue = useMutation();
  const { messages } = useIntl();

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography>
              <FormattedMessage
                id="voucher.avaiableProductListForVoucherTitle"
                defaultMessage={"Danh sách sản phẩm giảm giá"}
              />
            </Typography>
            {writePermission && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={() => {
                    toggle2(true);
                  }}
                >
                  <FormattedMessage
                    id="voucher.addCategory"
                    defaultMessage={"Thêm danh mục"}
                  />
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    toggle(true);
                  }}
                >
                  {messages["addProduct"]}
                </Button>
              </Stack>
            )}
          </Stack>
        );
      }}
      // cardBodyComponent={() => {
      //   return (
      //     <Provider value={contextValue}>
      //       <AddedVoucherVariant />

      //       {open2 && (
      //         <AddVoucherCategoryDialog
      //           {...{
      //             open: open2,
      //             toggle: toggle2,
      //           }}
      //         />
      //       )}

      //       {open && (
      //         <AddVoucherVariantDialog
      //           {...{
      //             open,
      //             toggle,
      //           }}
      //         />
      //       )}
      //     </Provider>
      //   );
      // }}
    />
  );
};

export default DiscountedVariant;
