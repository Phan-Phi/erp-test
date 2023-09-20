import NextImage, { ImageProps } from "next/image";
import { Box, styled, BoxProps } from "@mui/material";

const defaultBlurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

type WrapperImageProps = {
  WrapperProps?: BoxProps;
  width: number | string;
  height: number | string;
  src: string;
};

export const Image = ({
  WrapperProps = {},
  src,
  width,
  height,
  layout = "fill",
  objectFit = "cover",
  placeholder = "blur",
  blurDataURL = defaultBlurDataURL,
  ...props
}: WrapperImageProps & ImageProps) => {
  if (typeof src === "string") {
    if (src.startsWith("blob")) {
      return <img src={src} alt="" width={"100%"} height="auto" />;
    }

    if (layout === "fill") {
      return (
        <Wrapper width={width} height={height} {...WrapperProps}>
          <NextImage
            {...{
              src,
              layout,
              objectFit,
              placeholder,
              blurDataURL,
              ...props,
              alt: props.alt ?? "",
            }}
          />
        </Wrapper>
      );
    } else {
      return (
        <NextImage
          {...{
            src,
            layout,
            objectFit,
            placeholder,
            blurDataURL,
            width,
            height,
            ...props,
            alt: props.alt ?? "",
          }}
        />
      );
    }
  } else {
    return null;
  }
};

const Wrapper = styled(Box)(({ theme }) => {
  return {
    position: "relative",
  };
});
