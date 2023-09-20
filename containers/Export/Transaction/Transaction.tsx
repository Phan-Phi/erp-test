import { Grid } from "@mui/material";

import ExportTransactionContext from "./ExportTransactionContext";
import CreateExportTransaction from "./CreateExportTransaction";
import ListingExportTransaction from "./ListingExportTransaction";

const Transaction = () => {
  return (
    <ExportTransactionContext>
      <Grid container justifyContent="flex-start">
        <Grid item xs={12}>
          <CreateExportTransaction />
        </Grid>
        <Grid item xs={12}>
          <ListingExportTransaction />
        </Grid>
      </Grid>
    </ExportTransactionContext>
  );
};

export default Transaction;
