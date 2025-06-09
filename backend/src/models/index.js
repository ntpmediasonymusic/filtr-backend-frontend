const sequelize = require("../config/database");
const User = require("./user.model");
const UserPlaylist = require("./userPlaylist.model");

// Sincronizar al iniciar (solo en dev)
sequelize
  .sync({ alter: process.env.NODE_ENV === "development" })
  .then(() => console.log("✅ DB sincronizada"))
  .catch((err) => console.error("❌ Error sincronizando DB", err));

module.exports = { User, UserPlaylist };
