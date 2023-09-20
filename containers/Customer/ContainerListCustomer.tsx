import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { Range } from "react-date-range";
import { useState, useCallback, useMemo } from "react";
import { useMeasure, useUpdateEffect } from "react-use";

import { cloneDeep, get, omit, set } from "lodash";
import { Tabs, Tab, Stack, Grid, Box } from "@mui/material";

import Filter from "./official/Filter";
import ListCustomer from "./official/ListCustomer";
import { LoadingDynamic as Loading, TableHeader, TabPanel } from "components";

import { Sticky } from "hocs";
import { CUSTOMERS, CREATE } from "routes";
import { useFetch, usePermission } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1,
  ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import { ADMIN_CUSTOMERS_DRAFTS_END_POINT } from "__generated__/END_POINT";

const DraftCustomer = dynamic(() => import("./draft/DraftList"), {
  loading: () => {
    return <Loading />;
  },
});

export type CustomerFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search?: string;
  range: Range;
  official_customer_isnull: boolean;
  nested_depth: number;
  is_mutated: boolean | undefined;
  gender: string;
  in_business: boolean | undefined;
  type: ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1 | null;
  type_sale: ADMIN_USER_USER_VIEW_TYPE_V1 | null;
  birthday: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  birthDay_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
};

const defaultFilterValue: CustomerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  official_customer_isnull: false,
  nested_depth: 4,
  is_mutated: undefined,
  gender: "",
  in_business: undefined,
  type: null,
  type_sale: null,
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  birthday: {
    startDate: undefined,
    endDate: undefined,
    key: "birthday",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
  birthDay_params: {
    startDate: undefined,
    endDate: undefined,
  },
};

const omitFiled = [
  "birthday",
  "range",
  "range_params",
  "birthDay_params",
  "type",
  "type_sale",
];

