import { useIntl } from "react-intl";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useMountedState } from "react-use";

import { PrimaryAddress } from "interfaces";
import { convertValueToTupleForAddress } from "libs";

import { FormControlBase } from "compositions";
import { FormControlForPhoneNumber } from "components";

interface ViewAddressProps {
  data?: PrimaryAddress;
}

const ViewAddress = (props: ViewAddressProps) => {
  const { data } = props;
  const { messages } = useIntl();

  const [displayAddress, setDisplayAddress] = useState<string[]>([]);

  const isMounted = useMountedState();

  useEffect(() => {
    if (data == undefined) return;

    convertValueToTupleForAddress(data).then((resData) => {
      if (resData && isMounted()) {
        const { province, district, ward } = resData;

        setDisplayAddress([province[1], district[1], ward[1]]);
      }
    });
  }, [data]);

  if (data == undefined) return null;

  const { line1, phone_number, notes } = data;

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={6}>
        <FormControlBase
          FormLabelProps={{ children: "Tỉnh/Thành" }}
          InputProps={{
            readOnly: true,
            placeholder: "Tỉnh/Thành",
            value: displayAddress[0],
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlBase
          FormLabelProps={{ children: "Quận/Huyện" }}
          InputProps={{
            readOnly: true,
            placeholder: "Quận/Huyện",
            value: displayAddress[1],
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlBase
          FormLabelProps={{ children: "Phường/Xã" }}
          InputProps={{
            readOnly: true,
            placeholder: "Phường/Xã",
            value: displayAddress[2],
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlBase
          FormLabelProps={{ children: messages["address"] as string }}
          InputProps={{
            value: line1,
            readOnly: true,
            placeholder: messages["address"] as string,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlForPhoneNumber
          {...{
            label: messages["phoneNumber"] as string,
            placeholder: messages["phoneNumber"] as string,
            value: phone_number,
            InputProps: {
              readOnly: true,
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlBase
          FormLabelProps={{ children: messages["note"] as string }}
          InputProps={{
            placeholder: messages["note"] as string,
            multiline: true,
            rows: 5,
            sx: {
              padding: 1,
            },
            readOnly: true,
            value: notes,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ViewAddress;
