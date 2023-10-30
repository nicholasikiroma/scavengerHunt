import { Router } from "express";
import pkg from "../config/baseConfigs.cjs";
const { env: NODE_ENV } = pkg;
import scavengerRouter from "./scavengers.route.js";
import accessCodeRouter from "./accessCodes.route.js";
import scoreBoardRouter from "./scoreBoard.route.js";

const router = Router();

const defaultRoutes = [
  {
    path: "/scavengers",
    route: scavengerRouter,
  },
  {
    path: "/auth",
    route: accessCodeRouter,
  },
  {
    path: "/scores",
    route: scoreBoardRouter,
  },
];

const devRoutes = [
  {
    path: "/dev/scavengers",
    route: scavengerRouter,
  },
  {
    path: "/dev/auth",
    route: accessCodeRouter,
  },
  {
    path: "/dev/scores",
    route: scoreBoardRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (NODE_ENV == "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
