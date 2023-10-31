import { body } from "express-validator";

const validateBody = () => {
  return [body("cipher").notEmpty().isString().trim().escape()];
};

export default validateBody;
