import bcrypt from "bcrypt";
import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import { APIError } from "../config/error.js";
import accessCodeService from "../services/accessCodes.services.js";
import hexGenerator from "../utils/randomToken.js";
import logger from "../config/logger.js";

const validateAccessCode = asyncHandler(async (req, res) => {
  const access_id = req.access_id;
  const session = req.session;
  const [uid, code] = access_id.split(":");
  const acccesCode = await accessCodeService.validateAccessCode(uid);
  const match = await bcrypt.compare(code, acccesCode.code);

  if (!match) {
    throw new APIError(
      "Unauthorized",
      httpStatus.UNAUTHORIZED,
      true,
      "Invalid Access Code"
    );
  }
  const isIncremented = await accessCodeService.incrementCurrentScavengers(
    acccesCode.id
  );
  if (!isIncremented) {
    return res
      .status(httpStatus.NOT_ACCEPTABLE)
      .send({ message: "Access code has reached maximum users" });
  }
  const sessionToken = hexGenerator();
  session.data = {
    userToken: sessionToken,
    id: acccesCode.id,
  };

  logger.info(JSON.stringify(req.session, null, 2));
  res
    .status(httpStatus.OK)
    .send({ message: "validation successful", sessionToken });
});

const createAccessCode = asyncHandler(async (req, res) => {
  const data = req.body;
  const accessCode = await accessCodeService.createAccessCode(data);
  res.status(httpStatus.CREATED).send({ accessCode });
});

const accessCodeController = {
  createAccessCode,
  validateAccessCode,
};

export default accessCodeController;
