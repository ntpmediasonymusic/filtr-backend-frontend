const { UserPlaylist } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    // Obtiene todas las playlistIds del usuario
    const entries = await UserPlaylist.findAll({
      where: { userId },
      attributes: ["playlistId", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    // Mapea al formato deseado
    const playlists = entries.map((e) => ({
      playlistId: e.playlistId,
      addedAt: e.createdAt,
    }));
    res.json({ playlists });
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { playlistId } = req.body;
    // Previene duplicados
    const exists = await UserPlaylist.findOne({
      where: { userId, playlistId },
    });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Playlist ya existe en favoritos" });
    }
    const entry = await UserPlaylist.create({ userId, playlistId });
    res.status(201).json({
      message: "Playlist añadida",
      id: entry.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { userId, playlistId } = req.params;
    const deleted = await UserPlaylist.destroy({
      where: { userId, playlistId },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }
    res.json({ message: "Playlist eliminada" });
  } catch (err) {
    next(err);
  }
};
