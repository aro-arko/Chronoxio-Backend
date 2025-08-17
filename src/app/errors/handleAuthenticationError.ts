import { TGenericErrorResponse } from "../interface/error";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleAuthenticationError = (err: Error): TGenericErrorResponse => {
  const statusCode = 401;

  return {
    statusCode,
    message: "Invalid token or expired session",
  };
};

export default handleAuthenticationError;
