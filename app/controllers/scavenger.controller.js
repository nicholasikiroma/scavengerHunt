import { APIError } from "../config/error.js";
import httpStatus from "http-status";
import scavengerService from "../services/scavengers.service.js";
import asyncHandler from "express-async-handler";

const createScavenger = asyncHandler(async (req, res) => {
  const json = req.body;
  const session = req.session;
  if (json.userToken !== session.data.userToken) {
    throw new APIError(
      "Unauthorized",
      httpStatus.UNAUTHORIZED,
      true,
      "Session invalid"
    );
  }
  const data = {
    ...json,
    code: session.data.id,
  };

  const newScavenger = await scavengerService.newScavenger(data);
  session.destroy();
  res.status(httpStatus.CREATED).send({ newScavenger });
});

const fetchAllScavengers = asyncHandler(async (req, res) => {
  const scavengers = await scavengerService.allScavengers();
  res.status(httpStatus.OK).send({ scavengers });
});

const fetchOneScavenger = asyncHandler(async (req, res) => {
  const { walletAddress } = req.params;
  const scavenger = await scavengerService.OneScavenger(walletAddress);
  res.status(httpStatus.OK).send({ scavenger });
});

const scavengerController = {
  fetchAllScavengers,
  fetchOneScavenger,
  createScavenger,
};

export default scavengerController;
