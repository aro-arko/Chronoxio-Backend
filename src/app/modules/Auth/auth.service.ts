import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { createToken } from "./auth.utils";
import config from "../../config";
import User from "../User/user.model";
import { TUser } from "../User/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";
import jwt from "jsonwebtoken";

const createUserIntoDB = async (payLoad: TUser) => {
  const userData = { ...payLoad };
  userData.role = "user";

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  const newUser = await User.create(userData);
  return newUser;
};

const loginUser = async (payLoad: Partial<TUser>) => {
  const userData = { ...payLoad };
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (
    !(await User.isPasswordMatched(userData.password as string, user.password))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  if (user.status === "inactive") {
    throw new AppError(httpStatus.FORBIDDEN, "User is inactive");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return accessToken;
};

const changePassword = async (
  currentUser: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findOne({ email: currentUser.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!(await User.isPasswordMatched(oldPassword, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid old password");
  }

  user.password = newPassword;
  await user.save();

  return user;
};

// forgot password
const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // checking if the user is active
  const isActive = user.status === "active";
  if (!isActive) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not active");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken}`;

  try {
    // console.log(resetUILink);
    await sendEmail(user.email, resetUILink);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // console.error('Email sending failed:', err);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send email"
    );
  }
};

// reset password
const resetPassword = async (
  payLoad: { email: string; newPassword: string },
  token: string
) => {
  const user = await User.findOne({ email: payLoad.email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  if (user.status !== "active") {
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not active");
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (payLoad.email !== decoded.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to reset this password"
    );
  }

  const updated = await User.findOneAndUpdate(
    { email: decoded.email, role: decoded.role },
    { password: payLoad.newPassword },
    { new: true }
  );

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found for update");
  }
};

export const authServices = {
  createUserIntoDB,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
