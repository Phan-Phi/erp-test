import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { useIntl } from "react-intl";

import { Box, Theme } from "@mui/material";

import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";

type ImageUploadBoxProps = {
  onDrop: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void | undefined;
};

const ImageUploadBox = ({ onDrop }: ImageUploadBoxProps) => {
  const { getRootProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
  });

  const { messages } = useIntl();

  return (
    <Box
      {...getRootProps({
        sx: {
          width: "100%",
          border: (theme: Theme) => {
            return `1px solid ${theme.palette.grey[200]}`;
          },
          cursor: "pointer",
          backgroundColor: (theme: Theme) => {
            return isDragActive ? theme.palette.grey[100] : null;
          },
        },
      })}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
        }}
      >
        <InsertPhotoOutlinedIcon
          fontSize="large"
          sx={{
            marginBottom: 1,
          }}
        />

        {messages["dropToUpload"]}
      </Box>
    </Box>
  );
};

export default ImageUploadBox;
