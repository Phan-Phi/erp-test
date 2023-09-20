import { styled } from "@mui/material";
import {
  Box,
  CardProps,
  Typography,
  CardContent,
  Card as MuiCard,
  CardHeaderProps,
  CardContentProps,
} from "@mui/material";

import { Divider } from "components";

interface ICardProps {
  CardProps?: CardProps;
  title?: CardHeaderProps["title"];
  CardHeaderProps?: Omit<CardHeaderProps, "title">;
  CardContentProps?: CardContentProps;
  CardBodyProps?: object;
  CardTitleProps?: object;
  body?: React.ReactNode;
  cardTitleComponent?: () => React.ReactNode;
  cardBodyComponent?: () => React.ReactNode;
  renderCardTitle?: () => React.ReactNode;
  renderCardBody?: () => React.ReactNode;
}

const Card = (props: ICardProps) => {
  let {
    CardProps,
    CardTitleProps,
    CardBodyProps,
    CardContentProps,
    CardHeaderProps,
    title,
    body,
    cardTitleComponent,
    cardBodyComponent,
    renderCardBody,
    renderCardTitle,
  } = props;

  let renderTitle: React.ReactNode = <StyledHeaderTitle>{title}</StyledHeaderTitle>;

  if (renderCardTitle && typeof renderCardTitle === "function") {
    renderTitle = renderCardTitle();
  }

  if (cardTitleComponent && typeof cardTitleComponent === "function") {
    renderTitle = cardTitleComponent();
  }

  let renderBody: React.ReactNode = body;

  if (renderCardBody && typeof renderCardBody === "function") {
    renderBody = renderCardBody();
  }

  if (cardBodyComponent && typeof cardBodyComponent === "function") {
    renderBody = cardBodyComponent();
  }

  return (
    <StyledMuiCard {...CardProps}>
      <StyledCardHeader {...CardHeaderProps} {...CardTitleProps}>
        {renderTitle}
      </StyledCardHeader>

      <Divider />
      <StyledCardContent {...CardBodyProps} {...CardContentProps}>
        {renderBody}
      </StyledCardContent>
    </StyledMuiCard>
  );
};

const StyledMuiCard = styled(MuiCard)({});

const StyledCardHeader = styled(Box)({
  padding: 16,
});

const StyledCardContent = styled(CardContent)({
  paddingTop: 24,
});

const StyledHeaderTitle = styled(Typography)(({ theme }) => {
  return {
    ...theme.typography.h6,
  };
});

export default Card;
