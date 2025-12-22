import { ERROR_CODE } from "../../constant/statusRes";
import { IUser } from "../../global/type";
import User from "../../model/User.Model";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { ACTIVE_USER } from "../../constant/userStatus";
import { welcomeMail1 } from "../../template/accountVerification";
import sendMail from "../../utils/sendMail";

const addUser = async (data: IUser) => {
  // check email exits or not
  const existUser = await User.findOne({ where: { email: data.email } });
  if (existUser) {
    throw new Error(`Invalid Email or password - User Already Exist`);
  }

  const randomNumber = Math.floor(1000 + Math.random() * 900);
  const randomBytes = crypto.randomBytes(2).toString("hex");
  const genreatePassword = `Gyanamrit@${randomBytes}${randomNumber}`;

  const hassPassword = await bcrypt.hash(genreatePassword, 14);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hassPassword,
    contactNumber: data.contactNumber,
    role: data.role,
    status: ACTIVE_USER,
  });

  const mailFormat = {
    to: data.email,
    subject:
      data.role === "student"
        ? `Welcome to Gyanamrit LMS, ${data.name}! Your Sanskrit journey begins 🎓`
        : `Your Instructor account is ready, ${data.name} – Start teaching today`,
    html: welcomeMail1(data.name, data.email, genreatePassword, data.role),
  };

  await sendMail(mailFormat);
};

const getAllUser = async () => {
  return await User.findAll({ attributes: { exclude: ["password"] } });
};

const getSingleUserData = async (userId: string) => {
  return await User.findOne({
    where: { id: userId },
    attributes: { exclude: ["password"] },
  });
};

const getOwnData = async (userId: string) => {
  return await User.findOne({
    where: { id: userId },
    attributes: { exclude: ["password"] },
  });
};

const deleteUser = async (userId: string) => {
  return await User.destroy({ where: { id: userId } });
};

const updateUserStatus = async (data: IUser, userId: string) => {
  return await User.update(
    { status: data.status, role: data.role },
    { where: { id: userId } }
  );
};

export default {
  addUser,
  getAllUser,
  getSingleUserData,
  getOwnData,
  deleteUser,
  updateUserStatus,
};
