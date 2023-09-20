import { Grid } from "@mui/material";

import CreateExportDebtRecord from "./CreateExportDebtRecord";
import ExportDebtRecordContext from "./ExportDebtRecordContext";
import ListingExportDebtRecord from "./ListingExportDebtRecord";

const DebtRecord = () => {
  return (
    <ExportDebtRecordContext>
      <Grid container justifyContent="flex-start">
        <Grid item xs={12}>
          <CreateExportDebtRecord />
        </Grid>
        <Grid item xs={12}>
          <ListingExportDebtRecord />
        </Grid>
      </Grid>
    </ExportDebtRecordContext>
  );
};

export default DebtRecord;
