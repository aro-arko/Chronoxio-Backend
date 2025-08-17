import { MongoServerError } from "mongodb";
import { TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: MongoServerError): TGenericErrorResponse => {
  const statusCode = 409;
  const key = err.keyValue ? Object.keys(err.keyValue)[0] : "Field";
  const value = err.keyValue ? err.keyValue[key] : "";

  return {
    statusCode,
    message: `${value} already exists`,
  };
};

export default handleDuplicateError;
