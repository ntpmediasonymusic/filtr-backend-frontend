const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: { isNumeric: true },
    },
    country: { type: DataTypes.STRING(100), allowNull: true },
    favoriteMethod: { type: DataTypes.STRING(255) },
    optInSony: { type: DataTypes.BOOLEAN, defaultValue: false },
    optInFiltr: { type: DataTypes.BOOLEAN, defaultValue: false },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    spotifyId: { type: DataTypes.STRING, unique: true, allowNull: true },
    authProvider: {
      type: DataTypes.ENUM("local", "spotify"),
      defaultValue: "local",
    },
    spotifyAccessToken: { type: DataTypes.TEXT, allowNull: true },
    spotifyRefreshToken: { type: DataTypes.TEXT, allowNull: true },
    spotifyTokenExpiresAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
