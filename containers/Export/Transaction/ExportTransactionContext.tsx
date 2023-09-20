import { useMutation } from "hooks";
import { createContext } from "react";

export const ExportTransactionContext = createContext({
  state: {
    mutateExportTransaction: async () => {},
  },
  set: (obj: object) => {},
});

const ExportTransaction = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useMutation({
    mutateExportTransaction: async () => {},
  });

  return (
    <ExportTransactionContext.Provider value={contextValue}>
      {children}
    </ExportTransactionContext.Provider>
  );
};

export default ExportTransaction;
