import { Fragment } from "react";
import { Box } from "@mui/material";

import { useLayout } from "hooks";
import { WrapperTable } from "components";
import CustomerTable from "./CustomerTable";

interface ListCustomerProps {
  data: any;
  count: number;
  pagination: any;
  isLoading: boolean;
  headerHeight: number;
  onFilterChangeHandler: any;
}

const ListCustomer = (props: ListCustomerProps) => {
  const { headerHeight, data, count, onFilterChangeHandler, pagination, isLoading } =
    props;

  const { state: layoutState } = useLayout();

  return (
    <Fragment>
      <WrapperTable>
        <CustomerTable
          data={data ?? []}
          count={count}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
          pagination={pagination}
          maxHeight={
            layoutState.windowHeight - (headerHeight + layoutState.sumHeight) - 48
          }
          isLoading={isLoading}
        />
      </WrapperTable>

      <Box padding="40px" />
    </Fragment>
  );
};
export default ListCustomer;
