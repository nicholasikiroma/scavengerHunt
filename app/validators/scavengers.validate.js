import { body, param } from "express-validator";

const createScavenger = () => {
  return [
    body("walletAddress").notEmpty().isString().trim().escape(),
    body("userToken").notEmpty().isHexadecimal().trim().escape(),
  ];
};

const fetchScavenger = () => {
  return [param("walletAddress").notEmpty().isString().trim().escape()];
};

const validator = {
  fetchScavenger,
  createScavenger,
};

export default validator;