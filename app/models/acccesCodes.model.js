import bcrypt from "bcrypt";
import pkg from "../config/baseConfigs.cjs";
const { salt: SALT_ROUNDS } = pkg;

export default (sequelize, Sequelize) => {
  const AccessCodes = sequelize.define(
    "accessCodes",
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      tokenId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      maxScavengers: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currentScavengers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  // Hash the access code before saving
  AccessCodes.beforeCreate(async (accessCode) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedAccessCode = await bcrypt.hash(accessCode.code, salt);
    accessCode.code = hashedAccessCode;
  });

  return AccessCodes;
};
