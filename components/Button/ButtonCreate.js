import { Button } from "@mui/material";
import { useRouter } from "next/router";

const ButtonCreate = ({ pathname, onClick, children = "Tạo mới", ...props }) => {
  const router = useRouter();

  if (!pathname && !onClick) {
    return null;
  }

  return (
    <Button
      variant="contained"
      onClick={
        onClick
          ? onClick
          : () => {
              router.push(pathname, pathname, {
                shallow: true,
              });
            }
      }
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonCreate;
