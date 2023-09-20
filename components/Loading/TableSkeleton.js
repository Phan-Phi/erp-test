import { Skeleton, Stack, Box } from "@mui/material";
import { Fragment } from "react";
const TableSkeleton = ({ noContainer }) => {
  let children = (
    <Fragment>
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
      <Skeleton variant="rectangular" height={24} />
    </Fragment>
  );

  if (noContainer) {
    return (
      <Box display="grid" gridTemplateColumns="minmax(250px, auto) repeat(1, 150px) 64px" gap={2}>
        {children}
      </Box>
    );
  } else {
    return children;
  }
};

export default TableSkeleton;
