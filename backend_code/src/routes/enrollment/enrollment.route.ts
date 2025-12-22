import express, { Router } from "express";
import MiddlewareController from "../../middleware/middleware";
import { roleBasedAuth } from "../../middleware/rolebasedAuth";
import { ADMIN_ROLE, INSTRUCTOR_ROLE } from "../../constant/userRole";
import asyncHandler from "../../utils/asyncHandler";
import EnrollmentController from "../../controller/enrollment/enrollment.controller";

const router: Router = express.Router();

router
  .route("/")
  .post(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(EnrollmentController.addEnrollment)
  );

router
  .route("/course")
  .get(
    MiddlewareController.isLogined,
    asyncHandler(EnrollmentController.getAllEnrolledCourse)
  );

router
  .route("/:enrollId")
  .put(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(EnrollmentController.updateEnrollment)
  );

router
  .route("/:courseId/student")
  .get(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE, INSTRUCTOR_ROLE]),
    asyncHandler(EnrollmentController.getEnrollStudent)
  );
export default router;
