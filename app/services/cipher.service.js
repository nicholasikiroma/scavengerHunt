import _sodium from "libsodium-wrappers";
import { APIError } from "../config/error.js";
import httpStatus from "http-status";
import logger from "../config/logger.js";

const sodium = _sodium;
await sodium.ready;

/**
 * Function: generateCipher
 * 
 * Description:
 * This asynchronous function is used to generate ciphers for an array of tokens, where each token is associated with a corresponding token ID. The ciphers are created using encryption with a provided hex key. The function combines nonce and ciphertext for each token and returns an array of unique ciphers as base64-encoded strings.

 * @param {string[]} tokens - An array of strings representing the tokens to be encrypted.
 * @param {string[]} tokenIds - An array containing token IDs that correspond to the tokens parameter.
 * @param {string} hexKey - The encryption key as a hex string used for encrypting the tokens.

 * @returns {Promise<string[]>} - A Promise that resolves to an array of unique ciphers as base64-encoded strings for the provided tokens. In case of an error, the function throws an APIError.
 */
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

/**
 * Function: decryptCipher
 * 
 * Description:
 * This asynchronous function is used to decrypt a base64-encoded cipher using a provided hex key. It decrypts the cipher and returns the original message. If the cipher or key is invalid, it throws an APIError.

 * @param {string} cipherBase64 - The base64-encoded cipher that needs to be decrypted.
 * @param {string} hexKey - The encryption key as a hex string used for decrypting the cipher.

 * @returns {Promise<string>} - A Promise that resolves to the decrypted message as a string. In case of an error, the function throws an APIError.
 */
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
