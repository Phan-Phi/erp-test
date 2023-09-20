import { Link } from "components";
import { Typography, Box } from "@mui/material";

const LoginFooter = () => {
  return (
    <Box>
      <Typography>
        Powered by
        <Link href="https://t-solution.vn/" target="_blank">
          {" "}
          T-Solution
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginFooter;
