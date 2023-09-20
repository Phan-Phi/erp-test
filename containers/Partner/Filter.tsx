import { useIntl } from "react-intl";
import { Stack, Button, Box, Typography } from "@mui/material";

import { PartnerFilterType } from "./PartnerList";
import { CommonFilterTableProps } from "interfaces";
import { FilterByPriceRangeV2, SearchField } from "components";

type FilterProps = CommonFilterTableProps<PartnerFilterType> & {
  onSearchChange: (value: any) => void;
  onFilterDebt: () => void;
  onFilterPurchase: () => void;
  onChangePriceStart: any;
  onChangePriceEnd: any;
  onChangePurchaseStart: any;
  onChangePurchaseEnd: any;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    onSearchChange,
    onFilterDebt,
    onChangePriceStart,
    onChangePriceEnd,
    onFilterPurchase,
    onChangePurchaseStart,
    onChangePurchaseEnd,
  } = props;

  const { messages } = useIntl();

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onSearchChange}
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterTotalDebtAmount"]}
        </Typography>

        <FilterByPriceRangeV2
          initPriceStart={filter.total_debt_amount_start}
          initPriceEnd={filter.total_debt_amount_end}
          onChangePriceStart={onChangePriceStart}
          onChangePriceEnd={onChangePriceEnd}
          onFilterPrice={onFilterDebt}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Tổng mua
        </Typography>

        <FilterByPriceRangeV2
          initPriceStart={filter.total_purchase_start}
          initPriceEnd={filter.total_purchase_end}
          onChangePriceStart={onChangePurchaseStart}
          onChangePriceEnd={onChangePurchaseEnd}
          onFilterPrice={onFilterPurchase}
        />

        {/* <FilterByTimeRange
          onChangeDateStart={onFilterHandler("total_purchase_start")}
          onChangeDateEnd={onFilterHandler("total_purchase_end")}
          initDateStart={data?.total_purchase_start || null}
          initDateEnd={data?.total_purchase_end || null}
        /> */}
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
