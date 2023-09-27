import { useContext } from "react";
import { RecommendationContext } from "./RecommendationContext";

function useRecommendation() {
  const context = useContext(RecommendationContext);

  if (typeof context === undefined)
    throw new Error("useRecommendation must be used within RecommendationProvider");

  return context;
}

export default useRecommendation;
