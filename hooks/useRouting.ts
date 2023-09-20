import NProgress from "nprogress";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { useSession } from "next-auth/react";

import { USERS, CHANGE_PASSWORD } from "routes";

const customSpinner = `<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-route">
<div class="rect1"></div>
<div class="rect2"></div>
<div class="rect3"></div>
<div class="rect4"></div>
<div class="rect5"></div>
</div></div>`;

export const useRouting = ({ loading, setLoading }) => {
  const router = useRouter();
  const isMounted = useMountedState();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session && session.user.login_as_default) {
      const pathname = `/${USERS}/${CHANGE_PASSWORD}`;
      router.replace(pathname);
    }
  }, [status]);

  const [previousUrl, setPreviousUrl] = useState("/");

  useEffect(() => {
    const handleRouteChange = (url: any, { shallow }: { shallow: any }) => {
      const [pathname] = url.split("?");

      if (!shallow) {
        if (isMounted()) {
          setLoading(true);
        }
      }

      if (pathname !== previousUrl) {
        setPreviousUrl(pathname);
        NProgress.configure({
          template: customSpinner,
        });

        NProgress.start();
      } else {
        NProgress.configure({
          template: customSpinner,
        });
        NProgress.start();
      }
    };

    const handleRouteComplete = () => {
      NProgress.done();

      if (isMounted()) {
        setLoading(false);
      }
    };

    router.events.on("routeChangeStart", handleRouteComplete);
    router.events.on("routeChangeComplete", handleRouteComplete);
    router.events.on("routeChangeError", handleRouteComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteComplete);
      router.events.off("routeChangeError", handleRouteComplete);
    };
  }, [previousUrl, loading]);
};
