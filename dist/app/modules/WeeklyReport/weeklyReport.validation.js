"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyReportValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.WeeklyReportValidation = zod_1.default.object({
    body: zod_1.default.object({
        userId: zod_1.default.string(),
        weekStart: zod_1.default.string(),
        weekEnd: zod_1.default.string(),
        report: zod_1.default.array(zod_1.default.object({
            name: zod_1.default.string(),
            value: zod_1.default.number(),
        })),
    }),
});
