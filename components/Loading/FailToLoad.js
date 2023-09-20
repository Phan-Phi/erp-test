import { Box, Typography } from "@mui/material";

const FailToLoad = ({ ContainerProps = {}, BodyProps = {}, children = "Tải thất bại" }) => {
  const { sx, ...props } = BodyProps;

  return (
    <Box {...ContainerProps}>
      <Typography sx={{ fontStyle: "italic", textAlign: "center", ...sx }} {...props}>
        {children}
      </Typography>
    </Box>
  );
};

export default FailToLoad;
