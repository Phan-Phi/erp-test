import { getToken } from "next-auth/jwt";
import type { NextApiRequest, NextApiResponse } from "next";

const refreshTokenRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  try {
    if (token) {
      res.status(200).json(token);
    } else {
      res.status(401).send(null);
    }
  } catch (err) {
    res.status(500).send({
      error: "Có lỗi xảy ra",
    });
  }
};

export default refreshTokenRoute;
