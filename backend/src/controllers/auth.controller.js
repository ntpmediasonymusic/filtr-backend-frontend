const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/email");
const axios = require("axios");
const querystring = require("querystring");
const { Op } = require("sequelize");
const { submitSignupToSmf } = require("../utils/smf");


exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phone,
      country,
      favoriteMethod,
      optInSony = false,
      optInFiltr = false,
      authProvider = "local",
      spotifyId,
      spotifyAccessToken,
      spotifyRefreshToken,
      spotifyTokenExpiresAt,
    } = req.body;

    if (req.body.spotifyToken) {
      try {
        console.log(
          "spotifyToken recibido en /register:",
          req.body.spotifyToken
        );

        const rawToken = req.body.spotifyToken.replace(/^Bearer\s+/i, "");
        const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);

        console.log("spotifyToken decodificado:", decoded);

        const user = await User.findByPk(decoded.id);

        if (!user) {
          return res
            .status(404)
            .json({ message: "Usuario de Spotify no encontrado" });
        }

        // Actualizamos los datos faltantes
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
        user.phone = req.body.phone || user.phone;
        user.country = req.body.country || user.country;
        user.favoriteMethod = req.body.favoriteMethod || user.favoriteMethod;
        user.optInSony = !!req.body.optInSony;
        user.optInFiltr = !!req.body.optInFiltr;
        await user.save();

        const dob =
          user.dateOfBirth instanceof Date
            ? user.dateOfBirth.toISOString().slice(0, 10)
            : user.dateOfBirth;

        // Enviar datos a SMF
        await submitSignupToSmf(
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: dob,
            phone: user.phone,
            country: user.country,
            favoriteMethod: user.favoriteMethod,
            optInSony: user.optInSony,
            optInFiltr: user.optInFiltr,
          },
          { failSilently: true }
        );

        // Crear token de sesión normal (login)
        const sessionToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.json({
          message: "Cuenta completada y sesión iniciada",
          token: `Bearer ${sessionToken}`,
          user,
        });
      } catch (err) {
        console.error("Error verificando spotifyToken:", err.name, err.message);
        return res
          .status(400)
          .json({ message: "spotifyToken inválido o expirado" });
      }
    }

    // Verifica que el email no exista
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Si viene desde Spotify, crear sin password ni verificación
    if (authProvider === "spotify") {
      const exists = await User.findOne({ where: { spotifyId } });
      if (exists) {
        return res
          .status(400)
          .json({ message: "El usuario ya existe con Spotify" });
      }

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: "", // no se requiere
        dateOfBirth,
        phone,
        country,
        favoriteMethod,
        optInSony,
        optInFiltr,
        isVerified: true,
        authProvider,
        spotifyId,
        spotifyAccessToken,
        spotifyRefreshToken,
        spotifyTokenExpiresAt,
      });

      const dob =
        user.dateOfBirth instanceof Date
          ? user.dateOfBirth.toISOString().slice(0, 10)
          : user.dateOfBirth;

      // Enviar datos a SMF
      await submitSignupToSmf(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          dateOfBirth: dob,
          phone: user.phone,
          country: user.country,
          favoriteMethod: user.favoriteMethod,
          optInSony: user.optInSony,
          optInFiltr: user.optInFiltr,
        },
        { failSilently: true }
      );

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.status(201).json({
        message: "Usuario creado con Spotify exitosamente",
        token: `Bearer ${token}`,
        user,
      });
    }

    // Hasheamos la contraseña
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    // Creamos el usuario
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      dateOfBirth,
      phone,
      country,
      favoriteMethod,
      optInSony,
      optInFiltr,
      isVerified: false,
    });
    const dob =
      user.dateOfBirth instanceof Date
        ? user.dateOfBirth.toISOString().slice(0, 10)
        : user.dateOfBirth;

    // Enviar datos a SMF
    await submitSignupToSmf(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: dob,
        phone: user.phone,
        country: user.country,
        favoriteMethod: user.favoriteMethod,
        optInSony: user.optInSony,
        optInFiltr: user.optInFiltr,
      },
      { failSilently: true }
    );

    // Generar token de verificación
    const emailToken = jwt.sign(
      { userId: user.id, type: "emailVerify" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EMAIL_TOKEN_EXPIRES_IN }
    );

    // Enviar correo con enlace de verificación
    await sendVerificationEmail(user.email, user.firstName, emailToken);

    // No se devuelve el token de sesión aún: indicamos que revise su correo
    return res.status(201).json({
      message:
        "Usuario registrado. Por favor revisa tu correo para verificar tu cuenta",
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, spotifyToken } = req.body;

    // 🔹 FLUJO LOGIN VIA SPOTIFY (cuando viene spotifyToken)
    if (spotifyToken) {
      try {
        const rawToken = spotifyToken.replace(/^Bearer\s+/i, "");
        const payload = jwt.verify(rawToken, process.env.JWT_SECRET);

        if (!payload.id) {
          return res
            .status(400)
            .json({ message: "spotifyToken inválido o mal formado" });
        }

        const user = await User.findByPk(payload.id);

        if (!user) {
          return res
            .status(404)
            .json({ message: "Usuario asociado a Spotify no encontrado" });
        }

        // Opcional: comprobar que el email mandado coincide
        if (email && user.email !== email) {
          return res
            .status(401)
            .json({
              message: "El correo no coincide con la cuenta de Spotify",
            });
        }

        if (!user.isVerified) {
          return res
            .status(403)
            .json({ message: "Verifica tu correo para tener acceso" });
        }

        const sessionToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const { password: _pwd, ...userData } = user.toJSON();

        return res.json({
          token: `Bearer ${sessionToken}`,
          user: userData,
        });
      } catch (err) {
        console.error("Error verificando spotifyToken en /login:", err);
        return res
          .status(400)
          .json({ message: "spotifyToken inválido o expirado" });
      }
    }

    // 🔹 FLUJO NORMAL (email + password)
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Verifica tu correo para tener acceso" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const { password: _pwd, ...userData } = user.toJSON();

    return res.json({
      token: `Bearer ${token}`,
      user: userData,
    });
  } catch (err) {
    next(err);
  }
};

