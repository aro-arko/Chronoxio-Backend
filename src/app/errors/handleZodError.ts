import { ZodError } from "zod";
import { TGenericErrorResponse } from "../interface/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errors = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    received: (issue as any).received,
  }));

  return {
    statusCode,
    message:
      errors.length > 0 && errors[0].received !== undefined
        ? `${errors[0].received} is not valid`
        : errors.length > 0
        ? errors[0].message
        : "Validation Error",
  };
};

export default handleZodError;
