import express from "express";
import scavengerController from "../controllers/scavenger.controller.js";

const scavengerRouter = express.Router();

// fetch all players
scavengerRouter.get("", scavengerController.fetchAllScavengers);

//fetch player by wallet address
scavengerRouter.get("/:walletAddress", scavengerController.fetchOneScavenger);

// create new player
scavengerRouter.post("", scavengerController.createScavenger);

export default scavengerRouter;
