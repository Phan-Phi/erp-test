import { Button, ButtonProps } from "@mui/material";

const ExportButton = (props: ButtonProps) => {
  return (
    <Button variant="outlined" {...props}>
      Xuất file
    </Button>
  );
};

export default ExportButton;
