import { Router } from "express";
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  login,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerfication,
  resetForgotPassword,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userRegisterValidator,
  userResetForgotPasswordValidator,
} from "../validators/index.js";
import { userLoginValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.route("/register").post(userRegisterValidator(), validate, registerUser);
// // validate is middleware here
// router.route("/login").post(userLoginValidator(), validate, login);

// Correct — spread the validator array so each runs before validate
router
  .route("/register")
  .post(...userRegisterValidator(), validate, registerUser);
router.route("/login").post(...userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), forgotPasswordRequest);

router
  .route("/reset-password/:resetToken")
  .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

//secure route
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/current-user").post(verifyJWT, getCurrentUser);

router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );

router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerfication);

export default router;
