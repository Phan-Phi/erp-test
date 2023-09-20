import { Box, Typography } from "@mui/material";

const NoData = ({ ContainerProps = {}, BodyProps = {}, children = "Không có dữ liệu" }) => {
  const { sx, ...props } = BodyProps;

  return (
    <Box {...ContainerProps}>
      <Typography sx={{ fontStyle: "italic", textAlign: "center", ...sx }} {...props}>
        {children}
      </Typography>
    </Box>
  );
};

export default NoData;
