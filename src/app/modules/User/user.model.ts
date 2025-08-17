import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false }
);

// Middleware to update the updatedAt field before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

// Middleware to update the updatedAt field before updating
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update && typeof update === "object" && !Array.isArray(update)) {
    if (update.password) {
      const hashed = await bcrypt.hash(
        update.password,
        Number(config.bcrypt_salt_rounds)
      );
      update.password = hashed;
    }
  }
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

const User = model<TUser, UserModel>("User", userSchema);
export default User;
