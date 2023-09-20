import { useMutation } from "hooks";
import { createContext } from "react";

export const ExportDebtRecordContext = createContext({
  state: {
    mutateExportDebtRecord: async () => {},
  },
  set: (obj: object) => {},
});

const ExportDebtRecord = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useMutation({
    mutateExportDebtRecord: async () => {},
  });

  return (
    <ExportDebtRecordContext.Provider value={contextValue}>
      {children}
    </ExportDebtRecordContext.Provider>
  );
};

export default ExportDebtRecord;