const Customer = () => {
  const { messages } = useIntl();
  const [tab, setTab] = useState(0);
  const [ref, { height }] = useMeasure();
  const [choiceType, setChoiceType] = useState("");
  const { hasPermission: approvePermission } = usePermission("approve_customer");
  const [filter, setFilter] = useState<CustomerFilterType>(defaultFilterValue);

  const {
    data: dataListCustomer,
    changeKey,
    itemCount,
    isLoading,
    refreshData,
  } = useFetch<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1>(
    transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, omit(filter, omitFiled))
  );

  useUpdateEffect(() => {
    if (tab === 0) {
      changeKey(
        transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
          ...omit(filter, omitFiled),
          official_customer_isnull: false,
          nested_depth: 4,
        })
      );
    } else if (tab === 1) {
      changeKey(
        transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
          ...omit(filter, omitFiled),
          is_mutated: true,
          official_customer_isnull: undefined,
          nested_depth: undefined,
        })
      );
    }
  }, [tab]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        const isType = key === "type_sale" || key === "type";

        isType && setChoiceType(key);

        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range" || key === "birthday") return;

        const params = cloneDeep(cloneFilter);

        let getType = set(params, "type", get(params, "type.id"));
        let getTypeSale = set(params, "type_sale", get(params, "type_sale.id"));

        const dateStart = transformDate(cloneFilter.range_params.startDate, "date_start");

        const dateEnd = transformDate(cloneFilter.range_params.endDate, "date_end");

        const birthDayStart = transformDate(
          cloneFilter.birthDay_params.startDate,
          "date_start"
        );

        const birthDayEnd = transformDate(
          cloneFilter.birthDay_params.endDate,
          "date_end"
        );

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        let isStartBirthDay = cloneFilter.birthDay_params.startDate;
        let isEndBirthDay = cloneFilter.birthDay_params.endDate;

        let conditionChoiceType =
          key === "type_sale"
            ? getTypeSale.type_sale
            : key === "type"
            ? getType.type
            : undefined;

        changeKey(
          transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
            ...omit(cloneFilter, omitFiled),
            type: conditionChoiceType,
            date_created_start: isStartDate ? dateStart : undefined,
            date_created_end: isEndDate ? dateEnd : undefined,
            birthday_start: isStartBirthDay ? birthDayStart : undefined,
            birthday_end: isEndBirthDay ? birthDayEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let conditionChoiceType =
      choiceType === "type_sale"
        ? cloneFilter.type_sale?.id
        : choiceType === "type"
        ? cloneFilter.type?.id
        : undefined;

    let updateFilter = {
      ...cloneFilter,
      range_params: {
        startDate: cloneFilter.range.startDate,
        endDate: cloneFilter.range.endDate,
      },
    };

    setFilter(updateFilter);

    let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
    let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

    let birthDayStart = transformDate(
      updateFilter.birthDay_params.startDate,
      "date_start"
    );
    let birthDayEnd = transformDate(updateFilter.birthDay_params.endDate, "date_end");

    let isDateStart = updateFilter.range_params.startDate;
    let isDateEnd = updateFilter.range_params.endDate;

    let isBirthDayStart = updateFilter.birthDay_params.startDate;
    let isBirthDayEnd = updateFilter.birthDay_params.endDate;

    changeKey(
      transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
        ...omit(filter, omitFiled),
        type: conditionChoiceType,
        date_created_start: isDateStart ? dateStart : undefined,
        date_created_end: isDateEnd ? dateEnd : undefined,
        birthday_start: isBirthDayStart ? birthDayStart : undefined,
        birthday_end: isBirthDayEnd ? birthDayEnd : undefined,
      })
    );
  }, [filter, choiceType]);

  const onClickFilterBirthDay = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let conditionChoiceType =
      choiceType === "type_sale"
        ? cloneFilter.type_sale?.id
        : choiceType === "type"
        ? cloneFilter.type?.id
        : undefined;

    let updateFilter = {
      ...cloneFilter,
      birthDay_params: {
        startDate: cloneFilter.birthday.startDate,
        endDate: cloneFilter.birthday.endDate,
      },
    };

    setFilter(updateFilter);

    let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
    let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

    let birthDayStart = transformDate(
      updateFilter.birthDay_params.startDate,
      "date_start"
    );

    let birthDayEnd = transformDate(updateFilter.birthDay_params.endDate, "date_end");

    let isDateStart = updateFilter.range_params.startDate;
    let isDateEnd = updateFilter.range_params.endDate;

    let isBirthDayStart = updateFilter.birthDay_params.startDate;
    let isBirthDayEnd = updateFilter.birthDay_params.endDate;

    changeKey(
      transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
        ...omit(filter, omitFiled),
        type: conditionChoiceType,
        date_created_start: isDateStart ? dateStart : undefined,
        date_created_end: isDateEnd ? dateEnd : undefined,
        birthday_start: isBirthDayStart ? birthDayStart : undefined,
        birthday_end: isBirthDayEnd ? birthDayEnd : undefined,
      })
    );
  }, [filter, choiceType]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const changeHandler = useCallback((_, newTab) => {
    setTab(newTab);

    resetFilterHandler();
  }, []);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, omit(defaultFilterValue, omitFiled))
    );
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Filter
          filter={filter}
          onChangeSearch={onFilterChangeHandler("search")}
          onChangeGender={onFilterChangeHandler("gender")}
          onChangeStatus={onFilterChangeHandler("in_business")}
          onChangeCustomerType={onFilterChangeHandler("type")}
          onChangeUserType={onFilterChangeHandler("type_sale")}
          resetFilter={resetFilterHandler}
          onFilterByTime={onClickFilterByTime}
          onDateRangeChange={onFilterChangeHandler("range")}
          onClickFilterBirthDay={onClickFilterBirthDay}
          onBirthDayChange={onFilterChangeHandler("birthday")}
        />
      </Grid>

      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingCustomer"] as string}
                pathname={`/${CUSTOMERS}/${CREATE}`}
              />

              <Tabs value={tab} onChange={changeHandler}>
                <Tab label={messages["approved"]} />

                {approvePermission && <Tab label={messages["noApprove"]} />}
              </Tabs>
            </Box>

            <TabPanel value={tab} index={0}>
              <ListCustomer
                count={itemCount}
                headerHeight={height}
                isLoading={isLoading}
                pagination={pagination}
                data={dataListCustomer}
                onFilterChangeHandler={onFilterChangeHandler}
              />
            </TabPanel>

            {approvePermission && (
              <TabPanel value={tab} index={1}>
                <DraftCustomer
                  count={itemCount}
                  headerHeight={height}
                  isLoading={isLoading}
                  pagination={pagination}
                  data={dataListCustomer}
                  onFilterChangeHandler={onFilterChangeHandler}
                  refreshData={refreshData}
                />
              </TabPanel>
            )}
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default Customer;
