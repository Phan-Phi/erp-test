import { Box } from "@mui/material";
import SEO from "components/SEO";
import { useSetting } from "hooks";
import { getSeoObject } from "libs/getSeoObject";

export const Loading = ({ ...props }) => {
  const setting = useSetting();

  return (
    <div className="preloader">
      <SEO {...getSeoObject(setting)} />

      <Box className="text-loader">Loading...</Box>
    </div>
  );
};
