import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Grid, Stack, Box, Typography } from "@mui/material";

import Filter from "./Filter";
import UserListColumn from "./column/UserListColumn";

import {
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
} from "components/TableV2";
import { USER } from "apis";
import { Sticky } from "hocs";
import { transformUrl } from "libs";
import { USER_ITEM } from "interfaces";
import { USERS, CREATE } from "routes";
import { usePermission, useParams, useLayout, useFetch } from "hooks";
import { LoadingDynamic as Loading, LoadingButton, TableHeader } from "components";
import UserListColumnV2 from "./column/UserListColumnV2";
import { SAFE_OFFSET } from "constant";
import DynamicMessage from "messages";

export type PartnerFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
};

const defaultFilterValue: PartnerFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
};

const ListCustomerClone = () => {
  const { hasPermission: writePermission } = usePermission("write_user");

  const [ref, { height }] = useMeasure();

  const { state: layoutState } = useLayout();

  const { messages, formatMessage } = useIntl();

  const tableInstance = useRef<ExtendableTableInstanceProps<USER_ITEM>>();

  const [filter, setFilter] = useState(defaultFilterValue);

  const [params, setParams, isReady, resetParams] = useParams({
    initState: {
      use_cache: false,
    },
    callback: (params) => {
      if (tableInstance.current) {
        const setUrl = tableInstance.current.setUrl;

        setUrl(transformUrl(USER, params));
      }
    },
  });

  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<any>(
    transformUrl(USER, params)
  );

  useEffect(() => {
    changeKey(transformUrl(USER, params));
  }),
    [params];

  const passHandler = useCallback(
    (_tableInstance: ExtendableTableInstanceProps<USER_ITEM>) => {
      tableInstance.current = _tableInstance;
    },
    []
  );

  const onFilterHandler = useCallback((key) => {
    return (value: any) => {
      if (tableInstance.current) {
        const { pageSize } = tableInstance.current.state;

        setParams({
          page_size: pageSize,
          page: 1,
          [key]: value,
        });
      }
    };
  }, []);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <Grid container>
      <Grid item xs={2}>
        <Filter onFilterHandler={onFilterHandler} data={params} reset={resetParams} />
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

            <UserListColumnV2
              data={data ?? []}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
            />

            {/* <CompoundTableWithFunction<USER_ITEM>
              url={USER}
              passHandler={passHandler}
              columnFn={UserListColumn}
              messages={messages}
              TableContainerProps={{
                sx: {
                  maxHeight:
                    layoutState.windowHeight - (height + layoutState.sumHeight) - 48,
                },
              }}
            /> */}
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default ListCustomerClone;
