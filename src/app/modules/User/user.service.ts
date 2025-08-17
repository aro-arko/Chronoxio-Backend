import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import User from "./user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const getAllUsers = async () => {
  const users = await User.find({}).select({
    _id: 1,
    name: 1,
    email: 1,
    status: 1,
  });
  return users;
};
type AnyQuery = Record<string, unknown>;

export const getLeaderboard = async (query: AnyQuery) => {
  // Build query: search by name, apply filters if any, default sort by timeSpent desc
  const qb = new QueryBuilder(
    User.find().select({ name: 1, timeSpent: 1 }),
    query
  )
    .search(["name"])
    .filter()
    .sort("timeSpent", "desc")
    .paginate()
    .fields();

  const [rows, total] = await Promise.all([
    qb.modelQuery.lean().exec(), // lean for speed
    qb.countTotal(),
  ]);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = rows.map((row: any, idx: number) => ({
    serialNo: offset + idx + 1, // 1-based running number
    ...row,
  }));

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      sortedBy: (query.sortBy as string) ?? "timeSpent",
      sortOrder:
        ((query.sortBy ? query.sortOrder : "desc") as string) ?? "desc",
      search: (query.search as string) ?? undefined,
    },
    data,
  };
};

const getMe = async (user: JwtPayload) => {
  const { email } = user;

  const userDetails = await User.findOne({ email }).select("-password -tasks");

  return userDetails;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deactivateUser = async (userId: string, data: any) => {
  const foundUser = await User.findById(userId);
  if (foundUser!.role === "admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Admin users cannot be deactivated"
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...data,
    },
    {
      new: true,
    }
  );
  return updatedUser;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const updateMe = async (user: JwtPayload, data: any) => {
  const { email } = user;

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { ...data },
    { new: true }
  );

  return updatedUser;
};

export const userServices = {
  getAllUsers,
  getLeaderboard,
  getMe,
  deactivateUser,
  updateMe,
};
