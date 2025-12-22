import { NextFunction, Request, Response } from "express";
import {
  ICourseType,
  IExtendRequest,
  ILoginedUserType,
} from "../../global/type";
import { MSG, STATUS } from "../../constant/statusRes";
import courseService from "../../service/course/course.service";
import lessonService from "../../service/lesson/lesson.service";
import enrollmentService from "../../service/enrollment/enrollment.service";
import { ADMIN_ROLE, INSTRUCTOR_ROLE } from "../../constant/userRole";

class CourseController {
  // add course
  static async addCourse(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title } = req.body;
      const user = req.user;
      const file: any = req.file;
      if (!title) {
        res.status(404).json({ message: MSG.REQUIRED_FIELDS });
        return;
      }
      if (!user) {
        res.status(401).json({ message: MSG.AUTH_REQUIRED });
        return;
      }
      const data = await courseService.addCourse(req.body, user, file);
      res.status(201).json({
        sttus: STATUS.SUCCESS,
        message: MSG.COURSE_CREATED,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // getAll Course for admin
  static async getAllCourse(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await courseService.getAllCourse();
      if (data.length === 0) {
        res.status(200).json([]);
        return;
      }
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Course ${MSG.FETCH_SUCCESS}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  /// getOwnCourse
  static async getOwnCourse(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user as ILoginedUserType;

    if (!user) {
      res.status(401).json({ message: MSG.USER_DELETED });
      return;
    }

    const data = await courseService.getOwnCourse(user);
    if (data.length === 0) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: `Own Course ${MSG.FETCH_SUCCESS}`,
      data: data,
    });
    return;
  }

  // getActiveCourse
  static async getActiveCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const data = await courseService.getActiveCourse();
    if (data.length === 0) {
      res.status(200).json([]);
      return;
    }

    res.status(200).json({
      status: STATUS.SUCCESS,
      message: `Active Course ${MSG.FETCH_SUCCESS}`,
      data: data,
    });
  }

  // getActiveCourseDetails
  static async getActiveCourseDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseSlug } = req.params;

      const data = await courseService.getSingleCoursebySlug(courseSlug);
      if (!data) {
        res.status(404).json({ message: "Requested Course not found" });
        return;
      }
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: MSG.FETCH_SUCCESS,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // deleteCourse
  static async deleteCourse(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const find = await courseService.getSingleCoursebyId(courseId);
      if (!find) {
        res.status(404).json({ message: "Requested Course not found" });
        return;
      }
      await courseService.deleteCourse(courseId);
      res
        .status(200)
        .json({ status: STATUS.SUCCESS, message: MSG.COURSE_DELETED });
    } catch (error) {
      next(error);
    }
  }

  //getCourseswithLesson
  static async getCourseswithLesson(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const user = req.user as ILoginedUserType; // contains id + role

      const course = await courseService.getSingleCoursebyId(courseId);
      if (!course) {
        return res.status(400).json({ message: "Requested Course not found" });
      }

      // Allow ADMIN directly
      if (user.role.includes(ADMIN_ROLE)) {
        const data = await courseService.getCourseswithLesson(courseId);
        return res.status(200).json({
          status: STATUS.SUCCESS,
          message: `Course with Lesson ${MSG.FETCH_SUCCESS}`,
          data,
        });
      }

      // Allow INSTRUCTOR to access their own courses
      const courseData = course.get({ plain: true }) as ICourseType;
      if (user.role.includes(INSTRUCTOR_ROLE) && courseData.instructorId === user.id) {
        const data = await courseService.getCourseswithLesson(courseId);
        return res.status(200).json({
          status: STATUS.SUCCESS,
          message: `Course with Lesson ${MSG.FETCH_SUCCESS}`,
          data,
        });
      }

      // For normal user → must be enrolled
      const isEnroll = await enrollmentService.getSingleEnrollCourse(
        user.id,
        courseId
      );

      if (!isEnroll) {
        return res
          .status(403)
          .json({ message: "You are not enrolled in this course" });
      }

      const data = await courseService.getCourseswithLesson(courseId);

      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Course with Lesson ${MSG.FETCH_SUCCESS}`,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // getSingleLessonByCourse
  static async getSingleLessonByCourse(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId, lessonId } = req.params;
      const user = req.user as ILoginedUserType;

      const course = await courseService.getSingleCoursebyId(courseId);
      if (!course) {
        return res.status(400).json({ message: "Course Not found" });
      }

      // Allow ADMIN without enrollment check
      if (user.role.includes(ADMIN_ROLE)) {
        const lesson = await lessonService.getSingleLessonById(lessonId);

        if (!lesson) {
          return res.status(404).json({ message: "Lesson Not Found" });
        }

        return res.status(200).json({
          status: STATUS.SUCCESS,
          message: `Lesson ${MSG.FETCH_SUCCESS}`,
          data: lesson,
        });
      }

      // Allow INSTRUCTOR to access lessons from their own courses
      const courseData = course.get({ plain: true }) as ICourseType;
      if (user.role.includes(INSTRUCTOR_ROLE) && courseData.instructorId === user.id) {
        const lesson = await lessonService.getSingleLessonById(lessonId);

        if (!lesson) {
          return res.status(404).json({ message: "Lesson Not Found" });
        }

        return res.status(200).json({
          status: STATUS.SUCCESS,
          message: `Lesson ${MSG.FETCH_SUCCESS}`,
          data: lesson,
        });
      }

      // Student must be enrolled
      const isEnroll = await enrollmentService.getSingleEnrollCourse(
        user.id,
        courseId
      );

      if (!isEnroll) {
        return res
          .status(403)
          .json({ message: "You are not enrolled in this course" });
      }

      const lesson = await lessonService.getSingleLessonById(lessonId);

      if (!lesson) {
        return res.status(404).json({ message: "Lesson Not Found" });
      }

      return res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Lesson ${MSG.FETCH_SUCCESS}`,
        data: lesson,
      });
    } catch (error) {
      next(error);
    }
  }

  // updateCourse
  static async updateCourse(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const user = req.user as ILoginedUserType;
      const file = req.file as Express.Multer.File;

      const course = await courseService.getSingleCoursebyId(courseId);
      if (!course) {
        res.status(404).json({ message: "Not found Request Course" });
        return;
      }

      const courseData = course.get({ plain: true }) as ICourseType;

      // check usrId with instructor id
      if (
        courseData.instructorId != user.id &&
        !user.role.includes(ADMIN_ROLE)
      ) {
        res
          .status(403)
          .json({ message: "No Permission to update other course" });
        return;
      }

      // Parse arrays if sent as JSON strings (form-data)
      if (typeof req.body.learningOutcomes === "string") {
        req.body.learningOutcomes = JSON.parse(req.body.learningOutcomes);
      }
      if (typeof req.body.requirements === "string") {
        req.body.requirements = JSON.parse(req.body.requirements);
      }

      const data = await courseService.updateCourse(req.body, courseId, file);
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Course ${MSG.UPDATE_SUCCESS}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // updateCourseStatus
  static async updateCourseStatus(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      if (!courseId) {
        res.status(404).json({ message: "CourseId not found" });
        return;
      }
      await courseService.updateCourseStatus(req.body, courseId);
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Course Status ${MSG.UPDATE_SUCCESS}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CourseController;
