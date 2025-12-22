import { config } from "../../config/config";
import { ERROR_CODE } from "../../constant/statusRes";
import { ACTIVE_USER, PENDING_USER } from "../../constant/userStatus";
import User from "../../model/User.Model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendMail from "../../utils/sendMail";
import { Op } from "sequelize";
import { IUser } from "../../global/type";
import {
  accountVerificationMail,
  welcomeMail,
} from "../../template/accountVerification";


import resetPasswordMail from "../../template/resetPw";

interface ISignupTyp {
  name: string;
  email: string;
  password: string;
  confirmPasword: string;
}

interface IRestPw {
  email: string;
  token: string;
  password: string;
}

const signupUser = async (data: ISignupTyp) => {
  // first check usr xist or not
  const existUser = await User.findOne({ where: { email: data.email } });
  if (existUser) {
    throw new Error(
      `Invalid Email or password -${ERROR_CODE.USER_ALREADY_EXIST}`
    );
  }
  const hassPassword = await bcrypt.hash(data.password, 14);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hassPassword,
  });

  // verification token sent
  const token = crypto.randomBytes(32).toString("hex");

  user.setDataValue("isEmailVerified", false);
  user.setDataValue("otp", token);
  user.setDataValue("status", PENDING_USER);
  user.setDataValue("otpExpiresAt", Date.now() + 86400000);
  await user.save();

  // Account Verification link
  const verificationLink = `${config.clientUrl}/${encodeURIComponent(
    data.email
  )}/${token}`;
  const name = data.name;

  // mail sent function
  const verifiedMailFormat = {
    to: data.email,
    subject: "✅ Action Required: Verify Your Mero Rooms Account",
    html: accountVerificationMail(name, verificationLink),
  };

  // mail function
  await sendMail(verifiedMailFormat);
};

const verificationToken = async (data: ISignupTyp) => {
  // 1
  const user = await User.findOne({ where: { email: data.email } });
  if (!user) {
    throw new Error("Invalid Email Address");
  }

  const token = crypto.randomBytes(32).toString("hex");
  await User.update(
    {
      otp: token,
      isEmailVerified: false,
      status: PENDING_USER,
      otpExpiresAt: Date.now() + 86400000,
    },
    { where: { email: data.email } }
  );

  // Account Verification link
  const verificationLink = `${config.clientUrl}/${encodeURIComponent(
    data.email
  )}/${token}`;
  const userData = user.get({ plain: true }) as ISignupTyp;
  const name = userData.name;

  const verifiedMailFormat = {
    to: data.email,
    subject: "✅ Action Required: Verify Your Mero Rooms Account",
    html: accountVerificationMail(name, verificationLink),
  };

  // mail function
  await sendMail(verifiedMailFormat);
};

const verifyToken = async (email: string, token: string) => {
  const user = await User.findOne({
    where: {
      email: email,
      otp: token,
      otpExpiresAt: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new Error("Invalid Token or User");
  }

  await User.update(
    {
      otp: null,
      status: ACTIVE_USER,
      isEmailVerified: true,
      otpExpiresAt: null,
    },
    { where: { email } }
  );

  const userData = user.get({ plain: true }) as IUser;
  // mail
  const welcomeMailFormat = {
    to: email,
    subject: `🎓 Welcome to GyanamritLMS, ${userData.name}! Unlock Your Learning Potential`,
    html: welcomeMail(userData.name),
  };

  // send mail
  await sendMail(welcomeMailFormat);
};

const loginUser = async (data: ISignupTyp) => {
  const user = await User.findOne({ where: { email: data.email } });
  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  const userData = user.get({ plain: true }) as IUser;

  if (userData.status === PENDING_USER) {
    throw new Error("Account not Verified yet");
  }
  const comparePass = await bcrypt.compare(data.password, userData.password);

  if (!comparePass) {
    throw new Error("Invalid Email or Password");
  }
  return user;
};

const resetPasswordToken = async (email: string) => {
  // checkemail existor not
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw { status: 404, message: "Invalid Email or not exist" };
  }

  // token genreate
  const resetPassword = Math.floor(100000 + Math.random() * 900000).toString();
  const resetTokenExpire = Date.now() + 1000 * 60 * 15;
  const tokenUsed = false;

  await User.update(
    {
      resetToken: resetPassword,
      resetTokenExpire: resetTokenExpire,
      tokenUsed: tokenUsed,
    },
    { where: { email } }
  );

  const resetPasswordLink = `${config.clientUrl}/${encodeURIComponent(
    email
  )}/${resetPassword}`;

  const userData = user.get({ plain: true }) as IUser;
  const username = userData.name;

  // mail....
  const resetPasswordMailFormat = {
    to: email,
    subject: "Your Password Reset Code (Valid 15 Minutes)",
    html: resetPasswordMail(username, resetPasswordLink),
  };

  await sendMail(resetPasswordMailFormat);
};

const resetPassword = async (email: string, token: string, data: IRestPw) => {
  // check userexistor not
  const emailAddress = decodeURIComponent(email);
  const user = await User.findOne({
    where: {
      email: emailAddress,
      resetToken: token,
      tokenUsed: false,
      resetTokenExpire: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    throw { status: 404, message: "Invalid Email/Token or not Exist" };
  }

  const hassPassword = await bcrypt.hash(data.password, 14);
  await User.update(
    {
      password: hassPassword,
      resetToken: null,
      resetTokenExpire: null,
      tokenUsed: true,
    },
    { where: { email: emailAddress } }
  );
};

export default {
  signupUser,
  verificationToken,
  verifyToken,
  loginUser,
  resetPasswordToken,
  resetPassword,
};
