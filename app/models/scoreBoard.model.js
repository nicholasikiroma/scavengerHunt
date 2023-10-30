export default (sequelize, Sequelize) => {
  const GameScores = sequelize.define(
    "gameScores",
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      timeCompleted: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      numberOfMoves: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  return GameScores;
};
