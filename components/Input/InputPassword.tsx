import { IconButton, InputAdornment, InputProps } from "@mui/material";
import React, { useCallback, useState } from "react";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { InputBase } from "./InputBase";

export const InputPassword = (props: InputProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const onHandleShowPasswordHandler = useCallback((status: boolean) => {
    return () => {
      setIsShowPassword(!status);
    };
  }, []);

  return (
    <InputBase
      sx={{ flexGrow: 1 }}
      type={isShowPassword ? "text" : "password"}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            onClick={onHandleShowPasswordHandler(isShowPassword)}
            edge="end"
            color="primary2"
          >
            {isShowPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
  );
};
