import axios from "axios";
import Sticky from "react-stickynode";
import { useState, useMemo, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useToggle } from "react-use";
import { useRouter } from "next/router";
import { FormattedMessage, useIntl } from "react-intl";

import { Grid, Box } from "@mui/material";

import chunk from "lodash/chunk";

import { checkResArr, createNotistackMessage } from "libs/utils";

import columnFn, { keys } from "../column/VoucherColumn";

import { VOUCHERS, CREATE, EDIT } from "routes";

import Filter from "./Filter";

import { GridContainer, LoadingDynamic as Loading, HighOrderTable } from "components";

import { usePermission, useSticky, useParams, usePassHandler } from "hooks";
import DynamicMessage from "message";

const URL = process.env.NEXT_PUBLIC_DISCOUNT_VOUCHER_URL;

const DiscountList = () => {
  const { hasPermission: writePermission } = usePermission("write_voucher");

  const { formatMessage } = useIntl();

  const { offsetTop, height } = useSticky();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteLoading, setDeleteLoading] = useState({});
  const [open, toggle] = useToggle(false);
  const router = useRouter();

  const [url, setUrl] = useState(URL);

  const [params, setParams, isReady, resetParams] = useParams({
    callback: (params) => {
      setUrl(`${URL}?${queryString.stringify(params)}`);
    },
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
      return async () => {
        let trueLoadingList = {};
        let falseLoadingList = {};
        let idList = [];

        data.forEach((el) => {
          falseLoadingList[el.original.id] = false;
          trueLoadingList[el.original.id] = true;
          idList.push(el.original.id);
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
          let chunkIdList = chunk(idList, 5);

          for await (const list of chunkIdList) {
            const temp = await Promise.all(
              list.map((el) => {
                return axios.delete(`${URL}?id=${el}`);
              })
            );

            resList = [...resList, ...temp];
          }
          const result = checkResArr(resList, enqueueSnackbar);

          if (result) {
            mutationObj.mutate();

            enqueueSnackbar(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "voucher",
              }),
              {
                variant: "success",
              }
            );
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

  const children = useMemo(() => {
    return (
      <Sticky top={offsetTop}>
        <Box>
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
                    const pathname = `/${VOUCHERS}/${EDIT}/${row.original.id}`;
                    router.push(pathname, pathname, {
                      shallow: true,
                    });
                  },
                },
              },
              TableTitleProps: {
                TitleProps: {
                  children: (
                    <FormattedMessage
                      id="voucher.voucherListTitle"
                      defaultMessage="Danh sách voucher"
                    />
                  ),
                },
                pathname: `/${VOUCHERS}/${CREATE}`,
                writePermission,
              },
              columnFilterComponent: () => {
                return null;
              },
            }}
          />
        </Box>
      </Sticky>
    );
  });

  if (!isReady) {
    return <Loading />;
  }

  return (
    <GridContainer spacing={3}>
      <Grid item xs={3}>
        <Filter passHandler={setParams} data={params} reset={resetParams} />
      </Grid>

      <Grid item xs={8}>
        {children}
      </Grid>
    </GridContainer>
  );
};

export default DiscountList;
