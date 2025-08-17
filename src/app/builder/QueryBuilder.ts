/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/QueryBuilder.ts
import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Full-text(ish) regex search over provided fields
  search(searchableFields: string[]) {
    const raw = this.query.search as string | undefined;
    const searchTerm = raw?.trim();
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            } as FilterQuery<T>)
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = [
      "search",
      "sortBy",
      "sortOrder",
      "limit",
      "page",
      "fields",
    ];
    excludeFields.forEach((field) => delete queryObj[field]);

    const filterQuery: FilterQuery<T> = {};

    if ((queryObj as any).status) {
      (filterQuery as any)["status"] = (queryObj as any).status;
    }
    if ((queryObj as any).priority) {
      (filterQuery as any)["priority"] = (queryObj as any).priority;
    }

    this.modelQuery = this.modelQuery.find(filterQuery);
    return this;
  }

  /**
   * Sorts with optional defaults when no sortBy/sortOrder provided in the query.
   * Example: .sort("timeSpent", "desc")
   */
  sort(defaultBy: string = "createdAt", defaultOrder: "asc" | "desc" = "asc") {
    const sortByQ = (this.query.sortBy as string) || undefined;
    const sortOrderQ =
      (this.query.sortOrder as string) === "desc" ? "desc" : "asc";

    const by = sortByQ ?? defaultBy;
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
    const fields = (this.query.fields as string)?.split(",")?.join(" ");
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  /** Count total documents matching the SAME filters/search (ignores pagination/sort). */
  async countTotal() {
    const anyQuery = this.modelQuery as any;
    const conditions =
      typeof anyQuery.getQuery === "function" ? anyQuery.getQuery() : {};
    const model = anyQuery.model; // underlying Mongoose model
    return model.countDocuments(conditions).exec();
  }
}

export default QueryBuilder;
