import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Box, styled } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState, useContext } from "react";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { LayoutContext } from "contexts";
import { Loading, Container, LoadingDynamic } from "components";
import { useUser, useChoice, useRouting, useSetting } from "hooks";

const Login = dynamic(() => import("containers/Login/Login"), {
  loading: () => <LoadingDynamic />,
});

const Header = dynamic<{}>(
  () =>
    import("components/Header").then((mod) => {
      return mod.Header;
    }),
  { loading: () => <LoadingDynamic /> }
);

const Layout = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;

  const router = useRouter();
  const choice = useChoice();
  const userInfo = useUser();
  const setting = useSetting();

  const { status, data } = useSession();

  const [loading, setLoading] = useState(false);
  const layoutContext = useContext(LayoutContext);

  useRouting({
    loading,
    setLoading,
  });

  useEffect(() => {
    if (status === "unauthenticated" && !router.pathname.includes("login")) {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || isEmpty(choice)) {
    return (
      <StyledBox
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </StyledBox>
    );
  }

  if (status == "unauthenticated") {
    return (
      <StyledBox>
        <Login />
      </StyledBox>
    );
  }

  if ((isEmpty(setting) || isEmpty(userInfo)) && !get(data, "user.login_as_default")) {
    return <Loading />;
  }

  return (
    <StyledBox>
      <Header />
      <Container>
        <Box
          paddingTop={`${
            layoutContext.state.topbarHeight +
            layoutContext.state.extraHeight +
            layoutContext.state.navbarHeight
          }px`}
          paddingBottom={`${layoutContext.state.extraHeight}px`}
        >
          {children}
        </Box>
      </Container>
    </StyledBox>
  );
};

const StyledBox = styled(Box)(({ theme }) => {
  return {
    minHeight: "100vh",
    overflow: "hidden",
  };
});

export default Layout;
