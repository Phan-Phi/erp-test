import { Box, Stack, Avatar, Typography } from "@mui/material";

const CardItem = ({
  Icon,
  MainProps = {},
  SubMainProps = {},
  SubProps = {},
  AvatarProps = {},
  ...props
}) => {
  return (
    <Stack
      columnGap={2}
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <Box>
        <Avatar {...AvatarProps}>{Icon && <Icon />}</Avatar>
      </Box>

      <Stack alignContent={"flex-end"}>
        <Typography fontWeight={700} {...SubMainProps} />
        <Typography variant="h6" {...MainProps} />
        <Typography variant="caption" {...SubProps} />
      </Stack>
    </Stack>
  );
};

export default CardItem;
