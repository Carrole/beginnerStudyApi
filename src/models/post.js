module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('posts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    toUser: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
  });

  return Post;
};
