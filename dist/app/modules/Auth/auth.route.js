"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(auth_validation_1.authValidation.registrationValidation), auth_controller_1.authController.createUser);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.authValidation.loginValidation), auth_controller_1.authController.loginUser);
router.patch("/change-password", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(auth_validation_1.authValidation.changePasswordValidation), auth_controller_1.authController.changePassword);
exports.authRoutes = router;
