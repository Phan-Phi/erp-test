import { useIntl } from "react-intl";
import { Typography, Stack } from "@mui/material";
import { ButtonCreate } from "../../components";

const TableTitle = ({ TitleProps = {}, pathname, writePermission }) => {
  const { children } = TitleProps;

  if (!children || !pathname) {
    return null;
  }

  return (
    <Component
      {...{
        TitleProps,
        writePermission,
        pathname,
      }}
    />
  );
};

const Component = (props) => {
  const { TitleProps, writePermission = true, pathname } = props;
  const { sx, children, ...restProps } = TitleProps;
  const { messages } = useIntl();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography
        variant="h6"
        sx={{
          ...sx,
        }}
        {...restProps}
      >
        {children}
      </Typography>
      {writePermission && (
        <ButtonCreate pathname={pathname}>{messages["createNewButton"]}</ButtonCreate>
      )}
    </Stack>
  );
};

export default TableTitle;
