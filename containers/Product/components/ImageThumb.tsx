import { useRef } from "react";
import { useMeasure } from "react-use";
import { useDrag, useDrop } from "react-dnd";

import { Box, ImageListItem } from "@mui/material";

import set from "lodash/set";

import DeleteIcon from "@mui/icons-material/Delete";

import { Image, CustomIconButton } from "components";

import { usePermission } from "hooks";

import { type IImage } from "yups";

interface ExtendImage extends IImage {
  idx: number;
}

type ImageThumbProps = {
  onChangePositionHandler: (dragIndex: number, hoverIndex: number) => void;
  onRemoveHandler: () => void;
  data: ExtendImage;
};

type ItemType = {
  id: string;
  idx: number;
};

const ImageThumb = ({
  onChangePositionHandler,
  data,
  onRemoveHandler,
}: ImageThumbProps) => {
  const { formId, idx, file } = data;

  const { hasPermission: writePermission } = usePermission("write_product");

  const [measureRef, { width }] = useMeasure();

  const [{ isDragging }, dragRef] = useDrag<
    ItemType,
    unknown,
    {
      isDragging: boolean;
    }
  >({
    type: "product-image",
    item: { id: formId as string, idx: idx as number },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [collectedProps, dropRef] = useDrop<ItemType, unknown, unknown>({
    accept: "product-image",
    drop: (item, monitor) => {
      const dragIndex = item.idx;
      const hoverIndex = idx as number;

      if (dragIndex === hoverIndex) return;

      onChangePositionHandler(dragIndex, hoverIndex);

      item.idx = hoverIndex;
    },
  });

  const ref = useRef<HTMLLIElement>();
  const dragDropRef = dragRef(dropRef(ref));

  const opacity = isDragging ? 0.25 : 1;

  return (
    <Box ref={measureRef} position="relative">
      <ImageListItem
        sx={{
          position: "relative",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          height: `${width}px !important`,
          "&:hover .bg": {
            opacity: 1,
          },
          opacity,
        }}
        ref={(instance) => {
          if (dragDropRef) {
            set(dragDropRef, "current", instance);
          }
        }}
      >
        <Image
          src={file instanceof File ? URL.createObjectURL(file) : file}
          height="100%"
          width="100%"
          WrapperProps={{
            minWidth: 130,
          }}
          alt=""
        />

        {writePermission && (
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "rgb(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0,
              transition: "0.3s",
            }}
            className="bg"
          >
            <CustomIconButton onClick={onRemoveHandler}>
              <DeleteIcon />
            </CustomIconButton>
          </Box>
        )}
      </ImageListItem>
    </Box>
  );
};

export default ImageThumb;
