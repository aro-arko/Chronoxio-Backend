/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "../config";
import AppError from "../errors/AppError";
import { TUserRole } from "../modules/User/user.interface";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../modules/User/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Authorization header is missing"
      );
    }
    const token = authHeader;

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      const { email, role } = decoded;

      // check if the user exists
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
      }
      if (user.status === "inactive") {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Your account is inactive. Please contact support."
        );
      }
      // check if the user role is valid
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this resource"
        );
      }
      req.user = decoded;

      next();
    } catch (error: any) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
    }
  });
};
export default auth;