// Logout (opcional; en sistemas stateless basta con borrar el token en el cliente)
exports.logout = (req, res) => {
  res.json({ message: "Sesión cerrada" });
};

exports.confirmEmail = async (req, res, next) => {
  const { token } = req.query; 

  if (!token) {
    return res.status(400).json({ message: "Token de verificación faltante" });
  }

  try {
    // Verificar JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== "emailVerify") {
      return res.status(400).json({ message: "Token inválido" });
    }

    // Buscar usuario y verificar su estado
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Tu cuenta ya está verificada" });
    }

    // Marcar como verificado
    user.isVerified = true;
    await user.save();

    // generar JWT de sesión para devolverlo
    const sessionToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Devolver mensaje y token para que se inicie sesión directamente
    return res.json({
      message: "Correo verificado exitosamente.",
      token: `Bearer ${sessionToken}`,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        country: user.country,
        favoriteMethod: user.favoriteMethod,
        optInSony: user.optInSony,
        optInFiltr: user.optInFiltr,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "El enlace de verificación expiró" });
    }
    return res.status(400).json({ message: "Token inválido o mal formado" });
  }
};

exports.resendVerification = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "El correo es obligatorio" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(200)
        .json({ message: "Si existe esa cuenta, se enviará un nuevo correo" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Tu cuenta ya está verificada" });
    }

    // Generar nuevo token de verificación
    const emailToken = jwt.sign(
      { userId: user.id, type: "emailVerify" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EMAIL_TOKEN_EXPIRES_IN }
    );
    await sendVerificationEmail(user.email, user.firstName, emailToken);
    return res.json({ message: "Se ha reenviado el correo de verificación" });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "El correo es obligatorio" });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const resetToken = jwt.sign(
        { userId: user.id, type: "passwordReset" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      // Enviar correo de recuperación
      await sendResetPasswordEmail(user.email, resetToken);
    }
    return res
      .status(200)
      .json({
        message: "Si existe esa cuenta, recibirás un correo con instrucciones.",
      });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token y nueva contraseña son obligatorios" });
  }
  try {
    // Verificar y decodificar token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== "passwordReset") {
      return res.status(400).json({ message: "Token inválido" });
    }
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Hashear y guardar nueva contraseña
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    const sessionToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const { password: _pwd, ...userData } = user.toJSON();

    return res.json({
      message: "Contraseña restablecida exitosamente.",
      token: `Bearer ${sessionToken}`,
      user: userData,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "El enlace de recuperación expiró." });
    }
    return res.status(400).json({ message: "Token inválido o mal formado." });
  }
};

