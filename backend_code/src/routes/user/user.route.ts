import express, { Router } from "express";
import MiddlewareController from "../../middleware/middleware";
import { roleBasedAuth } from "../../middleware/rolebasedAuth";
import { ADMIN_ROLE, INSTRUCTOR_ROLE } from "../../constant/userRole";
import asyncHandler from "../../utils/asyncHandler";
import UserController from "../../controller/user/user.controller";

const router: Router = express.Router();

router
  .route("/")
  .post(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(UserController.addUser)
  )
  .get(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(UserController.getAllUser)
  );

router
  .route("/profile")
  .get(MiddlewareController.isLogined, asyncHandler(UserController.getOwnData));

router
  .route("/:userId")
  .get(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE, INSTRUCTOR_ROLE]),
    asyncHandler(UserController.getSingleUserData)
  )
  .delete(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(UserController.deleteUser)
  )
  .put(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(UserController.updateUserStatus)
  );
export default router;
