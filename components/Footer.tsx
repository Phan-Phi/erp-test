import { Box, Grid } from "@mui/material";

import { Link } from "components";

export const Footer = () => {
  return (
    <Box
      className="footer"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTop: (theme) => {
          return `1px solid ${theme.palette.divider}`;
        },
        backgroundColor: "background.default",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: "85%",
        }}
      >
        <Grid item sm={6}>
          <Box>2021</Box>
        </Grid>
        <Grid item sm={6}>
          <Box>
            Designed & Developed by <Link href="https://t-solution.vn/">T-Solution</Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
