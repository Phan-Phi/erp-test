import { useSession } from "next-auth/react";

import Home from "containers/Home/Home";

const MainPage = () => {
  const { data: session } = useSession();

  const isDefault = session?.user?.login_as_default;
  console.log(process.env.NEXT_PUBLIC_ENV);

  if (isDefault) return null;

  return <Home />;
};

export default MainPage;
