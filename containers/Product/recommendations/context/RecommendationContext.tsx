import { createContext, useState } from "react";

type RecommendationProps = {
  updateData: { mutate: any };
  setUpdateData: any;
  rank: number;
  setRank: (n: number) => void;
};

const defaultState = {
  updateData: { mutate: async () => {} },
  setUpdateData: (obj: object) => {},
  rank: 0,
  setRank: () => {},
};

export const RecommendationContext = createContext<RecommendationProps>(defaultState);

function RecommendationProvider({ children }: { children: React.ReactNode }) {
  const [updateData, setUpdateData] = useState({
    mutate: () => {},
  });
  const [rank, setRank] = useState(0);

  const values = {
    updateData,
    setUpdateData,
    rank,
    setRank,
  };

  return (
    <RecommendationContext.Provider value={values}>
      {children}
    </RecommendationContext.Provider>
  );
}

export default RecommendationProvider;
