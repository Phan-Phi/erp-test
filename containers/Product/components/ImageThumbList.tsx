import { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { UseFieldArraySwap, UseFieldArrayRemove } from "react-hook-form";

import { HTML5Backend } from "react-dnd-html5-backend";

import { Stack, ImageList } from "@mui/material";

import ImageThumb from "./ImageThumb";

import { IImage } from "yups";

type ImageThumbListProps = {
  swap: UseFieldArraySwap;
  remove: UseFieldArrayRemove;
  data: IImage[];
};

const ImageThumbList = ({ data, swap, remove }: ImageThumbListProps) => {
  const onChangePositionHandler = useCallback((dragIndex: number, hoverIndex: number) => {
    swap(dragIndex, hoverIndex);
  }, []);

  return (
    <Stack columnGap={3} flexDirection="row">
      <DndProvider backend={HTML5Backend}>
        <ImageList
          cols={5}
          gap={16}
          sx={{
            overflowY: "hidden",
          }}
        >
          {data.map((el, idx) => {
            const {} = el;
            return (
              <ImageThumb
                key={el.formId}
                data={{ ...el, idx }}
                onRemoveHandler={() => {
                  remove(idx);
                }}
                onChangePositionHandler={onChangePositionHandler}
              />
            );
          })}
        </ImageList>
      </DndProvider>
    </Stack>
  );
};

export default ImageThumbList;
