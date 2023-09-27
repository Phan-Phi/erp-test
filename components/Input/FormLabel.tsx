import { styled, FormLabel as MuiFormLabel, FormLabelProps } from "@mui/material";

export const FormLabel = (props: FormLabelProps) => {
  return <StyledFormLabel {...props} />;
};

const StyledFormLabel = styled(MuiFormLabel)(({ theme }) => {
  return {
    fontWeight: 700,
    paddingBottom: 4,
  };
});
