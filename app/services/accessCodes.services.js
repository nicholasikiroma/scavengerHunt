import httpStatus from "http-status";
import { APIError } from "../config/error.js";
import dB from "../models/index.js";
import logger from "../config/logger.js";

const createAccessCodes = async (tokens, tokenId, maxScavengers) => {
  try {
    let i = 0;
    for (const token of tokens) {
      await dB.acccesCodes.create({
        code: token,
        tokenId: tokenId[i],
        maxScavengers: maxScavengers,
      });
      i += 1;
    }

    logger.info(
      `Created ${tokens.length} access codes based on tokens and tokenIds".`
    );
    return true;
  } catch (error) {
    logger.error("Error seeding the database:", error);
  }
};

async function validateAccessCode(tokenId) {
  const accessCode = await dB.acccesCodes.findOne({
    where: {
      tokenId,
    },
  });
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
  createAccessCodes,
  validateAccessCode,
  incrementCurrentScavengers,
};

export default accessCodeService;
