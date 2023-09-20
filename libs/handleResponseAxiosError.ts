import Router from "next/router";
import { get, pick } from "lodash";
import axios, { AxiosError, AxiosResponse } from "axios";

import axiosInstance from "axios.config";

import { VERIFY_TOKEN } from "apis";

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

interface IBody {
  csrf_token: string;
  refresh_token: string;
  email: string;
  token: string;
  refresh_token_expire: string;
}

const handleResponseAxiosError = async (
  err: AxiosError<{ message: string }>,
  signIn: typeof nextAuthSignIn,
  signOut: typeof nextAuthSignOut
): Promise<void> => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;

    if (status === 403) {
      axios
        .get("/api/refresh-token")
        .then(async (res: AxiosResponse<IBody | string | null>) => {
          const { data } = res;

          if (data) {
            let body: IBody = {} as IBody;

            if (typeof data === "string") {
              body = pick(JSON.parse(data), [
                "csrf_token",
                "refresh_token",
                "email",
                "token",
                "refresh_token_expire",
              ]);
            }

            if (typeof data === "object") {
              body = pick(data, [
                "csrf_token",
                "refresh_token",
                "email",
                "token",
                "refresh_token_expire",
              ]);
            }

            const token: string = get(data, "token");

            //* 2 SCENARIO

            axiosInstance
              .post(VERIFY_TOKEN, {
                token,
              })
              .then(({ status }) => {
                //* 1: VALID TOKEN => CAUSE: DONT HAVE PERMISSION

                Router.push("/");
              })
              .catch(async (err) => {
                //* 2: UNVALID TOKEN

                const refreshTokenExpire = get(body, "refresh_token_expire");

                //* 2.1 REFRESH TOKEN VALID

                if (refreshTokenExpire === "false") {
                  await signIn("refresh-token", {
                    redirect: false,
                    ...body,
                  });

                  return;
                }

                //* 2.2 REFRESH TOKEN EXPIRE

                await signOut();
              });

            //* 3: UNAUTHORIZATION
          }
        })
        .catch(async (err) => {
          await signOut();
        });
    }
  }

  throw err;
};

export { handleResponseAxiosError };
