import { Image } from "components";

interface LoginHeaderProps {
  src?: string;
}

const LoginHeader = (props: LoginHeaderProps) => {
  const { src } = props;

  if (src == undefined) return null;

  return (
    <Image
      src={src || "/logo-lighttheme.png"}
      width="8rem"
      height="8rem"
      objectFit="contain"
      alt=""
    />
  );
};

export default LoginHeader;
