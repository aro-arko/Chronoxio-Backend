import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import httpStatus from "http-status";

const createUser = catchAsync(async (req, res) => {
  const userData = { ...req.body };
  const result = await authServices.createUserIntoDB(userData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const userData = { ...req.body };
  const result = await authServices.loginUser(userData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  const result = await authServices.changePassword(
    user,
    oldPassword,
    newPassword
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const authController = {
  createUser,
  loginUser,
  changePassword,
};
