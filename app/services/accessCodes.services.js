import httpStatus from "http-status";
import { APIError } from "../config/error.js";
import dB from "../models/index.js";

async function createAccessCode(data) {
  const newAccessCode = await dB.acccesCodes.create({ data });
  if (!newAccessCode) {
    throw new APIError(
      "Internal Server Error",
      httpStatus.CREATED,
      true,
      "Failed to create access code"
    );
  }
  return newAccessCode;
}

async function validateAccessCode(codeId) {
  const accessCode = await dB.acccesCodes.findByPk(codeId);
  if (!accessCode) {
    throw new APIError(
      "Not Found",
      httpStatus.NOT_FOUND,
      true,
      "Access code not found"
    );
  }
  return accessCode;
}

async function incrementCurrentScavengers(accessCodeID) {
  const accessCode = await dB.acccesCodes.findByPk(accessCodeID);
  if (accessCode.currentScavengers + 1 <= accessCode.maxScavengers) {
    accessCode.currentScavengers += 1;
    await accessCode.save();
    return true;
  } else return false;
}

const accessCodeService = {
  createAccessCode,
  validateAccessCode,
  incrementCurrentScavengers,
};

export default accessCodeService;
