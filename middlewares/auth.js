import nextConnect from "next-connect";
import axios from "axios";
import { getToken } from "next-auth/jwt";

import get from "lodash/get";

const secret = process.env.SECRET;

const auth = nextConnect().use(async (req, res, next) => {
  const tokenObj = await getToken({ req, secret });

  const instance = axios.create({});

  if (tokenObj) {
    const token = get(tokenObj, "token");
    instance.defaults.headers.Authorization = `JWT ${token}`;
  }

  req.axios = instance;

  next();
});

export default auth;
