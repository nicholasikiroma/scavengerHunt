import express from "express";
import accessCodeController from "../controllers/accessCodes.controller.js";
import validateCipher from "../middlewares/verifyCipher.js";
import validationLimiter from "../middlewares/validationLimiter.js";
import validator from "../validators/accessCode.validator.js";
import validate from "../middlewares/validate.js";

const accessCodeRouter = express.Router();

// Validates Access code
accessCodeRouter.post(
  "",
  validationLimiter,
  validator.validateCipher(),
  validate,
  validateCipher,
  accessCodeController.validateAccessCode
);

// Generate Ciphers
accessCodeRouter.post(
  "/generate-ciphers/:apiKey",
  validator.createCipher(),
  validate,
  accessCodeController.generateCipher
);

export default accessCodeRouter;
