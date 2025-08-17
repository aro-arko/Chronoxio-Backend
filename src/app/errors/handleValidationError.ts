import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interface/error";

const handleValidationError = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error Occurred",
  };
};

export default handleValidationError;
