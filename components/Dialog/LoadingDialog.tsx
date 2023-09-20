import { CircularProgress, Stack, Dialog } from "@mui/material";

interface LoadingDialogProps {
  open: boolean;
  onClose?: () => void;
}

const LoadingDialog = (props: LoadingDialogProps) => {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <Stack alignItems="center" justifyContent="center" padding={8}>
        <CircularProgress />
      </Stack>
    </Dialog>
  );
};

export default LoadingDialog;
