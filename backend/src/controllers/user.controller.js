const bcrypt = require("bcryptjs");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const querystring = require("querystring");

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Manejo de cambio de contraseña
    if (req.body.currentPassword || req.body.newPassword) {
      if (!req.body.currentPassword || !req.body.newPassword) {
        return res.status(400).json({
          message:
            "Para cambiar contraseña se requieren currentPassword y newPassword",
        });
      }
      const match = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!match) {
        return res
          .status(400)
          .json({ message: "Contraseña actual incorrecta" });
      }
    }

    // Campos permitidos
    const allowed = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "phone",
      "country",
      "favoriteMethod",
      "optInSony",
      "optInFiltr",
    ];
    const data = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    });

    // Si solicita cambio de contraseña
    if (req.body.newPassword) {
      const salt = await bcrypt.genSalt(12);
      data.password = await bcrypt.hash(req.body.newPassword, salt);
    }

    await User.update(data, { where: { id: userId } });
    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    next(err);
  }
};

exports.startSpotifyConnect = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!req.user || req.user.id !== userId) {
      return res
        .status(403)
        .json({
          message: "No tienes permiso para conectar Spotify para este usuario",
        });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const rawReturnUrl = req.body.returnUrl || "/";
    // Sanitizar: solo aceptamos paths internos del sitio
    const safeReturnUrl =
      typeof rawReturnUrl === "string" && rawReturnUrl.startsWith("/")
        ? rawReturnUrl
        : "/";

    // Payload que viajara en el `state` de Spotify
    const statePayload = {
      type: "spotify-connect",
      userId,
      returnUrl: safeReturnUrl,
    };

    const stateToken = jwt.sign(statePayload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
    const scope = "user-read-email user-read-private";

    const authorizeUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
      {
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri,
        // prefijo para distinguir en el callback
        state: `connect::${stateToken}`,
      }
    )}`;

    return res.json({ url: authorizeUrl });
  } catch (err) {
    next(err);
  }
};

exports.disconnectSpotify = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!req.user || req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para modificar este usuario" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si la cuenta fue creada SOLO con Spotify (sin contraseña real),
    // podrías bloquear la desconexión para no dejarlo sin método de login.
    if (
      user.authProvider === "spotify" &&
      (user.password === "SPOTIFY_ACCOUNT" || user.password === "")
    ) {
      return res.status(400).json({
        message:
          "No puedes desconectar Spotify porque tu cuenta fue creada usando solo Spotify. Configura una contraseña primero.",
      });
    }

    user.spotifyId = null;
    user.spotifyAccessToken = null;
    user.spotifyRefreshToken = null;
    user.spotifyTokenExpiresAt = null;

    // Si ahora su login principal es local
    if (user.authProvider === "spotify") {
      user.authProvider = "local";
    }

    await user.save();

    const { password, ...userData } = user.toJSON();

    return res.json({ user: userData });
  } catch (err) {
    next(err);
  }
};
