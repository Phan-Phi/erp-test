import useSWR from "swr";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { Grid, Stack, ImageListItem, ImageList, Box } from "@mui/material";

import {
  Dialog,
  LoadingButton,
  BackButton,
  Image,
  LoadingDynamic as Loading,
} from "components";

import { PRODUCT_IMAGE } from "apis";
import { transformUrl } from "libs";

import findIndex from "lodash/findIndex";

import { VariantImageSchemaProps } from "yups";

type ImageDialogProps = {
  open: boolean;
  toggle: (nextValue?: boolean) => void;
  selectedImageList: VariantImageSchemaProps["images"];
  loading: boolean;
  selectImageHandler: (data: PRODUCT_IMAGE_ITEM) => () => void;
  updateHandler: () => void;
};

import { PRODUCT_IMAGE_ITEM } from "interfaces";

const ImageDialog = ({
  open,
  toggle,
  selectedImageList,
  loading,
  selectImageHandler,
  updateHandler,
}: ImageDialogProps) => {
  const router = useRouter();

  const { data: productImageData } = useSWR<PRODUCT_IMAGE_ITEM[]>(() => {
    const productId = router.query.id;

    if (productId) {
      return transformUrl(PRODUCT_IMAGE, {
        product: productId,
        get_all: true,
      });
    }
  });

  const { messages } = useIntl();

  if (productImageData == undefined) {
    return <Loading />;
  }

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          if (loading) {
            return;
          }

          toggle(false);
        },

        DialogProps: {
          PaperProps: {
            sx: {
              maxWidth: "75vw",
            },
          },
        },

        DialogTitleProps: {
          children: messages["imageStock"],
        },
        dialogContentTextComponent: () => {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack columnGap={2} flexDirection="row">
                  <ImageList cols={4} gap={16}>
                    {productImageData.map((el) => {
                      const idx = findIndex(selectedImageList, {
                        id: el.id,
                      });

                      return (
                        <ImageListItem
                          sx={{
                            position: "relative",
                            width: "150px",
                            height: "150px !important",

                            "&:hover": {
                              cursor: "pointer",
                            },
                          }}
                          onClick={selectImageHandler(el)}
                          key={el.id}
                        >
                          <Image src={el.image.product_list} width="100%" height="100%" />
                          {idx > -1 && (
                            <Box
                              sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                zIndex: "5",
                                border: (theme) => {
                                  return `3px solid ${theme.palette.primary2.light}`;
                                },
                              }}
                            ></Box>
                          )}
                        </ImageListItem>
                      );
                    })}
                  </ImageList>
                </Stack>
              </Grid>
            </Grid>
          );
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                disabled={loading}
                onClick={() => {
                  toggle(false);
                }}
              />

              <LoadingButton loading={loading} disabled={loading} onClick={updateHandler}>
                {loading ? messages["updatingStatus"] : messages["updateStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
};

export default ImageDialog;
