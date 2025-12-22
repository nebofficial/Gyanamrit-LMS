import { DataTypes, Model, Sequelize } from "sequelize";
import Course from "./Course.Model";

class Lesson extends Model {}

export const initLessonModl = (sequelize: Sequelize) => {
  Lesson.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Course,
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      videoUrl: {
        type: DataTypes.STRING,
      },
      fileUrl: {
        type: DataTypes.STRING,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Lesson",
      tableName: "lessons",
      timestamps: true,
    }
  );
  Lesson.belongsTo(Course, { foreignKey: "courseId", as: "course" });
  Course.hasMany(Lesson, {
    foreignKey: "courseId",
    as: "lessons",
  });
};

export default Lesson;
