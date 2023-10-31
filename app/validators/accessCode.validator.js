import { body, param } from "express-validator";

const validateCipher = () => {
  return [body("cipher").notEmpty().isString().trim().escape()];
};

const createCipher = () => {
  return [
    body("maxScavengers").notEmpty().isInt().escape(),
    body("numberOfTokens").notEmpty().isInt().escape(),
    param("apiKey").notEmpty().isString().trim().escape(),
  ];
};

const validator = {
  createCipher,
  validateCipher,
};
export default validator;
