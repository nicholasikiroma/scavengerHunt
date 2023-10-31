import _sodium from "libsodium-wrappers";
import { APIError } from "../config/error.js";
import httpStatus from "http-status";
import logger from "../config/logger.js";

const sodium = _sodium;
await sodium.ready;

async function generateCipher(tokens, tokenIds, hexKey) {
  const key = sodium.from_hex(hexKey);
  try {
    let i = 0;
    const uniqueCiphers = new Set();
    for (const token of tokens) {
      let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
      const message = tokenIds[i] + ":" + token;
      const ciphertext = sodium.crypto_secretbox_easy(message, nonce, key);

      // Combine nonce and ciphertext
      const cipher = new Uint8Array(nonce.length + ciphertext.length);
      cipher.set(nonce, 0);
      cipher.set(ciphertext, nonce.length);
      uniqueCiphers.add(sodium.to_base64(cipher));
      i += 1;
    }

    return Array.from(uniqueCiphers);
  } catch (error) {
    throw new APIError(
      "Internal Server Error",
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      error.message
    );
  }
}

async function decryptCipher(cipherBase64, hexKey) {
  const key = sodium.from_hex(hexKey);
  const cipher = sodium.from_base64(cipherBase64);
  if (
    cipher.length <
    sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES
  ) {
    throw new APIError(
      "Unauthorized",
      httpStatus.UNAUTHORIZED,
      true,
      "Invalid Token"
    );
  }
  try {
    let nonce = cipher.slice(0, sodium.crypto_secretbox_NONCEBYTES);
    let ciphertext = cipher.slice(sodium.crypto_secretbox_NONCEBYTES);
    const decryptedMessage = sodium.crypto_secretbox_open_easy(
      ciphertext,
      nonce,
      key
    );
    return sodium.to_string(decryptedMessage);
  } catch (error) {
    logger.error(error.message);
    throw new APIError(
      "Unauthorized",
      httpStatus.UNAUTHORIZED,
      true,
      "Failed to decrypt"
    );
  }
}

const cipherService = {
  generateCipher,
  decryptCipher,
};

export default cipherService;
