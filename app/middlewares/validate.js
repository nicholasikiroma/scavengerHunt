import { validationResult } from "express-validator";
import httpStatus from "http-status";
import { APIError } from "../config/error.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
  throw new APIError(
    "Unprocessable Entity",
    httpStatus.UNPROCESSABLE_ENTITY,
    true,
    { error: extractedErrors }
  );
};

export default validate;
