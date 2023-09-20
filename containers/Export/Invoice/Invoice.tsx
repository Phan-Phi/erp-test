import { Grid } from "@mui/material";

import ExportInvoice from "./ExportInvoiceContext";
import CreateExportInvoice from "./CreateExportInvoice";
import ListingExportInvoice from "./ListingExportInvoice";

const Invoice = () => {
  return (
    <ExportInvoice>
      <Grid container justifyContent="flex-start">
        <Grid item xs={12}>
          <CreateExportInvoice />
        </Grid>
        <Grid item xs={12}>
          <ListingExportInvoice />
        </Grid>
      </Grid>
    </ExportInvoice>
  );
};

export default Invoice;
