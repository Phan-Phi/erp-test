import useSWR from "swr";
import { useSession } from "next-auth/react";
import { createContext, useMemo } from "react";

import get from "lodash/get";

import { ME } from "apis";
import { ME_ITEM } from "interfaces";

export const UserContext = createContext<ME_ITEM>({} as ME_ITEM);

const User = ({ children }) => {
  const { status, data: session } = useSession();

  const { data: meData } = useSWR<ME_ITEM>(
    () => {
      if (status !== "authenticated" || get(session, "user.login_as_default")) return;
      return ME;
    },
    {
      refreshInterval: 120 * 1000,
    }
  );

  const contextValue = useMemo(() => {
    if (meData == undefined) {
      return {} as ME_ITEM;
    } else {
      return meData;
    }
  }, [meData]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default User;
