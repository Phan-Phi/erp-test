import { Avatar as MuiAvatar, styled } from "@mui/material";

const CustomAvatar = ({ file, ...props }) => {
  return (
    <Avatar
      src={file && file instanceof File ? URL.createObjectURL(file) : file ? file : ""}
      {...props}
    />
  );
};

export default CustomAvatar;

const Avatar = styled(MuiAvatar)(({ theme }) => {
  return {
    width: "80px",
    height: "80px",
    marginRight: 2,
    borderRadius: "8px",
    ["& img"]: {
      objectFit: "contain",
    },
  };
});
