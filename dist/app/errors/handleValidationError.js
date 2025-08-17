"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
err) => {
    const statusCode = 400;
    return {
        statusCode,
        message: "Validation Error Occurred",
    };
};
exports.default = handleValidationError;
