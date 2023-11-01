import httpStatus from "http-status";
import { APIError } from "../config/error.js";
import dB from "../models/index.js";

/**
 * Function: allScores
 *
 * Description:
 * This asynchronous function is used to fetch all score records from the database. It retrieves all score objects and returns them as an array. If the retrieval fails, it throws an APIError.
 *
 * @returns {Promise<Object[]>} - A Promise that resolves to an array of score objects. In case of an error during retrieval, the function throws an APIError.
 */
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

/**
 * Function: createScore
 *
 * Description:
 * This asynchronous function is used to create a new score in the database based on the provided data. It creates a new score record and returns the created score object. If the creation fails, it throws an APIError.
 *
 * @param {Object} data - An object containing the data necessary to create a new score.
 *
 * @returns {Promise<Object>} - A Promise that resolves to the created score object. In case of an error during creation, the function throws an APIError.
 */
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

/**
 * Function: fetchOneScore
 *
 * Description:
 * This asynchronous function is used to fetch a single score record from the database based on the provided wallet address. It searches for a score with the given wallet address and returns it. If no score is found, it throws an APIError with a "Not Found" message.
 *
 * @param {string} walletAddress - The wallet address associated with the score to be fetched.
 *
 * @returns {Promise<Object>} - A Promise that resolves to the score object with the specified wallet address. If the score is not found, the function throws an APIError with a "Not Found" message.
 */
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

/**
 * Function: updateUserScore
 *
 * Description:
 * This asynchronous function is used to update the score of a user based on the provided data and wallet address. It compares the provided data with the existing user score and updates it if the new score is better. If no user score is found, it throws an APIError. The function returns true if the update is successful.
 *
 * @param {Object} data - An object containing the new score data to be updated.
 * @param {string} walletAddress - The wallet address associated with the user score to be updated.
 *
 * @returns {Promise<boolean>} - A Promise that resolves to true if the user score is updated successfully. If no user score is found, the function throws an APIError.
 */
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

/**
 * Function: topRankingScavengers
 *
 * Description:
 * This asynchronous function is used to fetch the top 200 scavengers with the least timeCompleted and numberOfMoves. It orders the scavengers based on these criteria and limits the result to 200 entries. If no top scavengers are found, it throws an APIError with a "Not Found" message.
 *
 * @returns {Promise<Object[]>} - A Promise that resolves to an array of the top 200 scavenger objects. If no top scavengers are found, the function throws an APIError with a "Not Found" message.
 */
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

/**
 * Function: scoreExists
 *
 * Description:
 * This asynchronous function is used to check if a score with the provided wallet address exists in the database. It returns true if a score is found and false if no score exists. If any error occurs during the check, it throws an APIError.
 *
 * @param {string} walletAddress - The wallet address to check for the existence of a score.
 *
 * @returns {Promise<boolean>} - A Promise that resolves to true if a score with the specified wallet address exists, and false if no score is found. In case of an error, the function throws an APIError.
 */
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
