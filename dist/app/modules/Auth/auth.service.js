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
exports.authServices = {
    createUserIntoDB,
    loginUser,
    changePassword,
};