exports.spotifyLogin = async (req, res) => {
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  const state = Math.random().toString(36).substring(2, 15);
  const scope = "user-read-email user-read-private";

  const url = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri,
    state,
  })}`;

  res.redirect(url);
};

exports.spotifyCallback = async (req, res) => {
  const { code } = req.query;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  try {
    // --- Config común para llamadas a Spotify ---
    const axiosNoProxy = {
      timeout: 15000, // 15s
      proxy: false, // <--- clave: ignorar HTTP(S)_PROXY del sistema
    };

    // 1) Intercambio code -> token
    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }).toString();

    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      tokenBody,
      {
        ...axiosNoProxy,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Token OK:", tokenResponse.data);

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // 2) Perfil del usuario
    const userProfile = await axios.get("https://api.spotify.com/v1/me", {
      ...axiosNoProxy,
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log("Perfil OK:", userProfile.data);

    const spotifyData = userProfile.data;
    const spotifyId = spotifyData.id;
    const email = spotifyData.email;

    let user = await User.findOne({
      where: {
        [Op.or]: [{ spotifyId }, { email }],
      },
    });
    console.log("Usuario encontrado:", user);
    if (!user) {
      user = await User.create({
        email,
        firstName: spotifyData.display_name || "",
        lastName: "",
        password: "SPOTIFY_ACCOUNT",
        dateOfBirth: "2000-01-01",
        phone: "0",
        country: spotifyData.country || "Desconocido",
        favoriteMethod: "Spotify",
        isVerified: true,
        authProvider: "spotify",
        spotifyId,
        spotifyAccessToken: access_token,
        spotifyRefreshToken: refresh_token,
        spotifyTokenExpiresAt: new Date(Date.now() + expires_in * 1000),
      });

      const tempToken = jwt.sign(
        { id: user.id, provider: "spotify", step: "signup", email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const FRONTEND_BASE_URL =
        process.env.FRONTEND_BASE_URL || "http://localhost:5173";

      return res.redirect(
        `${FRONTEND_BASE_URL}signup?spotifyToken=${tempToken}`
      );
    } else {
      // Actualizar tokens de Spotify
      user.spotifyAccessToken = access_token;
      user.spotifyRefreshToken = refresh_token;
      user.spotifyTokenExpiresAt = new Date(Date.now() + expires_in * 1000);
      await user.save();

      const sessionToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      console.log("Sesión creada, redirigiendo...");

      const FRONTEND_BASE_URL =
        process.env.FRONTEND_BASE_URL || "http://localhost:5173";
      return res.redirect(`${FRONTEND_BASE_URL}login?token=${sessionToken}`);
    }
  } catch (err) {
    console.error("Error en Spotify callback:");
    console.error("code:", err.code);
    console.error("message:", err.message);
    console.error("config.url:", err.config?.url);
    console.error("response.status:", err.response?.status);
    console.error("response.data:", err.response?.data);

    const status = err.response?.status || 500;
    const detail =
      err.response?.data || err.code || err.message || "unknown_error";

    return res.status(status).json({
      message: "Error al autenticar con Spotify",
      details: detail,
    });
  }
};