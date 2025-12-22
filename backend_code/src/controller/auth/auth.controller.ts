import { Request, Response } from "express";
import { HTTP, MSG, STATUS } from "../../constant/statusRes";
import { PASSWORD_REGEX } from "../../constant/regex";
import { createUserSchema } from "../../validation/schema";
import authService from "../../service/auth/auth.service";
import signToken from "../../utils/jwt";
import { IUser } from "../../global/type";

class AuthController {
  // Login User
  static async signupUser(req: Request, res: Response) {
    const { name, email, password, confirmPassword } = req.body;
    // validation
    if (!name || !email || !password || !confirmPassword) {
      res.status(HTTP.NOT_FOUND).json({ message: MSG.REQUIRED_FIELDS });
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      res.status(HTTP.BAD_REQUEST).json({ message: MSG.PASSWORD_REGEX_ERROR });
      return;
    }
    if (password != confirmPassword) {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ message: MSG.CONFIRM_PASSWORD_NOT_MATCH });
      return;
    }
    // Zod Validaton
    const zodValidation = createUserSchema.safeParse(req.body);
    if (!zodValidation.success) {
      res.status(HTTP.BAD_REQUEST).json({
        status: STATUS.FAIL,
        message: MSG.INVALID_DATA,
        errors: zodValidation.error,
      });
      return;
    }

    const data = await authService.signupUser(req.body);
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: MSG.REGISTER_SUCCESS,
      data: data,
    });
  }

  // verification token
  static async verificationToken(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      res.status(404).json({ message: "Email address is required" });
      return;
    }

    await authService.verificationToken(req.body);
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: "Account Verification link sent in your Mail",
    });
  }

  // verify token
  static async verifyToken(req: Request, res: Response) {
    const { email, token } = req.params;

    await authService.verifyToken(email, token);
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: "Account Verified Successfully",
    });
  }

  // login User
  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      res
        .status(404)
        .json({ status: STATUS.FAIL, messaeg: MSG.REQUIRED_FIELDS });
      return;
    }

    const data = await authService.loginUser(req.body);

    const user = data.get({ plain: true }) as IUser;
    const token = signToken({ id: user.id, role: user.role });

    res.cookie("authToken", token);

    res.status(200).json({ status: STATUS.SUCCESS, token: token });
  }

  // resetPasswordToken
  static async resetPasswordToken(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({ message: `${MSG.REQUIRED_FIELDS}- Email` });
    }

    await authService.resetPasswordToken(email);
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: "Reset Password token send in your mail ",
    });
  }

  // resetPassword
  static async resetPassword(req: Request, res: Response) {
    const {email, token}= req.params
    const {password, confirmPassword } = req.body;

    if (!email || !token) {
      res.status(HTTP.NOT_FOUND).json({ message: MSG.REQUIRED_FIELDS });
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      res.status(HTTP.BAD_REQUEST).json({ message: MSG.PASSWORD_REGEX_ERROR });
      return;
    }

    if (!confirmPassword) {
      res
        .status(HTTP.NOT_FOUND)
        .json({ message: "Confirm Password is required" });
      return;
    }
    if (password != confirmPassword) {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ message: MSG.CONFIRM_PASSWORD_NOT_MATCH });
      return;
    }

    await authService.resetPassword(email, token, req.body)
    res.status(200).json({status:STATUS.SUCCESS, message:"Account Password Reset Successfully"})
  }
}

export default AuthController;
