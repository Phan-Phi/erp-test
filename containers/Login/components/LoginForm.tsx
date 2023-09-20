import { Stack } from "@mui/material";

import { useIntl } from "react-intl";

import { FormControl, FormControlForPassword } from "components";

const LoginForm = ({ control }) => {
  const { messages } = useIntl();

  return (
    <Stack spacing={2}>
      <FormControl
        {...{
          name: "username",
          control,
          label: messages["username"] as string,
          placeholder: messages["username"] as string,
        }}
      />
      <FormControlForPassword
        {...{
          control,
          name: "password",
          label: messages["password"] as string,
          placeholder: messages["password"] as string,
        }}
      />
    </Stack>
  );
};

export default LoginForm;
