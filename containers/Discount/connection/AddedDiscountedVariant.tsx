import { useIntl } from "react-intl";
import { useCallback, useContext, useRef } from "react";

import { Box } from "@mui/material";

import { DiscountContext } from "./context";

import DynamicMessage from "messages";
import { DISCOUNT_DISCOUNTED_VARIANT } from "apis";
import { DISCOUNT_DISCOUNTED_VARIANT_ITEM } from "interfaces";
import { usePermission, useConfirmation, useNotification } from "hooks";
import { transformUrl, checkResArr, deleteRequest, createLoadingList } from "libs";
import { Row } from "react-table";

import get from "lodash/get";
import { PRODUCTS } from "routes";

const AddedDiscountedProduct = () => {
  const { hasPermission: writePermission } = usePermission("write_sale");
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const discountContext = useContext(DiscountContext);

  const tableInstance = useRef<any>();

  const passHandler = useCallback((_tableInstance: any) => {
    tableInstance.current = _tableInstance;

    discountContext.set({
      mutateAddedDiscountedVariant: _tableInstance.mutate,
    });
  }, []);

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(DISCOUNT_DISCOUNTED_VARIANT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "sản phẩm",
            })
          );

          tableInstance?.current?.mutate?.();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        onClose();
      }
    };

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const onGotoHandler = useCallback((data: Row<DISCOUNT_DISCOUNTED_VARIANT_ITEM>) => {
    const productId = get(data, "original.variant.product.id");

    window.open(`/${PRODUCTS}/${productId}`, "_blank");
  }, []);

  return (
    <Box></Box>
    // <CompoundTableWithFunction<DISCOUNT_DISCOUNTED_VARIANT_ITEM>
    //   url={transformUrl(DISCOUNT_DISCOUNTED_VARIANT, {
    //     nested_depth: 4,
    //     not_in_sale: true,
    //     use_cache: false,
    //   })}
    //   passHandler={passHandler}
    //   columnFn={AddedDiscountedVariantColumn}
    //   deleteHandler={deleteHandler}
    //   writePermission={writePermission}
    //   onGotoHandler={onGotoHandler}
    //   TableContainerProps={{
    //     sx: {
    //       maxHeight: 300,
    //     },
    //   }}
    //   renderHeaderContentForSelectedRow={(tableInstance) => {
    //     const selectedRows = tableInstance.selectedFlatRows;

    //     return (
    //       <Stack flexDirection="row" columnGap={3} alignItems="center">
    //         <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
    //           length: selectedRows.length,
    //         })}`}</Typography>

    //         <LoadingButton
    //           onClick={() => {
    //             deleteHandler({
    //               data: selectedRows,
    //             });
    //           }}
    //           color="error"
    //           children={messages["deleteStatus"] as string}
    //         />
    //       </Stack>
    //     );
    //   }}
    // />
  );
};

export default AddedDiscountedProduct;
