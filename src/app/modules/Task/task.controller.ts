import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TaskService } from "./task.service";

const createTask = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await TaskService.createTask(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

// complete task
const completeTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await TaskService.completeTask(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task completed successfully",
    data: result,
  });
});

// update task
const updateTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = req.user;

  const result = await TaskService.updateTask(id, user, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

// delete task
const deleteTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const result = await TaskService.deleteTask(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
});

// get all tasks
const getAllTasks = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await TaskService.getAllTasks(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tasks fetched successfully",
    data: result,
  });
});

// get weekly report
const getWeeklyReport = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await TaskService.getWeeklyReport(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Weekly report fetched successfully",
    data: result,
  });
});

export const TaskController = {
  createTask,
  completeTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getWeeklyReport,
};
