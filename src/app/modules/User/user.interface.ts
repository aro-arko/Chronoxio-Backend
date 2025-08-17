import { Model, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  timeSpent: number;
  tasks: Types.ObjectId[];
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassowrd: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
