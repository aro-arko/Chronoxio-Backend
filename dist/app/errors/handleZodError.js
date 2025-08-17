"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const statusCode = 400;
    const errors = err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        received: issue.received,
    }));
    return {
        statusCode,
        message: errors.length > 0 && errors[0].received !== undefined
            ? `${errors[0].received} is not valid`
            : errors.length > 0
                ? errors[0].message
                : "Validation Error",
    };
};
exports.default = handleZodError;
