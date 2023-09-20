import useSWR from "swr";
import { Grid } from "@mui/material";

import TopSale from "./components/TopSale";
import Overview from "./components/Overview";
import NetRevenue from "./components/NetRevenue";
import { LoadingDynamic as Loading } from "components";

import { GeneralNetRevenueReport } from "__generated__/apiType_v1";
import { ADMIN_REPORTS_GENERAL_NET_REVENUE_END_POINT } from "__generated__/END_POINT";

const Home = () => {
  const { data: reportGeneralNetRevenueData } = useSWR<Required<GeneralNetRevenueReport>>(
    ADMIN_REPORTS_GENERAL_NET_REVENUE_END_POINT
  );

  if (reportGeneralNetRevenueData == undefined) return <Loading />;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Overview data={reportGeneralNetRevenueData} />
      </Grid>

      <Grid item xs={12}>
        <NetRevenue />
      </Grid>

      <Grid item xs={12}>
        <TopSale />
      </Grid>
    </Grid>
  );
};

export default Home;
