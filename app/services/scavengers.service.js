import httpStatus from "http-status";
import { APIError } from "../config/error.js";
import dB from "../models/index.js";

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
