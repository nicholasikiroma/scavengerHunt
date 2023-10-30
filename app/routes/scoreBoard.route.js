import express from "express";
import gameScoreController from "../controllers/gameScore.controller.js";

const scoreBoardRouter = express.Router();

// Create or update score
scoreBoardRouter.post("/", gameScoreController.createScore);

//fetch all scores
scoreBoardRouter.get("", gameScoreController.fetchAllScores);

// fetch top 200 scores
scoreBoardRouter.get("/top", gameScoreController.fetchTopScavengers);

export default scoreBoardRouter;
