import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import pkg from "../config/baseConfigs.cjs";
import cipherService from "../services/cipher.service.js";
import logger from "../config/logger.js";
const { encryptionKey } = pkg;

const validateCipher = asyncHandler(async (req, res, next) => {
  const { cipher } = req.body;
  const decryptedMessage = await cipherService.decryptCipher(
    cipher,
    encryptionKey
  );
  logger.info(`${decryptedMessage}`);
  if (!decryptedMessage) {
    res.status(httpStatus.UNAUTHORIZED).send({ message: "Invalid Cipher" });
  }
  req.access_id = decryptedMessage;
  next();
});

export default validateCipher;
