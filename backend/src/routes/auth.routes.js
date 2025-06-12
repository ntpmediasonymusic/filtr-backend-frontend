const router = require("express").Router();
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validate.middleware");
const authCtrl = require("../controllers/auth.controller");

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Usuario creado"
 *         token:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1Ni..."
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registra un nuevo usuario y devuelve token y datos de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - dateOfBirth
 *               - phone
 *               - country
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Juan
 *               lastName:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@example.com
 *               password:
 *                 type: string
 *                 description: "Mínimo 6 caracteres, mayúsculas, minúsculas, números y símbolos"
 *                 example: P4ssw0rd!
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-14"
 *               phone:
 *                 type: string
 *                 example: "5551234567"
 *               country:
 *                 type: string
 *                 example: México
 *               favoriteMethod:
 *                 type: string
 *                 example: Spotify
 *               optInSony:
 *                 type: boolean
 *                 example: false
 *               optInFiltr:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       '201':
 *         description: Usuario creado. Revisa tu correo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       '400':
 *         description: Datos inválidos o correo ya registrado
 *       '409':
 *         description: Correo ya en uso
 */
router.post(
  "/register",
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("email").isEmail(),
  body("password").isStrongPassword({ minLength: 6 }),
  body("dateOfBirth").isISO8601(),
  body("phone").isNumeric(),
  body("country").notEmpty(),
  body("favoriteMethod").optional().isString(),
  body("optInSony").optional().isBoolean(),
  body("optInFiltr").optional().isBoolean(),
  validateRequest,
  authCtrl.register
);

/**
 * @openapi
 * /auth/confirm:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verifica el email del usuario usando el token
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de verificación enviado por e-mail
 *     responses:
 *       '200':
 *         description: Correo verificado con éxito, devuelve token de sesión (opcional)
 *       '400':
 *         description: Token inválido o expirado
 *       '404':
 *         description: Usuario no encontrado
 */
router.get("/confirm", authCtrl.confirmEmail);

/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reenvía un nuevo correo de verificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       '200':
 *         description: Si la cuenta existe y no está verificada, se envía correo.
 *       '400':
 *         description: Cuenta ya verificada o dato inválido
 */
router.post(
  "/resend-verification",
  body("email").isEmail(),
  validateRequest,
  authCtrl.resendVerification
);

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: a198a0d4-fb71-442a-916d-9e8318a28e55
 *         firstName:
 *           type: string
 *           example: Juan
 *         lastName:
 *           type: string
 *           example: Pérez
 *         email:
 *           type: string
 *           format: email
 *           example: juan.perez@example.com
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-05-14"
 *         phone:
 *           type: string
 *           example: "5551234567"
 *         favoriteMethod:
 *           type: string
 *           example: Spotify
 *         optInSony:
 *           type: boolean
 *           example: true
 *         optInFiltr:
 *           type: boolean
 *           example: false
 *         profileImage:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1Ni..."
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inicia sesión de un usuario existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@example.com
 *               password:
 *                 type: string
 *                 example: P4ssw0rd!
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '400':
 *         description: Datos de entrada inválidos
 *       '401':
 *         description: Credenciales incorrectas
 */
router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  validateRequest,
  authCtrl.login
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Cierra la sesión del usuario (stateless)
 *     responses:
 *       '200':
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesión cerrada"
 */
router.post("/logout", authCtrl.logout);


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operaciones de autenticación y recuperación de contraseña
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Solicita enlace de recuperación de contraseña
 *     description: >
 *       Envía un correo con un enlace para restablecer la contraseña si la
 *       dirección de email está registrada en el sistema.  
 *       Por razones de seguridad, la respuesta siempre será 200.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *     responses:
 *       "200":
 *         description: Mensaje genérico indicando que se enviará correo si existe la cuenta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Si existe esa cuenta, recibirás un correo con instrucciones.
 *       "400":
 *         description: Email faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/forgot-password", authCtrl.forgotPassword);


/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Restablece la contraseña de un usuario
 *     description: >
 *       Verifica un token JWT de restablecimiento y, si es válido,
 *       actualiza la contraseña del usuario. Devuelve un nuevo token
 *       de sesión para iniciar sesión automáticamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT de recuperación
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña
 *                 example: NuevaClave@123
 *     responses:
 *       "200":
 *         description: Contraseña restablecida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña restablecida exitosamente.
 *                 token:
 *                   type: string
 *                   description: Token de sesión (Bearer ...)
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       "400":
 *         description: Token inválido, expirado o datos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       "404":
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/reset-password", authCtrl.resetPassword);

module.exports = router;
