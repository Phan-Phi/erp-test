import { useMutation } from "hooks";
import { createContext } from "react";

export const ExportInvoiceContext = createContext({
  state: {
    mutateExportInvoice: async () => {},
  },
  set: (obj: object) => {},
});

const ExportInvoice = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useMutation({
    mutateExportInvoice: async () => {},
  });

  return (
    <ExportInvoiceContext.Provider value={contextValue}>
      {children}
    </ExportInvoiceContext.Provider>
  );
};

export default ExportInvoice;
