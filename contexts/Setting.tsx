import useSWR from "swr";
import { useSession } from "next-auth/react";
import { createContext, useMemo } from "react";

import { SETTING } from "apis";
import { transformUrl } from "libs";
import { SETTING_ITEM } from "interfaces";

export const SettingContext = createContext<SETTING_ITEM>({} as SETTING_ITEM);

const Setting = ({ children }: { children: React.ReactNode }) => {
  const { status, data: session } = useSession();

  const { data: settingData } = useSWR<SETTING_ITEM>(
    () => {
      if (status !== "authenticated" || (session && session.user.login_as_default))
        return;

      return transformUrl(SETTING, {
        use_cache: false,
      });
    },
    {
      refreshInterval: 120 * 1000,
    }
  );

  const contextValue = useMemo(() => {
    if (settingData == undefined) return {} as SETTING_ITEM;

    return settingData;
  }, [settingData]);

  return (
    <SettingContext.Provider value={contextValue}>{children}</SettingContext.Provider>
  );
};

export default Setting;
