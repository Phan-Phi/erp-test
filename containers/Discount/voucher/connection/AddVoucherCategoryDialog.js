import axios from "axios";
import queryString from "query-string";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { useState, useCallback, useMemo, useContext } from "react";

import chunk from "lodash/chunk";

import { Grid, Stack } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { checkResArr, createNotistackMessage } from "libs/utils";

import columnFn, { keys } from "../../column/AddVoucherCategoryColumn";

import { Context as VoucherVariantContext } from "./VoucherVariant";

import { HighOrderTable, LoadingButton, Dialog, BackButton } from "components";
import DynamicMessage from "message";

import { useParams, usePassHandler } from "hooks";

const URL = process.env.NEXT_PUBLIC_PRODUCT_CATEGORY_URL;
const DISCOUNT_VOUCHER_VARIANT_URL = process.env.NEXT_PUBLIC_DISCOUNT_VOUCHER_VARIANT_URL;

const AddDiscountedCategoryDialog = ({ open, toggle }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [addLoading, setAddLoading] = useState({});

  const router = useRouter();
  const voucherVariantContext = useContext(VoucherVariantContext);
  const { formatMessage, messages } = useIntl();
  const [url, setUrl] = useState(URL);
  const [mutationObj, setMutationObj] = useState({
    state: {},
  });

  const [params, setParams] = useParams({
    initState: {
      nested_depth: 1,
      is_leaf: true,
      use_cache: false,
    },
    callback: (params) => {
      setUrl(`${URL}?${queryString.stringify(params)}`);
    },
    isUpdateRouter: false,
  });

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
          category: el.original.id,
          voucher: id,
          variant: null,
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
              content: "danh mục",
            }),
            {
              variant: "success",
            }
          );
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
    [voucherVariantContext, mutationObj]
  );

  const children = useMemo(() => {
    return (
      <HighOrderTable
        {...{
          keys,
          columnFn,
          url,
          useDefaultDeleteHandler: false,
          mutationObj,
          setMutationObj,
          passHandler,
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
        PaperProps: {
          sx: {
            maxWidth: "50vw",
          },
        },
        onClose: () => {
          toggle(false);
        },
        DialogTitleProps: {
          children: (
            <FormattedMessage
              id="discount.addCategory"
              defaultMessage={"Thêm danh mục"}
            />
          ),
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

export default AddDiscountedCategoryDialog;
