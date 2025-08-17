import { CastError } from "mongoose";
import { TGenericErrorResponse } from "../interface/error";

const handleCastError = (err: CastError): TGenericErrorResponse => {
  const statusCode = 400;

  return {
    statusCode,
    message: `Invalid value '${err.value}' for field '${err.path}'`,
  };
};

export default handleCastError;
