import { useEffect } from "react";
import { signOut } from "next-auth/react";

const LogoutPage = () => {
  useEffect(() => {
    (async () => {
      await signOut({
        redirect: false,
      });
    })();
  }, []);

  return null;
};

export default LogoutPage;
