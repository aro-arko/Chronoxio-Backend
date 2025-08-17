"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const registrationValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required and cannot be empty"),
        email: zod_1.z.string().email("Invalid email format"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(28, "Password must be at most 28 characters long"),
    }),
});
const loginValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(28, "Password must be at most 28 characters long"),
    }),
});
const changePasswordValidation = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z
            .string({
            error: "Old password must be a string",
        })
            .min(6, {
            message: "Old password must be at least 6 characters long",
        })
            .max(100, {
            message: "Old password must be at most 32 characters long",
        }),
        newPassword: zod_1.z
            .string({
            error: "New password must be a string",
        })
            .min(6, {
            message: "New password must be at least 6 characters long",
        })
            .max(100, {
            message: "New password must be at most 32 characters long",
        }),
    }),
});
exports.authValidation = {
    registrationValidation,
    loginValidation,
    changePasswordValidation,
};
