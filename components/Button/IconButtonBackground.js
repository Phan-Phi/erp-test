import { IconButton as MuiIconButton, CircularProgress } from "@mui/material";

const IconButton = ({ loading = false, onClick, children, sx = {}, ...props }) => {
  return (
    <MuiIconButton
      edge="end"
      disabled={loading}
      onClick={onClick}
      sx={{
        padding: "6px",
        backgroundColor: "primary.main",
        borderRadius: "4px",
        ["& svg"]: {
          color: "common.white",
        },
        "&:hover": {
          backgroundColor: "primary.main",
          opacity: 0.8,
        },
        marginRight: 0,
        ...sx,
      }}
      disableRipple={true}
      {...props}
    >
      {loading ? <CircularProgress size={24} /> : children}
    </MuiIconButton>
  );
};

export default IconButton;
