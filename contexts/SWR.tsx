import { SWRConfig } from "swr";
import { signOut, useSession } from "next-auth/react";

import axios from "axios.config";
import { useEffect } from "react";

type SWRProps = {
  children: React.ReactNode;
  fallback?: { [key: string]: any };
};

const SWR = ({ children, fallback }: SWRProps) => {
  const { status, data } = useSession();

  useEffect(() => {
    if (data == null) return;

    const { user } = data;

    if (user.shouldReLogin) {
      signOut();
    }
  }, [data]);

  if (status === "loading") return null;

  return (
    <SWRConfig
      value={{
        fallback: fallback || {},
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
