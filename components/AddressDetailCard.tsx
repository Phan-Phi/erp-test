import { Fragment } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

import { get, isEmpty } from "lodash";
import { Box, Typography, Stack, useTheme } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

import { formatPhoneNumber } from "libs";
import { NoData, IconButtonBackground, Link } from "components";

interface AddressDetailProps {
  data: any[];
  deleteAddressHandler?: (id: number) => void;
  updateAddressHandler?: (value: any) => void;
  deleteLoading?: object;
  writePermission?: boolean;
}

export const AddressDetail = ({
  data,
  deleteAddressHandler,
  updateAddressHandler,
  deleteLoading,
  writePermission = false,
}: AddressDetailProps) => {
  const theme = useTheme();
  const router = useRouter();
  const { messages } = useIntl();

  if (isEmpty(data)) return <NoData />;

  return (
    <Fragment>
      {data.map((el) => {
        return (
          <Stack
            flexDirection="row"
            columnGap={1}
            justifyContent="space-between"
            alignItems="center"
            key={el.id}
            sx={{
              backgroundColor: "background.paper",
            }}
          >
            <Box
              sx={{
                fontSize: "14px",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {el.is_default_for_shipping && (
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: "13px",
                      marginLeft: 1,
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 0,
                    }}
                  >
                    <CheckIcon
                      sx={{
                        marginRight: "0.25rem",
                      }}
                    />

                    {messages["defaultShippingAddress"]}
                  </Typography>
                )}
              </Typography>

              <Typography
                gutterBottom
                sx={{
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {el.is_default_for_billing && (
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: "13px",
                      marginLeft: 1,
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 0,
                    }}
                  >
                    <CheckIcon
                      sx={{
                        marginRight: "0.25rem",
                      }}
                    />
                    {messages["defaultBillingAddress"]}
                  </Typography>
                )}
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["address"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "line1", "-")}
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["ward"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "ward.[1]", "-")}
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["district"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "district.[1]", "-")}
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["province"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "province.[1]", "-")}
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["phoneNumber"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  <Link href={`tel:${el.phone_number}`}>
                    {formatPhoneNumber(el.phone_number)}
                  </Link>
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["note"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "notes") || "-"}
                </Typography>
              </Typography>
            </Box>
            {(router.query.draft || router.query?.ids?.[0]) && writePermission && (
              <Stack spacing={2}>
                <IconButtonBackground
                  children={<DeleteIcon />}
                  sx={{
                    backgroundColor: "error.main",
                    "&:hover": {
                      backgroundColor: "error.main",
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => {
                    if (el.id) {
                      deleteAddressHandler?.(el.id);
                    }
                  }}
                  loading={el?.id ? deleteLoading?.[el.id] : false}
                />

                <IconButtonBackground
                  children={<EditIcon />}
                  onClick={() => {
                    updateAddressHandler?.(el);
                  }}
                />
              </Stack>
            )}
          </Stack>
        );
      })}
    </Fragment>
  );
};
