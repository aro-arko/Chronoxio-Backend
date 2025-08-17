import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { TaskValidation } from "./task.validation";
import { TaskController } from "./task.controller";

const router = express.Router();

// create task
router.post(
  "/create",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(TaskValidation.CreateTaskValidation),
  TaskController.createTask
);

// get all tasks
router.get(
  "/",
  auth(USER_ROLE.user, USER_ROLE.admin),
  TaskController.getAllTasks
);

// complete task
router.put(
  "/complete/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(TaskValidation.CompleteTaskValidation),
  TaskController.completeTask
);

// // create task
// router.post(
//   "/create",
//   auth(USER_ROLE.user),
//   validateRequest(TaskValidation.CreateTaskValidation),
//   TaskController.createTask
// );

// update task
router.patch(
  "/update/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(TaskValidation.updateTaskValidation),
  TaskController.updateTask
);

// delete task
router.delete(
  "/delete/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  TaskController.deleteTask
);

// weekly report
router.get(
  "/report/weekly",
  auth(USER_ROLE.user, USER_ROLE.admin),
  TaskController.getWeeklyReport
);

export const TaskRoutes = router;
