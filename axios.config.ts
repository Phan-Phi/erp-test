import axios from "axios";
import { getSession } from "next-auth/react";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DOMAIN_NAME,
});

instance.interceptors.request.use(
  async function (config) {
    const session = await getSession();

    if (session) {
      const { user } = session;

      const token = user.token;

      if (!config?.headers?.Authorization && config.headers) {
        config.headers.Authorization = `JWT ${token}`;
      }
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err) {
    // const message = get(err, "response.data.message");

    // if (!message.includes("Invalid page")) {
    //   typeof instance.enqueueSnackbar === "function" &&
    //     instance.enqueueSnackbar(message, { variant: "error" });
    // }

    return Promise.reject(err);
  }
);

export default instance;
