import { Container as MuiContainer, ContainerProps } from "@mui/material";

export const Container = (props: ContainerProps) => {
  const { children, ...restProps } = props;

  return <MuiContainer {...restProps}>{children}</MuiContainer>;
};
