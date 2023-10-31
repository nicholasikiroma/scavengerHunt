import express from "express";
import scavengerController from "../controllers/scavenger.controller.js";
import validator from "../validators/scavengers.validate.js";
import validate from "../middlewares/validate.js";

const scavengerRouter = express.Router();

// fetch all players
scavengerRouter.get("", scavengerController.fetchAllScavengers);

//fetch player by wallet address
scavengerRouter.get(
  "/:walletAddress",
  validator.fetchScavenger(),
  validate,
  scavengerController.fetchOneScavenger
);

// create new player
scavengerRouter.post(
  "",
  validator.createScavenger(),
  validate,
  scavengerController.createScavenger
);

export default scavengerRouter;
