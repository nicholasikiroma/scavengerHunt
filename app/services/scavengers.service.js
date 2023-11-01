import httpStatus from "http-status";
import { APIError } from "../config/error.js";
import dB from "../models/index.js";

/**
 * Function: newScavenger
 * 
 * Description:
 * This asynchronous function is used to create a new scavenger in the database based on the provided data. It creates a new scavenger record and returns the created scavenger object. If the creation fails, it throws an APIError.

 * @param {Object} data - An object containing the data necessary to create a new scavenger.
 * 
 * @returns {Promise<Object>} - A Promise that resolves to the created scavenger object. In case of an error during creation, the function throws an APIError.
 */
async function newScavenger(data) {
  const scavenger = await dB.scavengers.create({ ...data });
  if (!scavenger) {
    throw new APIError(
      "Internal Server Error",
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      "Failed to create user"
    );
  }
  return scavenger;
}

/**
 * Function: allScavengers
 * 
 * Description:
 * This asynchronous function is used to fetch all scavenger records from the database. It retrieves all scavenger objects and returns them as an array. If the retrieval fails, it throws an APIError.

 * @returns {Promise<Object[]>} - A Promise that resolves to an array of scavenger objects. In case of an error during retrieval, the function throws an APIError.
 */
async function allScavengers() {
  const scavengers = await dB.scavengers.findAll();
  if (!scavengers) {
    throw new APIError(
      "Internal Server Error",
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      "Failed to fetch scavengers"
    );
  }
  return scavengers;
}

/**
 * Function: OneScavenger
 * 
 * Description:
 * This asynchronous function is used to fetch a single scavenger record from the database based on the provided wallet address. It searches for a scavenger with the given wallet address and returns it. If no scavenger is found, it throws an APIError with a "Not Found" message.

 * @param {string} walletAddress - The wallet address associated with the scavenger to be fetched.
 * 
 * @returns {Promise<Object>} - A Promise that resolves to the scavenger object with the specified wallet address. If the scavenger is not found, the function throws an APIError with a "Not Found" message.
 */
async function OneScavenger(walletAddress) {
  const scavenger = await dB.scavengers.findOne({
    where: {
      walletAddress,
    },
  });
  if (!scavenger) {
    throw new APIError(
      "Not Found",
      httpStatus.NOT_FOUND,
      true,
      "scavenger not found"
    );
  }
  return scavenger;
}

const scavengerService = {
  newScavenger,
  OneScavenger,
  allScavengers,
};

export default scavengerService;
