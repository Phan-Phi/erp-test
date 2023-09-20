import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useDropzone } from "react-dropzone";
import { useController } from "react-hook-form";

import { FormControl, Button, Typography, FormHelperText, Stack } from "@mui/material";

import CameraAltIcon from "@mui/icons-material/CameraAlt";

import Avatar from "./Avatar";

const Upload = ({ control, name, writePermission = false, passHandler = () => {} }) => {
  const {
    fieldState: { error },
    field: { value },
  } = useController({
    name,
    control,
  });
  const { messages } = useIntl();

  const onDrop = useCallback(
    function (acceptedFiles, rejectedFiles) {
      passHandler({
        acceptedFiles,
        rejectedFiles,
      });
    },
    [passHandler]
  );

  const { getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
    maxFiles: 1,
    maxSize: 204800,
  });

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        {...{
          file: value,
        }}
      />

      {writePermission && (
        <FormControl fullWidth>
          <Typography sx={{ pl: 2, pb: 2 }}>{messages[name]}</Typography>
          <label htmlFor={name}>
            <input id={name} {...getInputProps()} />
            <Button
              variant="contained"
              component="span"
              sx={{
                marginTop: 0,
                marginLeft: 2,
              }}
              startIcon={<CameraAltIcon />}
            >
              <span>{messages["upload"]}</span>
            </Button>
          </label>
          {error && (
            <FormHelperText error>
              {messages[`message.error.${error.type}`]}
            </FormHelperText>
          )}
        </FormControl>
      )}
    </Stack>
  );
};

export default Upload;
