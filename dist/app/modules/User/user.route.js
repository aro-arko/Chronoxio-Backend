"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const router = express_1.default.Router();
router.get("/all", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), user_controller_1.userController.getAllUsers);
router.get("/me", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), user_controller_1.userController.getMe);
router.get("/leaderboard", user_controller_1.userController.getLeaderboard);
router.patch("/update/me", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), user_controller_1.userController.updateMe);
router.patch("/deactivate/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), user_controller_1.userController.deactivateUser);
exports.userRoutes = router;
