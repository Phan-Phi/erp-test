import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useState, useCallback, Fragment } from "react";

import chunk from "lodash/chunk";
import { Box } from "@mui/material";

import DraftTable from "./DraftTable";
import { WrapperTable } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { checkResArr } from "libs/utils";
import { usePermission, useConfirmation, useNotification, useLayout } from "hooks";
import { ADMIN_CUSTOMERS_DRAFTS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

interface ListDraftProps {
  data: any;
  count: number;
  pagination: any;
  isLoading: boolean;
  headerHeight: number;
  onFilterChangeHandler: any;
  refreshData: any;
}

const ListDraft = (props: ListDraftProps) => {
  const {
    headerHeight,
    data,
    count,
    pagination,
    isLoading,
    refreshData,
    onFilterChangeHandler,
  } = props;

  const { formatMessage } = useIntl();
  const { state: layoutState } = useLayout();
  const { onConfirm, onClose } = useConfirmation();
  const [approveLoading, setApproveLoading] = useState({});
  const { hasPermission: approvePermission } = usePermission("approve_customer");
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const approveHandler = useCallback(
    ({
      data,
      type,
    }: {
      data: Row<Required<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1>>[];
      type: "apply" | "refuse";
    }) => {
      return async () => {
        const trueLoadingList = {};
        const falseLoadingList = {};
        const idList: any[] = [];

        data.forEach((el) => {
          falseLoadingList[el.original.id] = false;
          trueLoadingList[el.original.id] = true;
          idList.push({
            id: el.original.id,
            token: el.original.token,
          });
        });

        setApproveLoading((prev) => {
          return {
            ...prev,
            ...trueLoadingList,
            all: true,
          };
        });

        try {
          let resList: any[] = [];
          const chunkIdList = chunk(idList, 5);

          for await (let list of chunkIdList) {
            const temp = await Promise.all(
              list.map(async (el) => {
                return axios.post(
                  `${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${el.id}/${type}/`,
                  el
                );
              })
            );

            resList = [...resList, ...temp];
          }

          const result = checkResArr(resList);

          if (result) {
            if (type === "apply") {
              enqueueSnackbarWithSuccess(
                formatMessage(DynamicMessage.approveSuccessfully, {
                  content: "khách hàng",
                })
              );
            } else if (type === "refuse") {
              enqueueSnackbarWithSuccess(
                formatMessage(DynamicMessage.refuseSuccessfully, {
                  content: "khách hàng",
                })
              );

              onClose();
            }

            refreshData();
          }
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          setApproveLoading((prev) => {
            return {
              ...prev,
              ...falseLoadingList,
              all: false,
            };
          });
        }
      };
    },
    []
  );

  const deleteHandler = useCallback(async ({ data }) => {
    onConfirm(approveHandler({ data, type: "refuse" }), {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  return (
    <Fragment>
      <WrapperTable>
        <DraftTable
          data={data ?? []}
          count={count}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
          pagination={pagination}
          maxHeight={
            layoutState.windowHeight - (headerHeight + layoutState.sumHeight) - 48
          }
          isLoading={isLoading}
          approvePermission={approvePermission}
          approveHandler={approveHandler}
          deleteHandler={deleteHandler}
          approveLoading={approveLoading}
        />
      </WrapperTable>

      <Box padding="60px" />
    </Fragment>
  );
};

export default ListDraft;
