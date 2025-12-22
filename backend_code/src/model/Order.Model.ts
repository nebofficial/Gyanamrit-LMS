import { DataTypes, Model, Sequelize } from "sequelize";
import User from "./User.Model";
import Course from "./Course.Model";
import { date } from "zod";

class Order extends Model {}

export const initOrderModel = (sequelize: Sequelize) => {
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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

      // Payment details
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },

      finalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      paymentMethod: {
        type: DataTypes.ENUM("khalti", "esewa", "bank", "card", "cash", "other"),
        allowNull: false,
        defaultValue: "esewa",
      },

      paymentStatus: {
        type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
        defaultValue: "pending",
      },

      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Invoice / Order tracking
      orderStatus: {
        type: DataTypes.ENUM("processing", "completed", "cancelled"),
        defaultValue: "processing",
      },

      purchasedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",   // FIXED spelling
      timestamps: true,      // recommended for orders
    }
  );

  return Order;
};
