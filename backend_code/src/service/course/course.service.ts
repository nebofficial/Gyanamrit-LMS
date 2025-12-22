import slugify from "slugify";
import { ICourseType, ILoginedUserType } from "../../global/type";
import { generateSlug } from "../../utils/slugGenerator";
import Course from "../../model/Course.Model";
import { PUBSLISHED_COURSE } from "../../constant/courseStatus";
import Lesson from "../../model/Lesson.Model";
import uploadFile from "../../utils/uploadFiles";
import User from "../../model/User.Model";
import Category from "../../model/Category.Model";

const addCourse = async (
  data: ICourseType,
  LogUser: ILoginedUserType,
  file: Express.Multer.File
) => {
  const slug = slugify(data.title, { strict: true, lower: true });
  const uniqueSlug = await generateSlug(slug, Course);

  const coursethumbnail = await uploadFile(file ? [file] : undefined);

  const course = await Course.create({
    title: data.title,
    slug: data.slug || uniqueSlug,
    description: data.description,

    categoryId: data.categoryId,
    instructorId: LogUser.id,

    thumbnail: coursethumbnail[0]?.url,

    level: data.level,
    language: data.language,
    duration: data.duration,

    price: data.price,
    discountPrice: data.discountPrice,

    learningOutcomes: data.learningOutcomes,
    requirements: data.requirements,

    totalStudents: data.totalStudents,
    rating: data.rating,
    totalRatings: data.totalRatings,
  });
  return course;
};

const getAllCourse = async () => {
  return await Course.findAll({ order: [["createdAt", "DESC"]] });
};

// getOwnCourse
const getOwnCourse = async (user: ILoginedUserType) => {
  return await Course.findAll({
    where: { instructorId: user.id },
    order: [["createdAt", "DESC"]],
  });
};

// getActive Course [for student - viewer]
const getActiveCourse = async () => {
  return await Course.findAll({
    where: { status: PUBSLISHED_COURSE, isApproved: true },
    order: [["createdAt", "DESC"]],
  });
};

// getSingleCoursebyID
const getSingleCoursebyId = async (courseId: string) => {
  return await Course.findOne({ where: { id: courseId } });
};

// getSingleCoursebySlug
const getSingleCoursebySlug = async (courseSlug: string) => {
  return await Course.findOne({
    where: { slug: courseSlug },
    include: [
      {
        model: User,
        as: "instructor",
        attributes: ["name", "email"],
      },
    ],
  });
};

// deleteCourse
const deleteCourse = async (courseId: string) => {
  return await Course.destroy({ where: { id: courseId } });
};

// getCourseswithLesson
const getCourseswithLesson = async (courseId: string) => {
  return await Course.findOne({
    where: { id: courseId },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "instructor",
        attributes: ["id", "name", "email"],
      },
      {
        model: Lesson,
        as: "lessons",
        order: [["createdAt", "ASC"]],
      },
    ],
  });
};

// updateCourse
const updateCourse = async (
  data: ICourseType,
  courseId: string,
  file: Express.Multer.File
) => {
  const coursethumbnail = await uploadFile(file ? [file] : undefined);

  return Course.update(
    {
      title: data.title,
      slug: data.slug,
      description: data.description,

      categoryId: data.categoryId,

      thumbnail: coursethumbnail[0]?.url,

      level: data.level,
      language: data.language,
      duration: data.duration,

      price: data.price,
      discountPrice: data.discountPrice,

      learningOutcomes: data.learningOutcomes,
      requirements: data.requirements,

      totalStudents: data.totalStudents,
      rating: data.rating,
      totalRatings: data.totalRatings,
    },
    {
      where: { id: courseId },
    }
  );
};

const updateCourseStatus = async (data: ICourseType, courseId: string) => {
  return await Course.update(
    {
      instructorId: data.instructorId,
      isApproved: data.isApproved,
      status: data.status,
    },
    {
      where: { id: courseId },
    }
  );
};

export default {
  addCourse,
  getAllCourse,
  getOwnCourse,
  getActiveCourse,
  getSingleCoursebyId,
  deleteCourse,
  getCourseswithLesson,
  updateCourse,
  updateCourseStatus,
  getSingleCoursebySlug,
};
