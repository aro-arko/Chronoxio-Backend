"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleAuthenticationError = (err) => {
    const statusCode = 401;
    return {
        statusCode,
        message: "Invalid token or expired session",
    };
};
exports.default = handleAuthenticationError;
