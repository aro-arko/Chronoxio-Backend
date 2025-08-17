"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = exports.getLeaderboard = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_model_1 = __importDefault(require("./user.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({}).select({
        _id: 1,
        name: 1,
        email: 1,
        status: 1,
    });
    return users;
});
const getLeaderboard = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // Build query: search by name, apply filters if any, default sort by timeSpent desc
    const qb = new QueryBuilder_1.default(user_model_1.default.find().select({ name: 1, timeSpent: 1 }), query)
        .search(["name"])
        .filter()
        .sort("timeSpent", "desc")
        .paginate()
        .fields();
    const [rows, total] = yield Promise.all([
        qb.modelQuery.lean().exec(), // lean for speed
        qb.countTotal(),
    ]);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = rows.map((row, idx) => (Object.assign({ serialNo: offset + idx + 1 }, row)));
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            sortedBy: (_a = query.sortBy) !== null && _a !== void 0 ? _a : "timeSpent",
            sortOrder: (_b = (query.sortBy ? query.sortOrder : "desc")) !== null && _b !== void 0 ? _b : "desc",
            search: (_c = query.search) !== null && _c !== void 0 ? _c : undefined,
        },
        data,
    };
});
exports.getLeaderboard = getLeaderboard;
const getMe = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = user;
    const userDetails = yield user_model_1.default.findOne({ email }).select("-password -tasks");
    return userDetails;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deactivateUser = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield user_model_1.default.findById(userId);
    if (foundUser.role === "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Admin users cannot be deactivated");
    }
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, Object.assign({}, data), {
        new: true,
    });
    return updatedUser;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const updateMe = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = user;
    const updatedUser = yield user_model_1.default.findOneAndUpdate({ email }, Object.assign({}, data), { new: true });
    return updatedUser;
});
exports.userServices = {
    getAllUsers,
    getLeaderboard: exports.getLeaderboard,
    getMe,
    deactivateUser,
    updateMe,
};
