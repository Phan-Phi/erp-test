import useSWR from "swr";
import { Row } from "react-table";
import { useRouter } from "next/router";
import { useCallback, Fragment, useState, useEffect, useMemo } from "react";

import { Box } from "@mui/material";
import { cloneDeep, get } from "lodash";

import { LoadingDynamic as Loading } from "components";
import CreateInvoiceLineTable from "../table/CreateInvoiceLineTable";

import { PRODUCTS } from "routes";
import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";

import {
  ADMIN_ORDERS_LINES_END_POINT,
  ADMIN_WAREHOUSES_RECORDS_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

interface CreateLineListProps {
  warehouse: any | null;
  invoice: any;
  updateEditRowDataHandler: ({
    value,
    row,
    keyName,
  }: {
    value: any;
    row: Row<{
      id: number;
    }>;
    keyName: string;
  }) => void;
  editData: any;
}

export type CreateLineListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  order: string | undefined;
  nested_depth: number;
};

const defaultFilterValue: CreateLineListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  order: undefined,
  nested_depth: 3,
};

const CreateLineList = ({
  warehouse,
  invoice,
  editData,
  updateEditRowDataHandler,
}: CreateLineListProps) => {
  const router = useRouter();

  const { data: warehouseData } = useSWR(() => {
    const invoiceId = get(invoice, "id");

    const warehouseId = get(warehouse, "id");

    if (invoiceId && warehouseId) {
      const params = {
        can_add_to_invoice: `${invoiceId},${warehouseId}`,
        get_all: true,
        use_cache: false,
        nested_depth: 3,
        quantity_gte: 1,
      };

      return transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, params);
    }
  });

  const [filter, setFilter] = useState<CreateLineListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_ORDER_LINE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_LINES_END_POINT, {
        ...filter,
        order: router.query.id,
      })
    );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_ORDERS_LINES_END_POINT, {
          ...defaultFilterValue,
          order: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_ORDERS_LINES_END_POINT, {
            ...cloneFilter,
            order: router.query.id,
          })
        );
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const onGotoHandler = useCallback((data: Row<ADMIN_ORDER_LINE_VIEW_TYPE_V1>) => {
    const productId = get(data, "original.variant.product.id");

    window.open(`/${PRODUCTS}/${productId}`, "_blank");
  }, []);

  if (warehouseData == undefined) {
    return <Loading />;
  }

  return (
    <Fragment>
      <CreateInvoiceLineTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        warehouseData={warehouseData}
        updateEditRowDataHandler={updateEditRowDataHandler}
        onGotoHandler={onGotoHandler}
        editData={editData}
        invoice={invoice}
      />

      <Box padding="10px" />
    </Fragment>
  );
};

export default CreateLineList;
