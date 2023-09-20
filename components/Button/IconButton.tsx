import {
  alpha,
  styled,
  IconButtonProps,
  IconButton as MuiIconButton,
} from "@mui/material";

const IconButton = (props: IconButtonProps) => {
  return <StyledMuiIconButton {...props}>{props.children}</StyledMuiIconButton>;
};

const StyledMuiIconButton = styled(MuiIconButton)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary2.main,
    color: theme.palette.common.white,

    ["&:active"]: {
      backgroundColor: alpha(theme.palette.primary2.main, 0.8),
    },
    ["&:focus"]: {
      backgroundColor: alpha(theme.palette.primary2.main, 0.8),
    },
    ["&:hover"]: {
      backgroundColor: alpha(theme.palette.primary2.main, 0.8),
    },
  };
});

export default IconButton;
