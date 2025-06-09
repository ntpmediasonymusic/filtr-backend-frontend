const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");

const UserPlaylist = sequelize.define(
  "UserPlaylist",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    playlistId: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "user_playlists",
    timestamps: true,
  }
);

// Relaciones
User.hasMany(UserPlaylist, { foreignKey: "userId", onDelete: "CASCADE" });
UserPlaylist.belongsTo(User, { foreignKey: "userId" });

module.exports = UserPlaylist;
