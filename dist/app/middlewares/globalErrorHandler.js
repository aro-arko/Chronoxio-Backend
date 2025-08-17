"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const handleAuthenticationError_1 = __importDefault(require("../errors/handleAuthenticationError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const config_1 = __importDefault(require("../config"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Global Error Occurred";
    if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.default)(error);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
    }
    else if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(error);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
    }
    else if (error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError") {
        const simplifiedError = (0, handleAuthenticationError_1.default)(error);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === "CastError") {
        const simplifiedError = (0, handleCastError_1.default)(error);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error === null || error === void 0 ? void 0 : error.message;
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        error: {
            datail: error,
        },
        stack: config_1.default.node_env === "development" ? error === null || error === void 0 ? void 0 : error.stack : null,
    });
    return;
};
exports.default = globalErrorHandler;
