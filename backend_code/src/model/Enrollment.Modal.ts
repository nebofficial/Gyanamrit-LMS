import { DataTypes, Model, Sequelize } from "sequelize";
import User from "./User.Model";
import Course from "./Course.Model";
import { PAYMENT_FREE_STATUS, PAYMENT_PAID_STATUS, PAYMENT_PENDING_STATUS, PAYMENT_REFUND_STATUS } from "../constant/paymntStatus";

class Enrollment extends Model {}

export const initEnrollmentModel = (sequelize: Sequelize) => {
  Enrollment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },

      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Course,
          key: "id",
        },
      },

      // Track progress
      progress: {
        type: DataTypes.FLOAT, // 0 - 100 %
        defaultValue: 0,
      },

      // Payment info (if course is paid)
      paymentStatus: {
        type: DataTypes.ENUM(PAYMENT_FREE_STATUS, PAYMENT_PENDING_STATUS, PAYMENT_PAID_STATUS, PAYMENT_REFUND_STATUS),
        defaultValue: PAYMENT_PENDING_STATUS,
      },

      enrolledAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      // OPTIONAL: for certificates
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Enrollment",
      tableName: "enrollments", // <- strongly recommended plural
      timestamps: true,
    }
  );

  Enrollment.belongsTo(User, { foreignKey: "userId", as: "user" });
  Enrollment.belongsTo(Course, { foreignKey: "courseId", as: "course" });
};

export default Enrollment;
