import { useIntl } from "react-intl";
import Sticky from "react-stickynode";
import { useToggle } from "react-use";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { useMemo, useCallback, useState } from "react";

import { Grid } from "@mui/material";

import { PRODUCTS, ATTRIBUTE, CREATE, EDIT } from "routes";
import columnFn, { keys } from "./AttributeColumn";
import { PRODUCT_ATTRIBUTE } from "apis";

import { transformUrl, deleteRequest, createLoadingList, checkResArr } from "libs";

import {
  useParams,
  usePassHandler,
  usePermission,
  useSticky,
  useConfirmation,
} from "hooks";
import { HighOrderTable } from "components";
import DynamicMessage from "messages";

const AttributeList = () => {
  const { hasPermission: writePermission } = usePermission("write_attribute");
  const { height, offsetTop } = useSticky();
  const router = useRouter();
  const [url, setUrl] = useState(PRODUCT_ATTRIBUTE);
  const [open, toggle] = useToggle(false);
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage, messages } = useIntl();
  const [deleteLoading, setDeleteLoading] = useState({});

  const { openConfirmHandler } = useConfirmation();

  const [, setParams] = useParams({
    callback: (params) => {
      setUrl(transformUrl(PRODUCT_ATTRIBUTE, params));
    },
    isUpdateRouter: false,
  });

  const [mutationObj, setMutationObj] = useState({
    state: {},
  });
  const passHandler = usePassHandler({
    setMutate: setMutationObj,
    setParams,
  });

  const deleteHandler = useCallback(
    ({ data }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.is_used === false;
        });

        const { falseLoadingList, trueLoadingList, list } =
          createLoadingList(filteredData);

        setDeleteLoading((prev) => {
          return {
            ...prev,
            ...trueLoadingList,
            all: true,
          };
        });

        try {
          const results = await deleteRequest(PRODUCT_ATTRIBUTE, list);
          const result = checkResArr(results, enqueueSnackbar);

          if (result) {
            enqueueSnackbar(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "thuộc tính",
              }),
              {
                variant: "success",
              }
            );

            mutationObj.mutate();
          }
        } catch (err) {
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

      openConfirmHandler(undefined, handler);
    },
    [mutationObj]
  );

  const children = useMemo(() => {
    return (
      <Sticky top={offsetTop}>
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
                maxHeight: height - 50,
              },
            },
            TableBodyProps: {
              TableRowProps: {
                onClick: (e, row) => {
                  e.stopPropagation();
                  const pathname = `/${PRODUCTS}/${ATTRIBUTE}/${EDIT}/${row.original.id}`;
                  router.push(pathname, pathname, {
                    shallow: true,
                  });
                },
              },
            },
            TableTitleProps: {
              TitleProps: {
                children: messages["listingProductAttribute"],
              },
              pathname: `/${PRODUCTS}/${ATTRIBUTE}/${CREATE}`,
              writePermission,
            },
            columnFilterComponent: () => {
              return null;
            },
          }}
        />
      </Sticky>
    );
  });

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={8}>
        {children}
      </Grid>
    </Grid>
  );
};

export default AttributeList;
