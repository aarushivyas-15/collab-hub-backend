//      middleware      - >           validate            ->       route

import { body } from "express-validator";
import { AvailableUserRole } from "../utils/constants.js";
const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage(" email is required")
      .isEmail()
      .withMessage("email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be atleast 3 character long"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("passwod is required")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 character long"),
    body("fullname").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").trim().notEmpty().withMessage("password required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("oldPassword is required"),
    body("newPassword").notEmpty().withMessage("newPassword is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("New password required")];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Email is not valid"),
    body("role")
      .notEmpty()
      .withMessage("role required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator,
};
