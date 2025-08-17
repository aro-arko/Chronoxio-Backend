import express from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.get("/all", auth(USER_ROLE.admin), userController.getAllUsers);

router.get("/me", auth(USER_ROLE.user, USER_ROLE.admin), userController.getMe);

router.get("/leaderboard", userController.getLeaderboard);
router.patch(
  "/update/me",
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.updateMe
);

router.patch(
  "/deactivate/:id",
  auth(USER_ROLE.admin),
  userController.deactivateUser
);

export const userRoutes = router;
