import React from "react";
import { Stack, Typography, Button } from "@mui/material";

import { useToggle } from "hooks";
import AddProductDialog from "./AddProductDialog";

export default function AddProduct() {
  const { open, onOpen, onClose } = useToggle();

  return (
    <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
      <Typography fontWeight="700">Sản phẩm mua chung</Typography>

      <Button variant="contained" onClick={onOpen}>
        Thêm sản phẩm
      </Button>

      <AddProductDialog onClose={onClose} open={open} />
    </Stack>
  );
}
