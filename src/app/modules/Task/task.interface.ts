import { Types } from "mongoose";

export type TTask = {
  title: string;
  userId: Types.ObjectId;
  startDate: Date | string;
  endDate: Date | string;
  category: "Self Improvement" | "Workout" | "Extra Curricular" | "Others";
  priority: "High" | "Medium" | "Low";
  timeSpent: number;
  status: "completed" | "pending" | "expired";
  createdAt?: Date;
  updatedAt?: Date;
};
