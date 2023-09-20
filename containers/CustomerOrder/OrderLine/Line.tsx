import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { createContext } from "react";

import { Stack, Typography, Button } from "@mui/material";

import { usePermission, useMutation } from "hooks";
import { Card, LoadingDynamic as Loading } from "components";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

const CreateLineDialog = dynamic(() => import("./CreateLineDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const LineList = dynamic(() => import("./LineList"), {
  loading: () => {
    return <Loading />;
  },
});

// * CONTEXT

export const OrderLineContext = createContext({
  state: {
    mutateLineList: async () => {},
  },
  set: (obj: object) => {},
});

const Line = () => {
  const contextValue = useMutation({
    mutateLineList: async () => {},
  });

  const { hasPermission: writePermission } = usePermission("write_order");

  const { messages } = useIntl();

  const [open, toggle] = useToggle(false);
  const [openPrintNote, togglePrintNote] = useToggle(false);

  return (
    <OrderLineContext.Provider value={contextValue}>
      <Card
        cardTitleComponent={() => {
          return (
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="700">{messages["listingProduct"]}</Typography>

              <Stack flexDirection="row" columnGap={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    togglePrintNote(true);
                  }}
                >
                  {messages["printNote"]}
                </Button>

                {writePermission && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      toggle(true);
                    }}
                  >
                    {messages["addProduct"]}
                  </Button>
                )}
              </Stack>
            </Stack>
          );
        }}
        body={<LineList />}
      />
      <CreateLineDialog
        {...{
          open,
          toggle,
        }}
      />
      <PrintNote
        {...{
          open: openPrintNote,
          toggle: togglePrintNote,
          type: "ORDER",
        }}
      />
    </OrderLineContext.Provider>
  );
};

export default Line;
