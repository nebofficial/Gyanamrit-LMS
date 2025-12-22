import { DataTypes, Model, Sequelize } from "sequelize";
import User from "./User.Model";
import Category from "./Category.Model";
import {
  ADVANCE_LEVEL,
  ARCHIVED_COURSE,
  BASIC_LEVEL,
  DRAFT_COURSE,
  INTERMEDIATE_LEVEL,
  PENDING_COURSE,
  PUBSLISHED_COURSE,
} from "../constant/courseStatus";
import Lesson from "./Lesson.Model";

class Course extends Model {}

export const initCourseModel = (sequelize: Sequelize) => {
  Course.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      // BASIC DETAILS
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // CATEGORY + INSTRUCTOR
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: Category,
          key: "id",
        },
      },
      instructorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },

      // MEDIA
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // COURSE META
      level: {
        type: DataTypes.ENUM(BASIC_LEVEL, INTERMEDIATE_LEVEL, ADVANCE_LEVEL),
        defaultValue: BASIC_LEVEL,
      },
      
      language: {
        type: DataTypes.STRING,
        defaultValue: "English",
      },
      duration: {
        type: DataTypes.STRING, // e.g., “3h 40m”, “6 weeks”
        allowNull: true,
      },

      // PRICING
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0, // free course
      },
      discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      // LISTS (JSON)
      learningOutcomes: {
        type: DataTypes.JSONB,
        allowNull: true,
      },

      requirements: {
        type: DataTypes.JSONB,
        allowNull: true,
      },

      // STATS
      totalStudents: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      totalRatings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      // SYSTEM FIELDS
      status: {
        type: DataTypes.ENUM(
          DRAFT_COURSE,
          PENDING_COURSE,
          PUBSLISHED_COURSE,
          ARCHIVED_COURSE
        ),
        defaultValue: PENDING_COURSE,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },

    {
      sequelize,
      modelName: "Course",
      tableName: "courses",
      timestamps: true,
      paranoid: true,
    }
  );

  Course.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
  Course.belongsTo(User, { foreignKey: "instructorId", as: "instructor" });

};

export default Course;
