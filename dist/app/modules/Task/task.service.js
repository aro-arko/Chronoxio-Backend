"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const user_model_1 = __importDefault(require("../User/user.model"));
const task_model_1 = require("./task.model");
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const createTask = (currentUser, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = currentUser;
    // find user
    const user = yield user_model_1.default.findOne({ email }).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    // start session
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // create task inside transaction
        const task = yield task_model_1.Task.create([
            Object.assign(Object.assign({}, payLoad), { userId: user._id }),
        ], { session });
        // push to user.tasks
        user.tasks.push(task[0]._id);
        yield user.save({ session });
        yield session.commitTransaction();
        return task[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// complete task
const completeTask = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.Task.findById(id).select({
        userId: 1,
        timeSpent: 1,
        status: 1,
        category: 1,
    });
    if (!task)
        throw new Error("Task not found");
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Update task
        task.timeSpent = data.timeSpent;
        task.status = "completed";
        yield task.save({ session });
        // If task category is "Self Improvement", update user timeSpent
        if (task.category === "Self Improvement") {
            // update user
            const user = yield user_model_1.default.findById(task.userId).session(session);
            if (!user)
                throw new Error("User not found");
            user.timeSpent += data.timeSpent;
            yield user.save({ session });
        }
        yield session.commitTransaction();
        return task;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// update task
const updateTask = (taskId, currentUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = currentUser;
    // Find user
    const user = yield user_model_1.default.findOne({ email }).select("_id");
    if (!user)
        throw new Error("User not found");
    // Find task & validate ownership
    const task = yield task_model_1.Task.findOne({ _id: taskId, userId: user._id });
    if (!task)
        throw new Error("Task not found or you don't have permission");
    // Update task
    Object.assign(task, payload);
    const updatedTask = yield task.save();
    return updatedTask;
});
// delete task
const deleteTask = (taskId, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = currentUser;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Fetch user and validate
        const user = yield user_model_1.default.findOne({ email })
            .session(session)
            .select("_id tasks");
        if (!user)
            throw new Error("User not found");
        // Find the task (if it belongs to user)
        const task = yield task_model_1.Task.findOne({ _id: taskId, userId: user._id }).session(session);
        if (!task)
            throw new Error("Task not found or you don't have permission");
        // If task is completed, only allow deletion after 7 days from updatedAt
        if (task.status === "completed") {
            const now = (0, moment_timezone_1.default)();
            const updatedAt = (0, moment_timezone_1.default)(task.updatedAt);
            if (now.diff(updatedAt, "days") < 7) {
                throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Completed tasks can only be deleted after 7 days for reporting purposes.");
            }
        }
        // Delete the task
        yield task_model_1.Task.deleteOne({ _id: taskId, userId: user._id }).session(session);
        // Remove task reference from user.tasks
        user.tasks = user.tasks.filter((id) => id.toString() !== taskId.toString());
        yield user.save({ session });
        yield session.commitTransaction();
        return { message: "Task deleted successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// get all tasks
const getAllTasks = (currentUser, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = currentUser;
    // Find user
    const user = yield user_model_1.default.findOne({ email }).select("_id");
    if (!user)
        throw new Error("User not found");
    // Build query
    const queryBuilder = new QueryBuilder_1.default(task_model_1.Task.find({ userId: user._id }), query);
    const tasks = yield queryBuilder
        .search(["title"])
        .filter()
        .sort()
        .fields()
        .modelQuery.exec();
    return tasks;
});
// get weekly report
const getWeeklyReport = (currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = currentUser;
    // Find user
    const user = yield user_model_1.default.findOne({ email }).select("_id");
    if (!user)
        throw new Error("User not found");
    // Get tasks for the week
    const startOfWeek = (0, moment_timezone_1.default)().startOf("week");
    const endOfWeek = (0, moment_timezone_1.default)().endOf("week");
    const tasks = yield task_model_1.Task.find({
        userId: user._id,
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
        status: "completed",
        category: "Self Improvement",
    });
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // Always start from Malaysia Monday
    const startOfWeekMY = (0, moment_timezone_1.default)(startOfWeek)
        .tz("Asia/Kuala_Lumpur")
        .startOf("isoWeek"); // isoWeek starts Monday
    const report = daysOfWeek.map((day, idx) => {
        const dayStart = (0, moment_timezone_1.default)(startOfWeekMY).add(idx, "days").startOf("day");
        const dayEnd = (0, moment_timezone_1.default)(dayStart).endOf("day");
        const tasksForDay = tasks.filter((task) => (0, moment_timezone_1.default)(task.createdAt)
            .tz("Asia/Kuala_Lumpur")
            .isBetween(dayStart, dayEnd, null, "[]"));
        const totalMinutes = tasksForDay.reduce((sum, task) => sum + Math.floor((task.timeSpent || 0) / 60), 0);
        return { name: day, value: totalMinutes };
    });
    return report;
});
exports.TaskService = {
    createTask,
    completeTask,
    updateTask,
    deleteTask,
    getAllTasks,
    getWeeklyReport,
};
