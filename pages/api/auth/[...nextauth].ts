import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import { addDays, formatISO, parseISO, compareAsc } from "date-fns";

import get from "lodash/get";
import set from "lodash/set";

import originalAxios from "axios";

import { LOGIN, REFRESH_TOKEN } from "apis";
import axios from "../../../axios.config";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "sign-in",
      credentials: {},
      async authorize(credentials) {
        const username = get(credentials, "username");
        const password = get(credentials, "password");

        try {
          const { data } = await axios.post(LOGIN, {
            username,
            password,
          });

          return {
            ...data,
            email: username,
          };
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (compareAsc(new Date(), parseISO(token.expire)) === 1) {
          const { refresh_token, csrf_token, token: _token } = token;

          const { data } = await axios.post(
            REFRESH_TOKEN,
            {
              refresh_token,
              csrf_token,
            },
            {
              headers: {
                Authorization: _token,
              },
            }
          );
          user = data;
        }

        if (!user) return token;

        const {
          token: _token,
          email,
          csrf_token,
          refresh_token,
          login_as_default,
        } = user;

        set(token, "token", _token);
        if (email != undefined) set(token, "email", email);
        if (refresh_token != undefined) set(token, "refresh_token", refresh_token);
        if (csrf_token != undefined) set(token, "csrf_token", csrf_token);
        if (login_as_default != undefined)
          set(token, "login_as_default", login_as_default);
        set(token, "expire", formatISO(addDays(new Date(), 1)));
        set(token, "shouldReLogin", false);

        return token;
      } catch (err) {
        if (originalAxios.isAxiosError(err)) {
          const statusCode = err.response?.status;

          if (statusCode === 401) {
            set(token, "shouldReLogin", true);
          }
        }

        return token;
      }
    },
    async session({ session, token }) {
      const _token = get(token, "token");
      const shouldReLogin = get(token, "shouldReLogin");
      const login_as_default = get(token, "login_as_default");

      set(session, "user.token", _token);
      set(session, "user.shouldReLogin", shouldReLogin);
      set(session, "user.login_as_default", login_as_default);

      return session;
    },
  },
});
