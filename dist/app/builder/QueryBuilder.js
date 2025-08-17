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
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // Full-text(ish) regex search over provided fields
    search(searchableFields) {
        const raw = this.query.search;
        const searchTerm = raw === null || raw === void 0 ? void 0 : raw.trim();
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = [
            "search",
            "sortBy",
            "sortOrder",
            "limit",
            "page",
            "fields",
        ];
        excludeFields.forEach((field) => delete queryObj[field]);
        const filterQuery = {};
        if (queryObj.status) {
            filterQuery["status"] = queryObj.status;
        }
        if (queryObj.priority) {
            filterQuery["priority"] = queryObj.priority;
        }
        this.modelQuery = this.modelQuery.find(filterQuery);
        return this;
    }
    /**
     * Sorts with optional defaults when no sortBy/sortOrder provided in the query.
     * Example: .sort("timeSpent", "desc")
     */
    sort(defaultBy = "createdAt", defaultOrder = "asc") {
        const sortByQ = this.query.sortBy || undefined;
        const sortOrderQ = this.query.sortOrder === "desc" ? "desc" : "asc";
        const by = sortByQ !== null && sortByQ !== void 0 ? sortByQ : defaultBy;
        const order = sortByQ ? sortOrderQ : defaultOrder;
        const prefix = order === "desc" ? "-" : "";
        this.modelQuery = this.modelQuery.sort(`${prefix}${by}`);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b;
        const fields = (_b = (_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",")) === null || _b === void 0 ? void 0 : _b.join(" ");
        if (fields) {
            this.modelQuery = this.modelQuery.select(fields);
        }
        return this;
    }
    /** Count total documents matching the SAME filters/search (ignores pagination/sort). */
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            const anyQuery = this.modelQuery;
            const conditions = typeof anyQuery.getQuery === "function" ? anyQuery.getQuery() : {};
            const model = anyQuery.model; // underlying Mongoose model
            return model.countDocuments(conditions).exec();
        });
    }
}
exports.default = QueryBuilder;
