import NextAuth, { DefaultProfile } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultProfile {
    user: {
      token: string;
      refresh_token_expire: boolean;
      login_as_default: boolean;
      shouldReLogin: boolean;
    };
  }

  interface User {
    token: string;
    refresh_token: string;
    csrf_token: string;
    login_as_default: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    expire: string;
    csrf_token: string;
    refresh_token: string;
    shouldReLogin: boolean;
  }
}
