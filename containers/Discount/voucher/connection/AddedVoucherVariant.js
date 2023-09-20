import axios from "axios";
import queryString from "query-string";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useToggle } from "react-use";
import { useSnackbar } from "notistack";
import { useCallback, useState, useMemo, useContext, useEffect } from "react";

import chunk from "lodash/chunk";

import { checkResArr, createNotistackMessage } from "libs/utils";

import columnFn, { keys } from "../../column/AddedVoucherVariantColumn";

import { Context as VoucherVariantContext } from "./VoucherVariant";

import { usePermission, useParams } from "hooks";
import { HighOrderTable } from "components";
import DynamicMessage from "message";

const URL = process.env.NEXT_PUBLIC_DISCOUNT_VOUCHER_VARIANT_URL;

const AddedDiscountedProduct = () => {
  const { hasPermission: writePermission } = usePermission("write_voucher");

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteLoading, setDeleteLoading] = useState({});
  const router = useRouter();
  const voucherVariantContext = useContext(VoucherVariantContext);
  const [open, toggle] = useToggle(false);
  const [url, setUrl] = useState(URL);
  const [mutationObj, setMutationObj] = useState({
    state: {},
  });

  const [params, setParams] = useParams({
    initState: {
      nested_depth: 4,
      voucher: router.query.id,
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
        voucher: router.query.id,
      });
    }
  }, [router.query.id]);

  const deleteHandler = useCallback(
    ({ data }) => {
      return async () => {
        let trueLoadingList = {};
        let falseLoadingList = {};
        let itemList = [];

        data.forEach((el) => {
          falseLoadingList[el.original.id] = false;
          trueLoadingList[el.original.id] = true;
          itemList.push({
            id: el.original.id,
          });
        });

        setDeleteLoading((prev) => {
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
                return axios.delete(`${URL}?id=${el.id}`);
              })
            );
            resList = [...resList, ...temp];
          }

          const result = checkResArr(resList, enqueueSnackbar);

          if (result) {
            enqueueSnackbar(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "sản phẩm",
              }),
              {
                variant: "success",
              }
            );

            mutationObj.mutate();
          }
        } catch (err) {
          createNotistackMessage(err.message, enqueueSnackbar);
        } finally {
          setDeleteLoading((prev) => {
            return {
              ...prev,
              ...falseLoadingList,
              all: false,
            };
          });
        }
      };
    },
    [mutationObj]
  );

  const passHandler = useCallback(({ page, pageSize, mutate }) => {
    if (page && pageSize && mutate) {
      setParams({
        page,
        page_size: pageSize,
      });

      voucherVariantContext.set({
        mutateAddedVoucherVariant: mutate,
      });

      if (mutate) {
        setMutationObj((prev) => {
          return {
            ...prev,
            mutate,
          };
        });
      }
    }
  }, []);

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
          deleteHandler,
          deleteLoading,
          writePermission,
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

  return children;
};

export default AddedDiscountedProduct;
