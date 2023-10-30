import httpStatus from "http-status";
import { APIError } from "../config/error.js";
import dB from "../models/index.js";

async function allScores() {
  const scores = await dB.scoreBoard.findAll();
  if (!scores) {
    throw new APIError(
      "Internal Server Error",
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      "Failed to fetch scores"
    );
  }
  return scores;
}

async function createScore(data) {
  const newScore = await dB.scoreBoard.create({ ...data });
  if (!newScore) {
    throw new APIError(
      "Internal Server Error",
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      "Failed to create Score"
    );
  }
  return newScore;
}

async function fetchOneScore(walletAddress) {
  const score = await dB.scoreBoard.findOne({ where: { walletAddress } });
  if (!score) {
    throw new APIError(
      "Not Found",
      httpStatus.NOT_FOUND,
      true,
      "Score not found"
    );
  }
  return score;
}

async function updateUserScore(data, walletAddress) {
  const userScore = await dB.scoreBoard.findOne({ where: { walletAddress } });
  if (
    data.timeCompleted < userScore.timeCompleted &&
    data.numberOfMoves < userScore.numberOfMoves
  ) {
    await dB.scoreBoard.update({ ...data }, { where: { walletAddress } });
  }
  if (!userScore) {
    throw new APIError(
      "Internal Server Error",
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      "Failed to update score"
    );
  }
  return true;
}

// return the 200 scavengers with the least timeCompleted and numberOfMoves
async function topRankingScavengers() {
  const topScavengers = await dB.scoreBoard.findAll({
    order: [
      ["timeCompleted", "ASC"],
      ["numberOfMoves", "ASC"],
    ],
    limit: 200,
  });
  if (!topScavengers) {
    throw new APIError(
      "Not Found",
      httpStatus.NOT_FOUND,
      true,
      "scavenger not found"
    );
  }
  return topScavengers;
}

async function scoreExists(walletAddress) {
  try {
    const score = await dB.scoreBoard.findOne({ where: { walletAddress } });
    return score ? true : false;
  } catch (error) {
    throw new APIError(
      "Internal Server Error",
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      error.message
    );
  }
}

const gameScoresService = {
  allScores,
  fetchOneScore,
  updateUserScore,
  topRankingScavengers,
  createScore,
  scoreExists,
};

export default gameScoresService;
