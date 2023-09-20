import { Box, styled, BoxProps } from "@mui/material";

interface ExtendableBox extends BoxProps {
  spacing?: number;
}

export const Spacing = (props: ExtendableBox) => {
  const { spacing = 2 } = props;

  return <StyledSpacing paddingTop={spacing} {...props} />;
};

const StyledSpacing = styled(Box)(({ theme }) => {
  return {};
});
