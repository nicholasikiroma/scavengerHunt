import httpStatus from "http-status";
import gameScoresService from "../services/scoreBoard.service.js";
import { APIError } from "../config/error.js";
import asyncHandler from "express-async-handler";
import scavengerService from "../services/scavengers.service.js";

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

// update user score
const updateUserScore = asyncHandler(async (req, res) => {
  const walletAddress = req.params;
  const data = req.body;
  await scavengerService.OneScavenger(walletAddress);
  await gameScoresService.updateUserScore(data, walletAddress);
  res.status(httpStatus.OK).send({ message: "Score updated" });
});

// fetch top 200 scavengers
const fetchTopScavengers = asyncHandler(async (req, res) => {
  const scavengers = await gameScoresService.topRankingScavengers();
  res.status(httpStatus.OK).send({ scavengers });
});

const gameScoreController = {
  fetchAllScores,
  updateUserScore,
  fetchTopScavengers,
  createScore,
};

export default gameScoreController;
