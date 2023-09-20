import { useCallback, useState } from "react";

import { useSnackbar } from "notistack";


import axios from "axios";

export const useNotification = () => {
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const enqueueSnackbarWithSuccess = useCallback((message: string) => {
    enqueueSnackbar(message, {
      variant: "success",
    });
  }, []);

  const enqueueSnackbarWithError = useCallback((err: unknown) => {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message;

      if (message) {
        enqueueSnackbar(message, {
          variant: "error",
        });
      }
    }

    // if (err instanceof Error) {
    //   console.log(err);
    // }
  }, []);

  return {
    loading,
    setLoading,
    enqueueSnackbar,
    closeSnackbar,
    enqueueSnackbarWithSuccess,
    enqueueSnackbarWithError,
  };
};
