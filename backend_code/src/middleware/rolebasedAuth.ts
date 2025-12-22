import { NextFunction, Response } from "express";
import { IExtendRequest } from "../global/type";
import { MSG } from "../constant/statusRes";

export const roleBasedAuth = (allowedRole: string[]) => {
  return (req: IExtendRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    // 1. No user
    if (!user) {
      return res.status(401).json({
        message: `${MSG.AUTH_REQUIRED} - No user found`
      });
    }

    // 2. No role in user
    if (!user.role) {
      return res.status(401).json({
        message: `${MSG.AUTH_REQUIRED} - No role in user`
      });
    }

    // 3. User role not allowed
    if (!allowedRole.includes(user.role)) {
      return res.status(403).json({
        message: MSG.ACCESS_DENIED
      });
    }

    next();
  };
};
