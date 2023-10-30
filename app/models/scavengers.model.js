export default (sequelize, Sequelize) => {
  const Scavengers = sequelize.define(
    "scavengers",
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      walletAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.ENUM(["scavenger", "admin"]),
        defaultValue: "scavenger",
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Scavengers;
};
