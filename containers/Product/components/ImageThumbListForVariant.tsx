import { useIntl } from "react-intl";
import { Stack, ImageList, ImageListItem, Button } from "@mui/material";

import { Image } from "components";
import { usePermission } from "hooks";
import { PRODUCT_VARIANT_IMAGE_ITEM } from "interfaces";

type ImageThumbListProps = {
  data: PRODUCT_VARIANT_IMAGE_ITEM[] | undefined;
  toggle: (nextValue?: boolean) => void;
};

const ImageThumbList = ({ data, toggle }: ImageThumbListProps) => {
  const { hasPermission: writePermission } = usePermission("write_product");

  const { messages } = useIntl();

  return (
    <Stack spacing={2}>
      <Stack columnGap={2} justifyContent="flex-end" flexDirection="row">
        {writePermission && (
          <Button
            onClick={() => {
              toggle(true);
            }}
            variant="outlined"
          >
            {messages["addImage"]}
          </Button>
        )}
      </Stack>
      <Stack columnGap={2} flexDirection="row">
        {data && (
          <ImageList cols={5} gap={16}>
            {data.map((file) => {
              return (
                <ImageListItem
                  sx={{
                    position: "relative",
                    width: 130,
                    height: "130px !important",
                  }}
                  key={file.id}
                >
                  <Image
                    src={file.image.image.product_list}
                    alt={file.image.alt}
                    width="100%"
                    height="100%"
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        )}
      </Stack>
    </Stack>
  );
};

export default ImageThumbList;
