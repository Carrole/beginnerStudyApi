module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      introduction: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return User;
};
