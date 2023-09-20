import { Box } from "@mui/material";

const LoadingRoute = ({ ...props }) => {
  return (
    <div className="preloader">
      <Box className="text-loader">Loading...</Box>
    </div>
  );
};

export default LoadingRoute;
