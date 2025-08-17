"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        enum: ["Self Improvement", "Workout", "Extra Curricular", "Others"],
        required: true,
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Low",
    },
    status: {
        type: String,
        enum: ["completed", "pending", "expired"],
        default: "pending",
    },
    timeSpent: {
        type: Number,
        default: 0,
    },
}, { timestamps: true, versionKey: false });
exports.Task = (0, mongoose_1.model)("Task", taskSchema);
