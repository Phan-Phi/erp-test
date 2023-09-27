import { Session } from "next-auth";
import { type AppProps } from "next/app";
import { IntlProvider } from "react-intl";
import { SessionProvider } from "next-auth/react";
import { CacheProvider, type EmotionCache } from "@emotion/react";

import {
  SWR,
  User,
  Head,
  Theme,
  Choice,
  Setting,
  Snackbar,
  Permission,
  Confirmation,
  ErrorBoundary,
  Layout as LayoutProvider,
} from "contexts";

import { useTranslate } from "hooks";
import createEmotionCache from "libs/createEmotionCache";

import Layout from "Layout/Layout";

import "styles/custom.css";
import "styles/preloader.min.css";
import "styles/react-phone-number-input.css";
import "node_modules/nprogress/nprogress.css";
import { Box } from "@mui/material";

const clientSideEmotionCache = createEmotionCache();

interface PageProps {
  session: Session;
  [key: string]: any;
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: PageProps;
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { messages, defaultLocale, locale } = useTranslate();
  const { session, ...restPageProps } = pageProps;
  // return <Box></Box>;
  return (
    <SessionProvider session={session}>
      <IntlProvider
        locale={locale ?? "vi"}
        defaultLocale={defaultLocale}
        messages={messages}
      >
        <CacheProvider value={emotionCache}>
          <Theme>
            <Snackbar>
              <ErrorBoundary>
                <SWR fallback={pageProps.fallback}>
                  <Permission>
                    <User>
                      <Setting>
                        <Head />
                        <Choice>
                          <Confirmation>
                            <LayoutProvider>
                              <Layout>
                                <Component {...restPageProps} />
                              </Layout>
                            </LayoutProvider>
                          </Confirmation>
                        </Choice>
                      </Setting>
                    </User>
                  </Permission>
                </SWR>
              </ErrorBoundary>
            </Snackbar>
          </Theme>
        </CacheProvider>
      </IntlProvider>
    </SessionProvider>
  );
}

export default MyApp;
