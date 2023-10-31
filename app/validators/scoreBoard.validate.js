import { body, param } from "express-validator";

const createScore = () => {
  return [
    body("timeCompleted").notEmpty().isNumeric().trim().escape(),
    body("numberOfMoves").notEmpty().isInt().trim().escape(),
    body("walletAddress").notEmpty().isString().trim().escape(),
  ];
};

const fetchPlayerScore = () => {
  return [param("walletAddress").notEmpty().isString().trim().escape()];
};

const validator = {
  createScore,
  fetchPlayerScore,
};

export default validator;
