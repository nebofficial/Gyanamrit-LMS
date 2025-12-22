import { NextFunction, Request, Response } from "express";
import { MSG, STATUS } from "../../constant/statusRes";
import userService from "../../service/user/user.service";
import { IExtendRequest } from "../../global/type";

class UserController {
  // add User
  static async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, contactNumber, role } = req.body;

      if (!name || !email || !contactNumber || !role) {
        res.status(404).json({ message: MSG.REQUIRED_FIELDS });
        return;
      }

      await userService.addUser(req.body);
      res
        .status(201)
        .json({ status: STATUS.SUCCESS, message: `User ${MSG.ADD_SUCCESS}` });
    } catch (error) {
      next(error);
    }
  }

  // getAllUser
  static async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.getAllUser();
      if (data.length === 0) {
        res.status(200).json([]);
        return;
      }
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `All User ${MSG.FETCH_SUCCESS}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // getSingleUserData
  static async getSingleUserData(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(404).json({ message: "User ID is required" });
        return;
      }
      const data = await userService.getSingleUserData(userId);
      if (!data) {
        res.status(400).json({ message: "No User Data found" });
        return;
      }
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `${userId} User Data ${MSG.FETCH_SUCCESS} `,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // getOwnData
  static async getOwnData(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: MSG.UNAUTHORIZED });
        return;
      }
      const data = await userService.getOwnData(userId);
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Own Data ${MSG.FETCH_SUCCESS}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // deleteUser
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const user = await userService.getSingleUserData(userId);
      if (!user) {
        res.status(404).json({ message: "User not exist" });
        return;
      }
      await userService.deleteUser(userId);
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `User ${MSG.DELETE_SUCCESS}`,
      });
    } catch (error) {
      next(error);
    }
  }

  // updateUserStatus
  static async updateUserStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { status, role } = req.body;
      const { userId } = req.params;
      const user = await userService.getSingleUserData(userId);
      if (!user) {
        res.status(404).json({ message: "User not exist" });
        return;
      }

      await userService.updateUserStatus(req.body, userId);
      res
        .status(200)
        .json({
          status: STATUS.SUCCESS,
          message: `User Status ${MSG.UPDATE_SUCCESS}`,
        });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
