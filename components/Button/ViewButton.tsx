import React from "react";
import { IconButton, IconButtonProps } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Link from "libs/Link";

interface ViewButtonProps extends IconButtonProps {
  href?: string;
}

const ViewButton = (props: ViewButtonProps = {}) => {
  const { href, ...restProps } = props;

  if (href == undefined)
    return (
      <IconButton {...restProps}>
        <VisibilityIcon />
      </IconButton>
    );

  return (
    <Link href={href}>
      <IconButton {...restProps}>
        <VisibilityIcon />
      </IconButton>
    </Link>
  );
};

export default ViewButton;
