import { SWRConfig } from "swr";
import { useSession } from "next-auth/react";

import axios from "axios.config";

const SWR = ({ children }) => {
  const { status } = useSession();

  if (status === "loading") return null;

  return (
    <SWRConfig
      value={{
        refreshInterval: 30000,
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnMount: true,
        revalidateOnReconnect: true,
        fetcher: async (resource) => {
          return axios
            .get(resource)
            .then(async (res) => {
              return res.data;
            })
            .catch((err) => {
              throw err;
            });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWR;
