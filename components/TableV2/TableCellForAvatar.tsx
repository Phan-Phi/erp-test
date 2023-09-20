import { Avatar, Box, Skeleton } from "@mui/material";
import { Image } from "components";
import { useMemo } from "react";

interface TableCellForAvatarProps {
  loading?: boolean;
  src: string | null;
}

const TableCellForAvatar = (props: TableCellForAvatarProps) => {
  const { src, loading } = props;

  const renderContent = useMemo(() => {
    if (src) {
      return (
        <Image
          width={48}
          height={48}
          src={src}
          objectFit="contain"
          WrapperProps={{ borderRadius: "0.25rem", overflow: "hidden" }}
          alt=""
        />
      );
    } else {
      return <Avatar sx={{ width: 36, height: 36 }} variant="rounded" />;
    }
  }, [src]);

  if (loading) return <Skeleton />;

  return (
    <Box
      display="flex"
      justifyContent="center"
      borderRadius={"0.25rem"}
      overflow="hidden"
    >
      {renderContent}
    </Box>
  );
};

export default TableCellForAvatar;
