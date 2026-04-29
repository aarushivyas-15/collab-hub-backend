// using express validatior as middle ware other middleware are - zod,yup

// middleware - >   validate ->       route

// validate -> create file index.js in validator

import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

// middleware creation part
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  //   /if there is any error then extract it and keep it in a array
  const extractedErrors = [];
  errors.array().map((err) =>
    extractedErrors.push({
      [err.path]: err.msg,
    }),
  );
  console.log("VALIDATION ERRORS:", JSON.stringify(extractedErrors, null, 2));
  throw new ApiError(422, " Recieved data is not valid", extractedErrors);
};
