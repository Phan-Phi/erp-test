import { Box } from "@mui/material";
import { useSession } from "next-auth/react";

import get from "lodash/get";

import { Topbar } from "./Topbar";
import { Navbar } from "./Navbar";

export const Header = () => {
  const { data } = useSession();

  const loginAsDefault = get(data, "user.login_as_default");

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
      }}
    >
      {!loginAsDefault && <Topbar />}
      <Navbar />
    </Box>
  );
};
