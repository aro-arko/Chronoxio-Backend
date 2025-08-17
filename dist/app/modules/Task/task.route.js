"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const task_validation_1 = require("./task.validation");
const task_controller_1 = require("./task.controller");
const router = express_1.default.Router();
// create task
router.post("/create", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(task_validation_1.TaskValidation.CreateTaskValidation), task_controller_1.TaskController.createTask);
// get all tasks
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), task_controller_1.TaskController.getAllTasks);
// complete task
router.put("/complete/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(task_validation_1.TaskValidation.CompleteTaskValidation), task_controller_1.TaskController.completeTask);
// // create task
// router.post(
//   "/create",
//   auth(USER_ROLE.user),
//   validateRequest(TaskValidation.CreateTaskValidation),
//   TaskController.createTask
// );
// update task
router.patch("/update/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(task_validation_1.TaskValidation.updateTaskValidation), task_controller_1.TaskController.updateTask);
// delete task
router.delete("/delete/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), task_controller_1.TaskController.deleteTask);
// weekly report
router.get("/report/weekly", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), task_controller_1.TaskController.getWeeklyReport);
exports.TaskRoutes = router;
