import { useMemo } from "react";
import { Image } from "components";
import { Avatar, Box, Skeleton } from "@mui/material";

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
          width={60}
          height={60}
          src={src}
          WrapperProps={{ borderRadius: "0.25rem", overflow: "hidden" }}
          alt=""
        />
      );
    } else {
      return <Avatar sx={{ width: 60, height: 60 }} variant="rounded" />;
    }
  }, [src]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Box display="flex" borderRadius={"0.25rem"} overflow="hidden">
      {renderContent}
    </Box>
  );
};

export default TableCellForAvatar;
