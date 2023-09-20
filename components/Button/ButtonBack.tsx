import { useIntl } from "react-intl";
import { Button, ButtonProps } from "@mui/material";

import { Link } from "components";

interface CommonProps extends ButtonProps {}

type ConditionalProps =
  | { pathname: string; onClick?: never }
  | { pathname?: never; onClick: () => void };

type Props = CommonProps & ConditionalProps;

const BackButton = (props: Props) => {
  const { messages } = useIntl();

  const { pathname, onClick, children, ...restProps } = props;

  if (!pathname && !onClick) {
    return null;
  }

  if (pathname) {
    return (
      <Link href={pathname}>
        <Button variant="outlined" {...restProps}>
          {children ?? (messages["backButton"] as string)}
        </Button>
      </Link>
    );
  } else {
    return (
      <Button variant="outlined" onClick={onClick} {...restProps}>
        {children ?? (messages["backButton"] as string)}
      </Button>
    );
  }
};

export default BackButton;
