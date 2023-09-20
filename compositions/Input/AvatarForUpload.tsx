import React from "react";
import { Box, styled } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import { Image } from "components";

interface AvatarForUploadProps {
  src?: string | File;
  onRemove?: React.MouseEventHandler<SVGSVGElement>;
  readOnly?: boolean;
}

const AvatarForUpload = (props: AvatarForUploadProps) => {
  const { src, onRemove, readOnly } = props;

  if (src) {
    let _src = src;

    if (_src instanceof File) {
      _src = URL.createObjectURL(_src);
    }

    return (
      <WrapperImage>
        <Image width={100} height={100} src={_src} alt="Uploaded Image" />
        {!readOnly && <StyledCloseIcon onClick={onRemove} />}
      </WrapperImage>
    );
  }

  return (
    <WrapperIcon>
      <FileUploadOutlinedIcon />
    </WrapperIcon>
  );
};

const WrapperIcon = styled(Box)(() => {
  return {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginY: "0.5rem",
    cursor: "pointer",
    color: "black",
    borderRadius: "10px",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
    width: "100px",
    height: "100px",
    backgroundColor: "#E6E6E6",
    transition: "all 0.4s",
    ["&:hover"]: {
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.25)",
    },
  };
});

const WrapperImage = styled(Box)(() => {
  return {
    position: "relative",
    width: "100px",
    height: "100px",
    marginY: "0.5rem",
    "& img": {
      borderRadius: "10px",
      height: "100px",
      transition: "all 0.4s",
      objectFit: "cover",
      ["&:hover"]: {
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.25)",
      },
    },
  };
});

const StyledCloseIcon = styled(CloseIcon)(({ theme }) => {
  return {
    cursor: "pointer",
    fontSize: "1.2rem",
    borderRadius: "50%",
    color: "white",
    position: "absolute",
    right: "-7px",
    top: "-7px",
    backgroundColor: theme.palette.error.main,
  };
});

export default AvatarForUpload;
