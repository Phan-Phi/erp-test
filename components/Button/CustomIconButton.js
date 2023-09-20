import { IconButton } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

const CustomIconButton = styled(IconButton)({
  color: "#FFF",
  "&:hover": {
    backgroundColor: alpha("#FFF", 0.2),
    borderColor: "none",
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: alpha("#FFF", 0.2),
    borderColor: "none",
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(255, 255, 255, .5)",
  },
});

export default CustomIconButton;
