import express, { Router } from "express";
import MiddlewareController from "../../middleware/middleware";
import { roleBasedAuth } from "../../middleware/rolebasedAuth";
import { ADMIN_ROLE, INSTRUCTOR_ROLE } from "../../constant/userRole";
import CategoryController from "../../controller/category/category.controller";
import asyncHandler from "../../utils/asyncHandler";

const router: Router = express.Router();

router
  .route("/")
  .post(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE, INSTRUCTOR_ROLE]),
    CategoryController.addCategory
  )
  .get(asyncHandler(CategoryController.getAllCategory));

// dynamic route
router
  .route("/:categoryId")
  .put(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(CategoryController.updateCategory)
  )
  .delete(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    asyncHandler(CategoryController.deleteCategory)
  )
  .patch(
    MiddlewareController.isLogined,
    roleBasedAuth([ADMIN_ROLE]),
    CategoryController.toggleCategory
  );

export default router;
