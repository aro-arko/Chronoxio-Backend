import { model, Schema } from "mongoose";
import { TTask } from "./task.interface";

const taskSchema = new Schema<TTask>(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true, versionKey: false }
);

export const Task = model<TTask>("Task", taskSchema);
