"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const CreateTaskValidation = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().min(1, "Title is required"),
        startDate: zod_1.default.string(),
        endDate: zod_1.default.string().optional(),
        category: zod_1.default.enum([
            "Self Improvement",
            "Workout",
            "Extra Curricular",
            "Others",
        ]),
    }),
});
const updateTaskValidation = zod_1.default.object({
    body: zod_1.default.object({
        status: zod_1.default.enum(["pending", "completed", "expired"]).optional(),
    }),
});
const CompleteTaskValidation = zod_1.default.object({
    body: zod_1.default.object({
        timeSpent: zod_1.default.number().min(0, "Time spent must be positive"),
    }),
});
exports.TaskValidation = {
    CreateTaskValidation,
    updateTaskValidation,
    CompleteTaskValidation,
};
