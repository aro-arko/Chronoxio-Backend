import { JwtPayload } from "jsonwebtoken";
import { TTask } from "./task.interface";
import User from "../User/user.model";
import { Task } from "./task.model";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import moment from "moment";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createTask = async (currentUser: JwtPayload, payLoad: TTask) => {
  const { email } = currentUser;

  // find user
  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  // start session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // create task inside transaction
    const task = await Task.create(
      [
        {
          ...payLoad,
          userId: user._id,
        },
      ],
      { session }
    );

    // push to user.tasks
    user.tasks.push(task[0]._id);
    await user.save({ session });

    await session.commitTransaction();

    return task[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// complete task
const completeTask = async (id: string, data: { timeSpent: number }) => {
  const task = await Task.findById(id).select({
    userId: 1,
    timeSpent: 1,
    status: 1,
    category: 1,
  });
  if (!task) throw new Error("Task not found");

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Update task
    task.timeSpent = data.timeSpent;
    task.status = "completed";
    await task.save({ session });

    // If task category is "Self Improvement", update user timeSpent
    if (task.category === "Self Improvement") {
      // update user
      const user = await User.findById(task.userId).session(session);
      if (!user) throw new Error("User not found");

      user.timeSpent += data.timeSpent;
      await user.save({ session });
    }

    await session.commitTransaction();
    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// update task
const updateTask = async (
  taskId: string,
  currentUser: JwtPayload,
  payload: Partial<TTask>
) => {
  const { email } = currentUser;

  // Find user
  const user = await User.findOne({ email }).select("_id");
  if (!user) throw new Error("User not found");

  // Find task & validate ownership
  const task = await Task.findOne({ _id: taskId, userId: user._id });
  if (!task) throw new Error("Task not found or you don't have permission");

  // Update task
  Object.assign(task, payload);

  const updatedTask = await task.save();

  return updatedTask;
};

// delete task
const deleteTask = async (taskId: string, currentUser: JwtPayload) => {
  const { email } = currentUser;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch user and validate
    const user = await User.findOne({ email })
      .session(session)
      .select("_id tasks");
    if (!user) throw new Error("User not found");

    // Find the task (if it belongs to user)
    const task = await Task.findOne({ _id: taskId, userId: user._id }).session(
      session
    );
    if (!task) throw new Error("Task not found or you don't have permission");

    // If task is completed, only allow deletion after 7 days from updatedAt
    if (task.status === "completed") {
      const now = moment();
      const updatedAt = moment(task.updatedAt);
      if (now.diff(updatedAt, "days") < 7) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Completed tasks can only be deleted after 7 days for reporting purposes."
        );
      }
    }

    // Delete the task
    await Task.deleteOne({ _id: taskId, userId: user._id }).session(session);

    // Remove task reference from user.tasks
    user.tasks = user.tasks.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== taskId.toString()
    );
    await user.save({ session });

    await session.commitTransaction();
    return { message: "Task deleted successfully" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// get all tasks

const getAllTasks = async (
  currentUser: JwtPayload,
  query: Record<string, unknown>
) => {
  const { email } = currentUser;

  // Find user
  const user = await User.findOne({ email }).select("_id");
  if (!user) throw new Error("User not found");

  // Build query
  const queryBuilder = new QueryBuilder(Task.find({ userId: user._id }), query);

  const tasks = await queryBuilder
    .search(["title"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.exec();

  return tasks;
};

// get weekly report
const getWeeklyReport = async (currentUser: JwtPayload) => {
  const { email } = currentUser;

  // Find user
  const user = await User.findOne({ email }).select("_id");
  if (!user) throw new Error("User not found");

  // Get tasks for the week
  const startOfWeek = moment().startOf("week");
  const endOfWeek = moment().endOf("week");

  const tasks = await Task.find({
    userId: user._id,
    createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    status: "completed",
    category: "Self Improvement",
  });

  // Prepare report for each day of the week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const report = daysOfWeek.map((day, idx) => {
    const dayStart = moment(startOfWeek).add(idx, "days").startOf("day");
    const dayEnd = moment(dayStart).endOf("day");
    const tasksForDay = tasks.filter(
      (task) =>
        moment(task.createdAt).isSameOrAfter(dayStart) &&
        moment(task.createdAt).isSameOrBefore(dayEnd)
    );
    // Sum timeSpent in minutes
    const totalMinutes = tasksForDay.reduce(
      (sum, task) => sum + Math.floor((task.timeSpent || 0) / 60),
      0
    );
    return { name: day, value: totalMinutes };
  });

  return report;
};

export const TaskService = {
  createTask,
  completeTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getWeeklyReport,
};
