const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();
const { sendVerificationEmail } = require("../utils/email");

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
    } = req.body;

    // Verifica que el email no exista
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "El correo ya está registrado." });
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

    // Generar token de verificación
    const emailToken = jwt.sign(
      { userId: user.id, type: "emailVerify" },
      process.env.DESMAN_USER_JWT_SECRET,
      { expiresIn: process.env.DESMAN_USER_EMAIL_TOKEN_EXPIRES_IN }
    );

    // Enviar correo con enlace de verificación
    await sendVerificationEmail(user.email, emailToken);

    // No se devuelve el token de sesión aún: indicamos que revise su correo
    return res.status(201).json({
      message:
        "Usuario registrado. Por favor revisa tu correo para verificar tu cuenta.",
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar si está confirmado su correo
    // if (!user.isVerified) {
    //   return res.status(403).json({ message: "Verifica tu correo." });
    // }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.DESMAN_USER_JWT_SECRET,
      { expiresIn: process.env.DESMAN_USER_JWT_EXPIRES_IN }
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
    return res.status(400).json({ message: "Token de verificación faltante." });
  }

  try {
    // Verificar JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== "emailVerify") {
      return res.status(400).json({ message: "Token inválido." });
    }

    // Buscar usuario y verificar su estado
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Tu cuenta ya está verificada." });
    }

    // Marcar como verificado
    user.isVerified = true;
    await user.save();

    // generar JWT de sesión para devolverlo
    const sessionToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.DESMAN_USER_JWT_SECRET,
      { expiresIn: process.env.DESMAN_USER_JWT_EXPIRES_IN }
    );

    // Devolver mensaje y token para que se inicie sesión directamente
    return res.json({
      message: "Correo verificado exitosamente. Puedes iniciar sesión.",
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
        .json({ message: "El enlace de verificación expiró." });
    }
    return res.status(400).json({ message: "Token inválido o mal formado." });
  }
};

exports.resendVerification = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "El correo es obligatorio." });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(200)
        .json({ message: "Si existe esa cuenta, se enviará un nuevo correo." });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Tu cuenta ya está verificada." });
    }

    // Generar nuevo token de verificación
    const emailToken = jwt.sign(
      { userId: user.id, type: "emailVerify" },
      process.env.DESMAN_USER_JWT_SECRET,
      { expiresIn: process.env.DESMAN_USER_EMAIL_TOKEN_EXPIRES_IN }
    );
    await sendVerificationEmail(user.email, emailToken);
    return res.json({ message: "Se ha reenviado el correo de verificación." });
  } catch (err) {
    next(err);
  }
};