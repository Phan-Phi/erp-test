import useSWR from "swr";
import axios from "axios";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState, useEffect, useCallback } from "react";

import { get, set, isEmpty, cloneDeep, unset } from "libs";
import { createNotistackMessage } from "libs/utils";
import { Box, Grid, Stack } from "@mui/material";

import { PRODUCTS, VARIANT, IMAGE } from "routes";

import { LoadingButton, Image, Card, BackButton, Input } from "components";

import DynamicMessage from "messages";

const PRODUCT_IMAGE_URL = process.env.NEXT_PUBLIC_PRODUCT_IMAGE_URL;

const EditImage = () => {
  const router = useRouter();
  const { formatMessage, messages } = useIntl();
  const [currentImg, setCurrentImg] = useState();
  const [alt, setAlt] = useState("");

  const [isChanged, setIsChanged] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { data: resImgList, mutate: mutateImgList } = useSWR(() => {
    if (router.query.variantId) {
      return `${PRODUCT_IMAGE_URL}?product=${router.query.variantId}&get_all=true`;
    } else if (router.query.id) {
      return `${PRODUCT_IMAGE_URL}?product=${router.query.id}&get_all=true`;
    } else {
      return null;
    }
  });

  const altHandler = useCallback(
    (e) => {
      const newVal = e.target.value;

      setAlt(newVal);

      if (newVal === currentImg.alt) {
        setIsChanged(false);
      } else {
        setIsChanged(true);
      }
    },
    [currentImg]
  );

  const saveHandler = useCallback((currentImg, alt) => {
    return async (e) => {
      setLoading(true);
      try {
        let cloneData = cloneDeep(currentImg);
        set(cloneData, "alt", alt);
        unset(cloneData, "image");
        unset(cloneData, "product");

        let { data: resData } = await axios.patch(PRODUCT_IMAGE_URL, cloneData);

        if (resData.status === "success") {
          enqueueSnackbar(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "hình ảnh",
            }),
            {
              variant: "success",
            }
          );

          mutateImgList();
        } else {
          enqueueSnackbar(resData.message, {
            variant: "error",
          });
        }
      } catch (err) {
        createNotistackMessage(err.message, enqueueSnackbar);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  const changeImgHandler = useCallback(
    (newTarget) => {
      return () => {
        setCurrentImg(newTarget);

        if (router.query.variantId) {
          router.replace(
            `/${PRODUCTS}/${router.query.id}/${VARIANT}/${router.query.variantId}/${IMAGE}/${newTarget.id}`
          );
        } else {
          router.replace(`/${PRODUCTS}/${router.query.id}/${IMAGE}/${newTarget.id}`);
        }
      };
    },
    [router.query]
  );

  const backHandler = useCallback((query) => {
    return () => {
      if (query.variantId) {
        router.push(
          `/${PRODUCTS}/${router.query.id}/${VARIANT}/${router.query.variantId}`
        );
      } else {
        router.push(`/${PRODUCTS}/${router.query.id}`);
      }
    };
  }, []);

  useEffect(() => {
    let imgList = get(resImgList, "data");

    if ((router.query.imageId || router.query.variantImageId) && !isEmpty(imgList)) {
      let id = router.query.imageId || router.query.variantImageId;

      let idx = imgList.findIndex((el) => {
        return id == el.id;
      });

      if (idx > -1) {
        setCurrentImg(imgList[idx]);
        setAlt(imgList[idx].alt || "");
      }
    }
  }, [router.query.imageId, router.query.variantImageId, get(resImgList, "data")]);

  return (
    <Grid container spacing={3} marginBottom={3}>
      <Grid item xs={4}>
        <Card
          title={messages["allImage"]}
          body={
            <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
              {!isEmpty(resImgList) &&
                get(resImgList, "data").map((el) => {
                  return (
                    <Box
                      key={el.id}
                      onClick={changeImgHandler(el)}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <Image
                        src={get(el, "image.product_small_2x")}
                        height="64px"
                        alt={el.alt}
                      />
                    </Box>
                  );
                })}
            </Box>
          }
        />

        <Card
          title={messages["imageInfo"]}
          cardBodyComponent={() => {
            return (
              !isEmpty(currentImg) && (
                <Input
                  {...{
                    InputLabelProps: {
                      children: messages["description"],
                    },
                    InputProps: {
                      value: alt,
                      onChange: altHandler,
                    },
                  }}
                />
              )
            );
          }}
        />
      </Grid>

      <Grid item xs={8}>
        <Card
          title={messages["image"]}
          cardBodyComponent={() => {
            return (
              !isEmpty(currentImg) && (
                <Image
                  src={get(currentImg, "image.product_gallery")}
                  width="100%"
                  height="400px"
                />
              )
            );
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <BackButton onClick={backHandler(router.query)} />

          <LoadingButton
            loading={loading}
            disabled={!isChanged}
            onClick={saveHandler(currentImg, alt)}
          >
            {loading ? messages["updatingStatus"] : messages["updateStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditImage;
