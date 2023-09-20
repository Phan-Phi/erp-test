import { useRef } from "react";
import Sticky from "react-stickynode";

import { Box } from "@mui/material";

interface StickyProps {
  children: React.ReactNode;
  StickyProps?: React.ComponentPropsWithoutRef<typeof Sticky>;
}

const HOCSticky = (props: StickyProps) => {
  const { children, StickyProps } = props;

  const ref = useRef<HTMLDivElement>();

  return (
    <Box ref={ref}>
      <Sticky enabled={true} top={ref.current?.offsetTop} {...StickyProps}>
        {children}
      </Sticky>
    </Box>
  );
};

export default HOCSticky;
