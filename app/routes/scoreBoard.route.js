import express from "express";
import gameScoreController from "../controllers/gameScore.controller.js";
import validator from "../validators/scoreBoard.validate.js";
import validate from "../middlewares/validate.js";

const scoreBoardRouter = express.Router();

// Create or update score
scoreBoardRouter.post(
  "",
  validator.createScore(),
  validate,
  gameScoreController.createScore
);

//fetch all scores
scoreBoardRouter.get("", gameScoreController.fetchAllScores);

// fetch one score
scoreBoardRouter.get(
  "/:walletAddress",
  validator.fetchPlayerScore(),
  validate,
  gameScoreController.fetchOneScore
);

// fetch top 200 scores
scoreBoardRouter.get("/top", gameScoreController.fetchTopScavengers);

export default scoreBoardRouter;
