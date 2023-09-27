import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useContext, useRef } from "react";

import { Stack } from "@mui/material";

import get from "lodash/get";

import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { DiscountContext } from "./context";
import { PRODUCT_VARIANT_ITEM } from "interfaces";
import { useNotification, useParams } from "hooks";
import { transformUrl, checkResArr, createRequest } from "libs";
import { PRODUCT_VARIANT, DISCOUNT_DISCOUNTED_VARIANT } from "apis";
import { LoadingButton, Dialog, BackButton, SearchField } from "components";
import AddDiscountedVariantColumn from "../column/AddDiscountedVariantColumn";

interface AddDiscountedProductDialogProps {
  open: boolean;
  toggle: (newValue?: boolean) => void;
}

const AddDiscountedProductDialog = ({
  open,
  toggle,
}: AddDiscountedProductDialogProps) => {
  const router = useRouter();
  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const discountContext = useContext(DiscountContext);

  const tableInstance = useRef<any>();

  const [, setParams] = useParams({
    initState: {
      not_in_sale: router.query.id,
      use_cache: false,
      is_discounted: false,
      nested_depth: 3,
    },
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;

        setUrl(transformUrl(PRODUCT_VARIANT, params));
      }
    },
    isUpdateRouter: false,
  });

  const addHandler = useCallback(
    async ({ data }: { data: Row<PRODUCT_VARIANT_ITEM>[] }) => {
      let bodyList: any[] = [];

      data.forEach((el) => {
        bodyList.push({
          variant: el.original.id,
          sale: router.query.id,
        });
      });

      setLoading(true);

      try {
        const results = await createRequest(DISCOUNT_DISCOUNTED_VARIANT, bodyList);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.addSuccessfully, {
              content: "sản phẩm",
            })
          );

          tableInstance?.current?.mutate?.();

          discountContext.state.mutateAddedDiscountedVariant();

          toggle(false);
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [discountContext]
  );

  const passHandler = useCallback((_tableInstance: any) => {
    tableInstance.current = _tableInstance;

    discountContext.set({
      mutateAddDiscountedVariant: _tableInstance.mutate,
    });
  }, []);

  const onFilterHandler = useCallback((key) => {
    return (value: any) => {
      if (tableInstance.current) {
        const { pageSize } = tableInstance.current.state;

        setParams({
          page_size: pageSize,
          page: 1,
          [key]: value,
        });
      }
    };
  }, []);

  const onGotoHandler = useCallback((data: Row<PRODUCT_VARIANT_ITEM>) => {
    const productId = get(data, "original.product.id");

    window.open(`/${PRODUCTS}/${productId}`, "_blank");
  }, []);

  return (
    <Dialog
      {...{
        open,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "50vw",
              maxWidth: "50vw",
            },
          },
        },

        onClose: () => {
          if (loading) return;

          toggle(false);
        },
        DialogTitleProps: {
          children: messages["addProduct"],
        },
        dialogContentTextComponent: () => {
          return (
            <Stack spacing={2}>
              <SearchField onChange={onFilterHandler("search")} />

              {/* <CompoundTableWithFunction<PRODUCT_VARIANT_ITEM>
                url={transformUrl(PRODUCT_VARIANT, {
                  not_in_sale: router.query.id,
                  use_cache: false,
                  is_discounted: false,
                  nested_depth: 3,
                })}
                passHandler={passHandler}
                columnFn={AddDiscountedVariantColumn}
                onGotoHandler={onGotoHandler}
                TableContainerProps={{
                  sx: {
                    maxHeight: 250,
                  },
                }}
              /> */}
            </Stack>
          );
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" justifyContent="flex-end" columnGap={2}>
              <BackButton
                disabled={loading}
                onClick={() => {
                  toggle(false);
                }}
              />

              <LoadingButton
                disabled={loading}
                loading={loading}
                onClick={() => {
                  if (tableInstance.current) {
                    addHandler({ data: tableInstance.current.selectedFlatRows });
                  }
                }}
              >
                {loading ? messages["addingStatus"] : messages["addStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
};

export default AddDiscountedProductDialog;
