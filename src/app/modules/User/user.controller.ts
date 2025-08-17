import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { userServices } from "./user.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getLeaderboard = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await userServices.getLeaderboard(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Leaderboard retrieved successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await userServices.getMe(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const deactivateUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  const result = await userServices.deactivateUser(userId, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deactivated successfully",
    data: result,
  });
});

const updateMe = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await userServices.updateMe(user, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const userController = {
  getAllUsers,
  getLeaderboard,
  getMe,
  updateMe,
  deactivateUser,
};
