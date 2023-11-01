import httpStatus from "http-status";
import { APIError } from "../config/error.js";
import dB from "../models/index.js";
import logger from "../config/logger.js";

/**
 * Function: createAccessCodes
 *
 * Description: This asynchronous function is used to create access
 * codes in a database based on the provided tokens,
 * tokenIds, and a maximum number of scavengers.
 *
 * @param {string[]} tokens - An array of strings representing the access codes to be created.
 * @param {Array<string>} tokenIds - An array containing token IDs that correspond to the tokens parameter.
 * @param {number} maxScavengers - An integer specifying the maximum number of scavengers(players) allowed for each access code.
 *
 * @returns {boolean} - Returns true if the access codes were successfully created. In case of an error, it logs an error message and does not return a value.
 */
const createAccessCodes = async (tokens, tokenIds, maxScavengers) => {
  try {
    let i = 0;
    for (const token of tokens) {
      await dB.acccesCodes.create({
        code: token,
        tokenId: tokenIds[i],
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

/**
 * Function: validateAccessCode
 *
 * Description: This asynchronous function is used to validate the existence of an access code in a database based on the provided tokenId.
 *
 * @param {string|number} tokenId - A unique identifier representing the token for which access is being validated.
 *
 * @returns {Promise<Object|null>} - A Promise that resolves to the found access code if it exists, or null if no access code is found. If no access code is found, the function throws an APIError.
 */
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

/**
 * Function: validateAccessCode
 * 
 * Description:
 * This asynchronous function is used to validate the existence of an access code in a
 * database based on the provided tokenId. It checks if an access code associated with
 * the provided tokenId exists in the database and returns it if found.
 * If no access code is found, it throws an APIError with a
 * "Not Found" message and a corresponding HTTP status code of 404.

 * @param {string|number} tokenId - A unique identifier representing the token for which access is being validated.

 * @returns {Promise<Object|null>} - A Promise that resolves to the found access code if it exists, or null if no access code is found. If no access code is found, the function throws an APIError.
 */
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

/**
 * Function: incrementCurrentScavengers
 * 
 * Description:
 * This asynchronous function is used to increment the count of current scavengers
 * for a given access code in a database. It fetches the access code by its unique ID,
 * checks if incrementing the current scavenger count is within the maximum limit,
 * and updates the count if possible. The function returns true if the increment
 * is successful and false if the maximum scavenger limit is reached.

 * @param {string|number} accessCodeID - The unique identifier (Primary Key)
of the access code for which the current scavenger count is to be incremented.

 * @returns {Promise<boolean>} - A Promise that resolves to true if
the current scavenger count was successfully incremented within the maximum limit,
and false if the maximum scavenger limit is reached.
 */
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
