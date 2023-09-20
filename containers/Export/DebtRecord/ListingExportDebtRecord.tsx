import useSWR from "swr";
import React, { Fragment, useContext, useEffect } from "react";
import { Box, Typography } from "@mui/material";

import { EXPORT_FILE } from "apis";
import { transformUrl } from "libs";
import { Loading } from "components";
import ExportItem from "../components/ExportItem";
import { EXPORT_FILE_ITEM, responseSchema } from "interfaces";
import { ExportDebtRecordContext } from "./ExportDebtRecordContext";

const ListingExportDebtRecord = () => {
  const context = useContext(ExportDebtRecordContext);

  const { data, mutate } = useSWR<responseSchema<EXPORT_FILE_ITEM>>(
    transformUrl(EXPORT_FILE, {
      get_all: true,
    })
  );

  useEffect(() => {
    context.set({
      mutateExportTransaction: mutate,
    });
  }, []);

  if (data == undefined) {
    return <Loading />;
  }

  return (
    <Fragment>
      <Box display="grid" rowGap={2} gridTemplateColumns="10% auto 20% 20% 5%">
        <Box></Box>
        <Typography>Ngày tạo</Typography>
        <Typography>Nguồn</Typography>
        <Typography>Trạng thái</Typography>
        <Box></Box>
        {data.results.map((el) => {
          return <ExportItem key={el.id} data={el} />;
        })}
      </Box>
    </Fragment>
  );
};

export default ListingExportDebtRecord;
