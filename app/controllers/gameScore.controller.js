import httpStatus from "http-status";
import gameScoresService from "../services/scoreBoard.service.js";
import { APIError } from "../config/error.js";
import asyncHandler from "express-async-handler";

// create score
const createScore = asyncHandler(async (req, res) => {
  const { walletAddress, timeCompleted, numberOfMoves } = req.body;
  const scoreExists = await gameScoresService.scoreExists(walletAddress);
  if (scoreExists) {
    await gameScoresService.updateUserScore(
      { timeCompleted, numberOfMoves },
      walletAddress
    );
    return res.status(httpStatus.OK).send({ message: "Player score updated" });
  }
  const score = await gameScoresService.createScore({
    timeCompleted,
    numberOfMoves,
    walletAddress,
  });
  res.status(httpStatus.CREATED).send({ message: "Score created" });
});

//fetch all scores
const fetchAllScores = asyncHandler(async (req, res) => {
  const scores = await gameScoresService.allScores();
  res.status(httpStatus.OK).send({ scores });
});

// fetch one score
const fetchOneScore = asyncHandler(async (req, res) => {
  const { walletAddress } = req.params;
  const score = await gameScoresService.fetchOneScore(walletAddress);
  res.status(httpStatus.OK).send({ score });
});

// fetch top 200 scavengers
const fetchTopScavengers = asyncHandler(async (req, res) => {
  const scavengers = await gameScoresService.topRankingScavengers();
  res.status(httpStatus.OK).send({ scavengers });
});

const gameScoreController = {
  fetchAllScores,
  fetchTopScavengers,
  createScore,
  fetchOneScore,
};

export default gameScoreController;
