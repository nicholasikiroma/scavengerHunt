import bcrypt from "bcrypt";
import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import { APIError } from "../config/error.js";
import accessCodeService from "../services/accessCodes.services.js";
import { tokenIdArrayGenerator, hexGenerator } from "../utils/randomToken.js";
import logger from "../config/logger.js";
import generateUniqueTokens from "../utils/tokenGenerator.js";
import cipherService from "../services/cipher.service.js";
import pkg from "../config/baseConfigs.cjs";
const { encryptionKey, apiKey } = pkg;

const validateAccessCode = asyncHandler(async (req, res) => {
  const access_id = req.access_id;
  const session = req.session;
  const [tokenId, code] = access_id.split(":");
  const acccesCode = await accessCodeService.validateAccessCode(tokenId);
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

const generateCipher = asyncHandler(async (req, res) => {
  const { maxScavengers, numberOfTokens } = req.body;
  const key = req.params.apiKey;

  if (key !== apiKey) {
    throw new APIError(
      "Unauthorize",
      httpStatus.UNAUTHORIZED,
      true,
      "You are not permitted to access this resource"
    );
  }

  const tokens = await generateUniqueTokens(numberOfTokens, 5);
  const tokenIds = await tokenIdArrayGenerator(numberOfTokens);
  const ciphers = await cipherService.generateCipher(
    tokens,
    tokenIds,
    encryptionKey
  );

  await accessCodeService.createAccessCodes(tokens, tokenIds, maxScavengers);

  // Send ciphers as a file to the client
  const ciphersText = ciphers.join("\n");
  res.set("Content-Type", "text/plain");
  res.set("Content-Disposition", "attachment; filename=ciphers.txt");
  res.send(ciphersText);
});

const accessCodeController = {
  validateAccessCode,
  generateCipher,
};

export default accessCodeController;
