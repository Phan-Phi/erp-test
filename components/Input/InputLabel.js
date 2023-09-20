import { InputLabel as MuiInputLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

const InputLabel = styled(MuiInputLabel)(({ theme }) => {
  return {
    fontWeight: 400,
    color: "rgba(0, 0, 0, 0.6)",
    transform: "translate(14px, -9px) scale(0.75)",
  };
});

export default InputLabel;
