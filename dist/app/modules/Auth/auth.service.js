"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const user_model_1 = __importDefault(require("../User/user.model"));
const sendEmail_1 = require("../../utils/sendEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = Object.assign({}, payLoad);
    userData.role = "user";
    const existingUser = yield user_model_1.default.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already exists");
    }
    const newUser = yield user_model_1.default.create(userData);
    return newUser;
});
const loginUser = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = Object.assign({}, payLoad);
    const user = yield user_model_1.default.findOne({ email: userData.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (!(yield user_model_1.default.isPasswordMatched(userData.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid password");
    }
    if (user.status === "inactive") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is inactive");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return accessToken;
});
const changePassword = (currentUser, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: currentUser.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (!(yield user_model_1.default.isPasswordMatched(oldPassword, user.password))) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid old password");
    }
    user.password = newPassword;
    yield user.save();
    return user;
});
// forgot password
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // checking if the user is active
    const isActive = user.status === "active";
    if (!isActive) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User is not active");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, "10m");
    const resetUILink = `${config_1.default.reset_pass_ui_link}?email=${user.email}&token=${resetToken}`;
    try {
        // console.log(resetUILink);
        yield (0, sendEmail_1.sendEmail)(user.email, resetUILink);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (err) {
        // console.error('Email sending failed:', err);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
});
// reset password
const resetPassword = (payLoad, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payLoad.email });
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    if (user.status !== "active") {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User is not active");
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    if (payLoad.email !== decoded.email) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not allowed to reset this password");
    }
    const updated = yield user_model_1.default.findOneAndUpdate({ email: decoded.email, role: decoded.role }, { password: payLoad.newPassword }, { new: true });
    if (!updated) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found for update");
    }
});
exports.authServices = {
    createUserIntoDB,
    loginUser,
    changePassword,
    forgotPassword,
    resetPassword,
};
