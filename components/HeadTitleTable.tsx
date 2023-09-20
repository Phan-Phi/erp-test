import { Typography, styled } from "@mui/material";

interface Props {
  value: string | number;
}

export default function HeadTitleTable(props: Props) {
  const { value } = props;
  return <Title>{value}</Title>;
}

const Title = styled(Typography)(() => {
  return {
    cursor: "pointer",
    color: "rgb(16,116,186)",
  };
});
