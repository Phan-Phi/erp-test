import React from "react";
import { IconButton, IconButtonProps } from "@mui/material";
import AddLinkIcon from "@mui/icons-material/AddLink";

import Link from "libs/Link";

interface ViewButtonProps extends IconButtonProps {
  href: string;
}

const AddLinkButton = (props: ViewButtonProps) => {
  const { href, ...restProps } = props;

  return (
    <Link href={href}>
      <IconButton {...restProps}>
        <AddLinkIcon />
      </IconButton>
    </Link>
  );
};

export default AddLinkButton;
