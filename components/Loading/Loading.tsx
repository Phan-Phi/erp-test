import { Box } from "@mui/material";

export const Loading = ({ ...props }) => {
  return (
    <div className="preloader">
      <Box className="text-loader">Loading...</Box>
    </div>
  );
};
