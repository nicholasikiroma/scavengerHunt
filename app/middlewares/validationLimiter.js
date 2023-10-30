import rateLimit from "express-rate-limit";
import logger from "../config/logger.js";

const validationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many validation attempts from this IP, please try again later.",
  handler: (req, res, next, options) => {
    logger.warn(
      `Too Many Requests: ${options.message}\t${req.method}\t${req.url}\t${req.headers.origin} `
    );
    res.status(options.statusCode).send({ message: options.message });
  },
  standardHeaders: true, // return reate limit info in the RateLimit Headers
  legacyHeaders: false, //disable x-ratelimit headers
});

export default validationLimiter;
