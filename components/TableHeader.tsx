import React from "react";
import { useIntl } from "react-intl";

import { Stack, StackProps, Typography, Button } from "@mui/material";

import { Link } from "components";

interface ITableHeader extends StackProps {
  title?: string;
  pathname?: string;
}

export const TableHeader = (props: ITableHeader) => {
  const { children, title, pathname, ...restProps } = props;
  const { messages } = useIntl();

  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      {...restProps}
    >
      {title && <Typography variant="h6">{title}</Typography>}
      {pathname && (
        <Link href={pathname}>
          <Button>{messages["createNewButton"]}</Button>
        </Link>
      )}
      {children}
    </Stack>
  );
};
