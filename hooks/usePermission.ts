import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useMemo } from "react";

import { PermissionContext } from "contexts";
import { USERS, CHANGE_PASSWORD } from "routes";

import type { PERMISSION_TYPE } from "contexts";

interface IUserPermission {
  codename?: PERMISSION_TYPE;
  isRedirect?: boolean;
}

export const usePermission = (codename?: PERMISSION_TYPE) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { appPermission, userPermission } = useContext(PermissionContext);

  const hasPermission = useMemo(() => {
    if (codename == undefined) return undefined;

    return userPermission.includes(codename);
  }, [codename, userPermission]);

  // useEffect(() => {
  //   if (session == undefined) {
  //     return;
  //   }

  //   const loginAsDefault = session.user.login_as_default;

  //   if (loginAsDefault) {
  //     const pathname = `/${USERS}/${CHANGE_PASSWORD}`;

  //     router.push(pathname);

  //     return;
  //   }

  //   if (hasPermission === false && isRedirect) {
  //     router.push("/", "/", { shallow: true });
  //   }
  // }, [hasPermission, isRedirect, session]);

  return { userPermission, appPermission, hasPermission };
};
