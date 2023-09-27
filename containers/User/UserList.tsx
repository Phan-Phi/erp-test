import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { Grid, Stack, Box } from "@mui/material";
import { cloneDeep, get, omit, set } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";

import { USER } from "apis";
import { Sticky } from "hocs";
import Filter from "./Filter";
import { USERS, CREATE } from "routes";
import UserListColumn from "./column/UserListColumn";
import { ADMIN_USERS_END_POINT } from "__generated__/END_POINT";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { LoadingDynamic as Loading, TableHeader, WrapperTable } from "components";
import { usePermission, useParams, useLayout, useFetch } from "hooks";
import { ADMIN_USER_USER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_USERS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

export type UserFilterType = {
  page: 1;
  page_size: 25;
  with_count: boolean;
  search?: string;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  gender: string;
  is_active: string;
};

const defaultFilterValue: UserFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  gender: "",
  is_active: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
};

const ListCustomer = () => {
  const { hasPermission: writePermission } = usePermission("write_user");

  const [ref, { height }] = useMeasure();

  const { state: layoutState } = useLayout();

  const { messages, formatMessage } = useIntl();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_USER_USER_VIEW_TYPE_V1>(transformUrl(ADMIN_USERS_END_POINT, filter));

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        const params = cloneDeep(cloneFilter);
        set(params, "gender", get(params, "gender"));
        set(params, "is_active", get(params, "is_active"));

        // const dateStart = transformDate(filter.range.startDate, "date_start");
        // const dateEnd = transformDate(filter.range.endDate, "date_end");

        let dateStart = transformDate(cloneFilter.range_params.startDate, "date_start");
        let dateEnd = transformDate(cloneFilter.range_params.endDate, "date_end");

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        changeKey(
          transformUrl(ADMIN_USERS_END_POINT, {
            ...omit(params, ["range", "range_params"]),
            // birthday_start: filter.range.startDate ? dateStart : undefined,
            // birthday_end: filter.range.endDate ? dateEnd : undefined,
            birthday_start: isStartDate ? dateStart : undefined,
            birthday_end: isEndDate ? dateEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(
        ADMIN_USERS_END_POINT,
        omit(defaultFilterValue, ["range", "range_params"])
      )
    );
  }, [filter]);

  const onClickFilterByTime = useCallback(
    (key: string) => {
      const cloneFilter = cloneDeep(filter);

      let updateFilter = {
        ...cloneFilter,
        range_params: {
          startDate: cloneFilter.range.startDate,
          endDate: cloneFilter.range.endDate,
        },
      };
      setFilter(updateFilter);

      // let dateStart: any = get(filter, "range.startDate");
      // let dateEnd: any = get(filter, "range.endDate");

      // dateStart = transformDate(dateStart, "date_start");
      // dateEnd = transformDate(dateEnd, "date_end");
      let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
      let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

      let isStartDate = updateFilter.range_params.startDate;
      let isEndDate = updateFilter.range_params.endDate;

      // set(params, "gender", get(params, "gender"));
      // set(params, "is_active", get(params, "is_active"));
      changeKey(
        transformUrl(ADMIN_USERS_END_POINT, {
          ...omit(cloneFilter, ["range", "range_params"]),
          // birthday_start: dateStart,
          // birthday_end: dateEnd,

          birthday_start: isStartDate ? dateStart : undefined,
          birthday_end: isEndDate ? dateEnd : undefined,
          offset: 0,
        })
      );
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Grid container>
      <Grid item xs={2}>
        <Filter
          filter={filter}
          onGender={onFilterChangeHandler("gender")}
          onIsActive={onFilterChangeHandler("is_active")}
          onSearch={onFilterChangeHandler("search")}
          resetFilter={resetFilterHandler}
          onFilterByTime={onClickFilterByTime}
          onDateRangeChange={onFilterChangeHandler("range")}
        />
      </Grid>
      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingUser"] as string}
                pathname={writePermission ? `/${USERS}/${CREATE}` : undefined}
              ></TableHeader>
            </Box>

            <WrapperTable>
              <UserListColumn
                data={data ?? []}
                count={itemCount}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 80
                }
              />
            </WrapperTable>
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default ListCustomer;
