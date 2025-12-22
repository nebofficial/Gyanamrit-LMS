import express, { Router } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AuthController from "../../controller/auth/auth.controller";

const router: Router = express.Router();

router.route("/signup").post(asyncHandler(AuthController.signupUser));
router.route("/signin").post(asyncHandler(AuthController.loginUser));

router
  .route("/request-token")
  .post(asyncHandler(AuthController.verificationToken));

  // Request Reset Password Token
  router
  .route("/forget-password")
  .post(asyncHandler(AuthController.resetPasswordToken));
  

  // Verify Account 
router
  .route("/verify/:email/:token")
  .get(asyncHandler(AuthController.verifyToken));


  // Reset Password
router
  .route("/verify/:email/:token/reset-password")
  .post(asyncHandler(AuthController.resetPassword));

export default router;
