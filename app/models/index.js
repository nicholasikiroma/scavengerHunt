import { Sequelize } from "sequelize";
import logger from "../config/logger.js";
import pkg from "../config/baseConfigs.cjs";
import acccesCodesModel from "./acccesCodes.model.js";
import scavengersModel from "./scavengers.model.js";
import scoreBoardModel from "./scoreBoard.model.js";
import { APIError } from "../config/error.js";
const { sequelize } = pkg;

const dB = {};
const sequelizeInstance = new Sequelize(
  sequelize.database,
  sequelize.user,
  sequelize.password,
  {
    host: sequelize.host,
    dialect: "postgres",
  }
);

sequelizeInstance
  .authenticate()
  .then(() => {
    logger.info("Database is good");
  })
  .catch((err) => {
    logger.error("Failed to connect to database", err);
  });

dB.Sequelize = Sequelize;
dB.sequelize = sequelizeInstance;

dB.scoreBoard = scoreBoardModel(sequelizeInstance, Sequelize);
dB.scavengers = scavengersModel(sequelizeInstance, Sequelize);
dB.acccesCodes = acccesCodesModel(sequelizeInstance, Sequelize);

// associations
function associateModels() {
  dB.acccesCodes.hasMany(dB.scavengers, {
    foreignKey: "code",
    as: "accessCodes",
  });

  dB.scavengers.hasOne(dB.scoreBoard, {
    foreignKey: {
      name: "walletAddress",
      allowNull: true,
      type: Sequelize.DataTypes.STRING,
    },
    sourceKey: "walletAddress",
    onDelete: "CASCADE",
  });
}

associateModels();

export default dB;
