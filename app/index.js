import session from "express-session";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morganMiddleware from "./middlewares/morgan.middleware.js";
import dB from "./models/index.js";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const expiryDate = 60 * 60 * 1000; // 1 hour

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://unpkg.com"],
      scriptSrcElem: ["'self'", "https://unpkg.com", "'unsafe-inline'"],
      workerSrc: ["'self'", "blob:"],
    },
  })
);

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "sjdjf",
    name: "fishy",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: expiryDate,
    },
    resave: false,
    saveUninitialized: true,
  })
);
app.disable("x-powered-by");

app.use(morganMiddleware);

dB.sequelize.sync({ alter: true });

app.use("/api", router);

app.use(async (err, req, res, next) => {
  if (!errorHandler.isTrustedError(err)) {
    next(err);
  }
  await errorHandler.handleError(err, res);
});

export default app;
