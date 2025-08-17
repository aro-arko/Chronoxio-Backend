import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/register",
  validateRequest(authValidation.registrationValidation),
  authController.createUser
);
router.post(
  "/login",
  validateRequest(authValidation.loginValidation),
  authController.loginUser
);

router.patch(
  "/change-password",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(authValidation.changePasswordValidation),
  authController.changePassword
);

export const authRoutes = router;
