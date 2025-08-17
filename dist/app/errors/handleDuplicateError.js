"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const statusCode = 409;
    const key = err.keyValue ? Object.keys(err.keyValue)[0] : "Field";
    const value = err.keyValue ? err.keyValue[key] : "";
    return {
        statusCode,
        message: `${value} already exists`,
    };
};
exports.default = handleDuplicateError;
