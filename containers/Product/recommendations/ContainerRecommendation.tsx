import React, { Fragment } from "react";

import { Card } from "components";
import AddProduct from "./AddProduct";
import RecommendationList from "./RecommendationList";
import RecommendationProvider from "./context/RecommendationContext";

export default function RecommendationContainer() {
  return (
    <Fragment>
      <RecommendationProvider>
        <Card
          cardTitleComponent={() => {
            return <AddProduct />;
          }}
          cardBodyComponent={() => {
            return <RecommendationList />;
          }}
        />
      </RecommendationProvider>
    </Fragment>
  );
}
