import React, { Fragment } from "react";
import { Box, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { Link } from "components";
import { useChoice } from "hooks";
import { EXPORT_FILE_ITEM } from "interfaces";
import { getDisplayValueFromChoiceItem, formatDate } from "libs";

interface ExportInvoiceItemProps {
  data: EXPORT_FILE_ITEM;
}

const ExportItem = ({ data }: ExportInvoiceItemProps) => {
  const { export_file_types, export_file_job_statuses } = useChoice();

  const { id, date_created, status, type, file } = data;

  const typeValue = getDisplayValueFromChoiceItem(export_file_types, type);
  const statusValue = getDisplayValueFromChoiceItem(export_file_job_statuses, status);

  return (
    <Fragment>
      <Typography>{id}</Typography>
      <Typography>{formatDate(date_created)}</Typography>
      <Typography>{typeValue}</Typography>
      <Typography>{statusValue}</Typography>
      {file ? (
        <Link href={file}>
          <DownloadIcon />
        </Link>
      ) : (
        <Box></Box>
      )}
    </Fragment>
  );
};

export default ExportItem;
