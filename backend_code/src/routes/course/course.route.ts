import express, { Router } from "express";
import MiddlewareController from "../../middleware/middleware";
import { roleBasedAuth } from "../../middleware/rolebasedAuth";
import { ADMIN_ROLE, INSTRUCTOR_ROLE } from "../../constant/userRole";
import asyncHandler from "../../utils/asyncHandler";
import CourseController from "../../controller/course/course.controller";
import LessonController from "../../controller/lesson/lesson.controller";
import { upload } from "../../middleware/multer";

const router: Router = express.Router();

router
  .route("/")
  .post(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE, INSTRUCTOR_ROLE]),
    upload.single("thumbnail"),
    asyncHandler(CourseController.addCourse)
  )
  .get(asyncHandler(CourseController.getActiveCourse));

// for admin
router
  .route("/for-admin")
  .get(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(CourseController.getAllCourse)
  );


router
  .route("/for-instructor")
  .get(
    MiddlewareController.isLogined,
    roleBasedAuth([INSTRUCTOR_ROLE]),
    asyncHandler(CourseController.getOwnCourse)
  );

// getCourse Details by Slug // for user student - SEO
router
  .route("/public/:courseSlug")
  .get(asyncHandler(CourseController.getActiveCourseDetails));

// Get Course with All Lesson
router
  .route("/:courseId")
  .get(
    MiddlewareController.isLogined,
    asyncHandler(CourseController.getCourseswithLesson)
  )
  .patch(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE, INSTRUCTOR_ROLE]),
    upload.single("thumbnail"),
    asyncHandler(CourseController.updateCourse)
  )
  .put(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(CourseController.updateCourseStatus)
  )
  .delete(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(CourseController.deleteCourse)
  );

// adds lesson
router
  .route("/:courseId/lesson")
  .post(
    MiddlewareController.isLogined,
    asyncHandler(LessonController.addLesson)
  );

//  Get Course Sigle Lesson
router
  .route("/:courseId/:lessonId")
  .get(
    MiddlewareController.isLogined,
    asyncHandler(CourseController.getSingleLessonByCourse)
  );
export default router;
