import { NextFunction, Response } from "express";
import { IExtendRequest } from "../global/type";
import { HTTP, MSG } from "../constant/statusRes";
import { config } from "../config/config";
import jwt from "jsonwebtoken";
import User from "../model/User.Model";

class MiddlewareController {
  static async isLogined(req: IExtendRequest, res: Response, next: NextFunction) {
    try {
      let authToken: string | undefined = undefined;

      // 1. Check Authorization Header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        authToken = authHeader.split(" ")[1];
      }

      // 2. Fallback to cookie if no header token
      if (!authToken && req.headers.cookie) {
        const cookies = req.headers.cookie.split(";").map(c => c.trim());
        const tokenCookie = cookies.find(c => c.startsWith("authToken="));
        if (tokenCookie) {
          authToken = tokenCookie.split("=")[1];
        }
      }

      // 3. Still no token → unauthorized
      if (!authToken) {
        return res
          .status(HTTP.UNAUTHORIZED)
          .json({ message: `${MSG.UNAUTHORIZED} - Invalid Token` });
      }

      if (!config.jsonSecretKey) {
        return res
          .status(HTTP.UNAUTHORIZED)
          .json({ message: `${MSG.UNAUTHORIZED} - Missing Secret Key` });
      }

      // 4. Verify token
      jwt.verify(authToken, config.jsonSecretKey, async (err, decoded: any) => {
        if (err || !decoded) {
          return res
            .status(HTTP.UNAUTHORIZED)
            .json({ message: `${MSG.UNAUTHORIZED} - Invalid Token` });
        }

        // 5. Fetch user
        const user = await User.findByPk(decoded.id, {
          attributes: ["id", "name", "email", "contactNumber", "role", "status"],
        });

        if (!user) {
          return res
            .status(HTTP.UNAUTHORIZED)
            .json({ message: `${MSG.UNAUTHORIZED} - Invalid User` });
        }

        req.user = user.get({ plain: true });
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }
}

export default MiddlewareController;
