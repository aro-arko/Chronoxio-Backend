import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleAuthenticationError from "../errors/handleAuthenticationError";
import handleCastError from "../errors/handleCastError";
import AppError from "../errors/AppError";
import config from "../config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Global Error Occurred";

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
  } else if (error?.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
  } else if (
    error.name === "TokenExpiredError" ||
    error.name === "JsonWebTokenError"
  ) {
    const simplifiedError = handleAuthenticationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
  } else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;
  } else if (error instanceof Error) {
    message = error?.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    error: {
      datail: error,
    },
    stack: config.node_env === "development" ? error?.stack : null,
  });

  return;
};

export default globalErrorHandler;
