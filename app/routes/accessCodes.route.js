import express from "express";
import accessCodeController from "../controllers/accessCodes.controller.js";
import validateCipher from "../middlewares/verifyCipher.js";
import validationLimiter from "../middlewares/validationLimiter.js";

const accessCodeRouter = express.Router();

// Validates Access code
accessCodeRouter.post(
  "",
  validationLimiter,
  validateCipher,
  accessCodeController.validateAccessCode
);

export default accessCodeRouter;
