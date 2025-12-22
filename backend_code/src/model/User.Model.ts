import { DataTypes, Model, Sequelize } from "sequelize";
import {
  ADMIN_ROLE,
  INSTRUCTOR_ROLE,
  STUDENT_ROLE,
} from "../constant/userRole";
import {
  ACTIVE_USER,
  PENDING_USER,
  SUSPENDED_USER,
} from "../constant/userStatus";

class User extends Model {}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM(STUDENT_ROLE, INSTRUCTOR_ROLE, ADMIN_ROLE),
        defaultValue: STUDENT_ROLE,
        allowNull: false,
      },
      // verification
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      otp: {
        type: DataTypes.STRING,
      },
      otpExpiresAt: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM(PENDING_USER, ACTIVE_USER, SUSPENDED_USER),
        defaultValue: PENDING_USER,
        allowNull: false,
      },

      // profile
      profileImage: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      address: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },

      // instructor extras
      expertise: {
        type: DataTypes.STRING,
      },
      experience: {
        type: DataTypes.STRING,
      },
      qualification: {
        type: DataTypes.TEXT,
      },
      socialLinks: {
        type: DataTypes.JSONB,
      },

      // forget password
      resetToken: {
        type: DataTypes.STRING,
      },
      resetTokenExpire: {
        type: DataTypes.DATE,
      },
      tokenUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      paranoid: true,
    }
  );
};

export default User;
