"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const statusCode = 400;
    return {
        statusCode,
        message: `Invalid value '${err.value}' for field '${err.path}'`,
    };
};
exports.default = handleCastError;
