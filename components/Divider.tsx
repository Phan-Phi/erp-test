import { styled, alpha } from "@mui/material/styles";
import { Divider as MuiDivider } from "@mui/material";





const Divider = styled(MuiDivider)(({ theme }) => {
  return {
    borderColor:
      theme.palette.mode === "light"
        ? alpha(theme.palette.common.black, 0.5)
        : alpha(theme.palette.common.white, 0.5),
  };
});

export default Divider;
