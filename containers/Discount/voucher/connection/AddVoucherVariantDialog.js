import axios from "axios";
import queryString from "query-string";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState, useCallback, useMemo, useContext, useEffect } from "react";

import chunk from "lodash/chunk";

import { Grid, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { checkResArr, createNotistackMessage } from "libs/utils";

import columnFn, { keys } from "../../column/AddVoucherVariantColumn";

import { Context as VoucherVariantContext } from "./VoucherVariant";

import { HighOrderTable, LoadingButton, Dialog, BackButton } from "components";
import DynamicMessage from "message";

import { useParams, usePassHandler } from "hooks";

const URL = process.env.NEXT_PUBLIC_PRODUCT_VARIANT_URL;
const DISCOUNT_VOUCHER_VARIANT_URL = process.env.NEXT_PUBLIC_DISCOUNT_VOUCHER_VARIANT_URL;

const AddDiscountedProductDialog = ({ open, toggle }) => {
  const { formatMessage, messages } = useIntl();

  const { enqueueSnackbar } = useSnackbar();
  const [addLoading, setAddLoading] = useState({});
  const router = useRouter();
  const voucherVariantContext = useContext(VoucherVariantContext);
  const [url, setUrl] = useState(URL);

  const [mutationObj, setMutationObj] = useState({
    state: {},
  });

  const [params, setParams] = useParams({
    initState: {
      nested_depth: 1,
      not_in_voucher: router.query.id,
      use_cache: false,
    },
    callback: (params) => {
      setUrl(`${URL}?${queryString.stringify(params)}`);
    },
    isUpdateRouter: false,
  });

  useEffect(() => {
    if (router.query.id) {
      setParams({
        not_in_voucher: router.query.id,
      });
    }
  }, [router.query.id]);

  useEffect(() => {
    if (router.query.id) {
      setParams({
        not_in_voucher: router.query.id,
      });
    }
  }, [router.query.id]);

  const passHandler = usePassHandler({
    setMutate: setMutationObj,
    setParams,
  });

  const addHandler = useCallback(
    async (data, id) => {
      let trueLoadingList = {};
      let falseLoadingList = {};
      let itemList = [];

      data.forEach((el) => {
        falseLoadingList[el.original.id] = false;
        trueLoadingList[el.original.id] = true;
        itemList.push({
          variant: el.original.id,
          voucher: id,
        });
      });

      setAddLoading((prev) => {
        return {
          ...prev,
          ...trueLoadingList,
          all: true,
        };
      });

      try {
        let resList = [];

        let chunkItemList = chunk(itemList, 5);

        for await (let list of chunkItemList) {
          const temp = await Promise.all(
            list.map((el) => {
              return axios.post(DISCOUNT_VOUCHER_VARIANT_URL, el);
            })
          );

          resList = [...resList, ...temp];
        }

        const result = checkResArr(resList, enqueueSnackbar);

        if (result) {
          enqueueSnackbar(
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "sản phẩm",
            }),
            {
              variant: "success",
            }
          );
          mutationObj.mutate();
          voucherVariantContext.state.mutateAddedVoucherVariant();
        }
      } catch (err) {
        createNotistackMessage(err.message, enqueueSnackbar);
      } finally {
        setAddLoading((prev) => {
          return {
            ...prev,
            ...falseLoadingList,
            all: false,
          };
        });
      }
    },
    [mutationObj]
  );

  const children = useMemo(() => {
    return (
      <HighOrderTable
        {...{
          keys,
          columnFn,
          url,
          open,
          toggle,
          mutationObj,
          setMutationObj,
          passHandler,
          useSearch: true,
          useDefaultDeleteHandler: false,
          TableContainerProps: {
            sx: {
              maxHeight: 300,
            },
          },

          TableBodyProps: {
            TableRowProps: {
              sx: {
                "&:hover": {
                  cursor: "unset",
                  backgroundColor: "action.hover",
                },
              },
            },
          },
          columnFilterComponent: () => {
            return null;
          },
        }}
      />
    );
  });

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
          toggle(false);
        },
        DialogTitleProps: {
          children: messages["addProduct"],
        },
        dialogContentTextComponent: () => {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {children}
              </Grid>
            </Grid>
          );
        },
        DialogActionsProps: {
          children: (
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <BackButton
                onClick={() => {
                  toggle(false);
                }}
              />

              <LoadingButton
                Icon={AddIcon}
                disabled={!mutationObj?.selectedFlatRows?.length || !!addLoading["all"]}
                loading={!!addLoading["all"]}
                onClick={() => {
                  addHandler(mutationObj.selectedFlatRows, router.query.id);
                }}
              >
                {addLoading["all"] ? messages["addingStatus"] : messages["addStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
};

export default AddDiscountedProductDialog;
