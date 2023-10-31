import express from "express";
import accessCodeController from "../controllers/accessCodes.controller.js";
import validateCipher from "../middlewares/verifyCipher.js";
import validationLimiter from "../middlewares/validationLimiter.js";
import validateBody from "../validators/accessCode.validator.js";
import validate from "../middlewares/validate.js";

const accessCodeRouter = express.Router();

// Validates Access code
accessCodeRouter.post(
  "",
  validationLimiter,
  validateBody(),
  validate,
  validateCipher,
  accessCodeController.validateAccessCode
);

export default accessCodeRouter;
