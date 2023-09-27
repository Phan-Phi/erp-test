import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useContext, useRef } from "react";

import { Stack } from "@mui/material";

import { LoadingButton, Dialog, BackButton, SearchField } from "components";
import { PRODUCT_CATEGORY, DISCOUNT_DISCOUNTED_VARIANT } from "apis";
import { DiscountContext } from "./context";
import { checkResArr, transformUrl, createRequest } from "libs";
import AddDiscountedCategoryColumn from "../column/AddDiscountedCategoryColumn";
import { useNotification, useParams } from "hooks";
import DynamicMessage from "messages";

import { PRODUCT_CATEGORY_ITEM } from "interfaces";

const AddDiscountedCategoryDialog = ({ open, toggle }) => {
  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const discountContext = useContext(DiscountContext);

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const tableInstance = useRef<any>();

  const [, setParams] = useParams({
    initState: {
      nested_depth: 1,
      is_leaf: true,
      use_cache: false,
    },
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;

        setUrl(transformUrl(PRODUCT_CATEGORY, params));
      }
    },
    isUpdateRouter: false,
  });

  const passHandler = useCallback((_tableInstance: any) => {
    tableInstance.current = _tableInstance;
  }, []);
  const addHandler = useCallback(
    async ({ data }: { data: Row<PRODUCT_CATEGORY_ITEM>[] }) => {
      let bodyList: any[] = [];

      setLoading(true);

      data.forEach((el) => {
        const id = el.original.id;

        bodyList.push({
          category: id,
          variant: null,
          sale: router.query.id,
        });
      });

      try {
        const results = await createRequest(DISCOUNT_DISCOUNTED_VARIANT, bodyList);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.addSuccessfully, {
              content: "danh mục",
            })
          );

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

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          if (loading) {
            return;
          }
          toggle(false);
        },
        DialogProps: {
          PaperProps: {
            sx: {
              width: "50vw",
              maxWidth: "50vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["addCategory"],
        },
        dialogContentTextComponent: () => {
          return (
            <Stack spacing={2}>
              <SearchField onChange={onFilterHandler("search")} />

              {/* <CompoundTableWithFunction<PRODUCT_CATEGORY_ITEM>
                url={transformUrl(PRODUCT_CATEGORY, {
                  nested_depth: 1,
                  is_leaf: true,
                  use_cache: false,
                })}
                passHandler={passHandler}
                columnFn={AddDiscountedCategoryColumn}
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
                onClick={() => {
                  toggle(false);
                }}
                disabled={loading}
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

export default AddDiscountedCategoryDialog;
