const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { body, param } = require("express-validator");
const { validateRequest } = require("../middleware/validate.middleware");
const userCtrl = require("../controllers/user.controller");

router.use(protect); // todas las rutas requieren autenticación

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtiene la lista de todos los usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: No autorizado
 */
router.get("/", userCtrl.getAll);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtiene los datos de un usuario por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     responses:
 *       '200':
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Usuario no encontrado
 */
router.get("/:id", userCtrl.getById);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Actualiza datos de un usuario existente y opcionalmente cambia contraseña
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               favoriteMethod:
 *                 type: string
 *               optInSony:
 *                 type: boolean
 *               optInFiltr:
 *                 type: boolean
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual (para cambiar)
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña (requerida al cambiar)
 *     responses:
 *       '200':
 *         description: Usuario actualizado correctamente
 *       '400':
 *         description: Datos inválidos o contraseña actual incorrecta
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Usuario no encontrado
 */
router.put(
  "/:id",
  param("id").isUUID(),
  body("currentPassword").optional().isString(),
  body("newPassword").optional().isStrongPassword({ minLength: 6 }),
  body("firstName").optional().isString(),
  body("lastName").optional().isString(),
  body("dateOfBirth").optional().isISO8601(),
  body("phone").optional().isNumeric(),
  body("country").optional().isString(),
  body("favoriteMethod").optional().isString(),
  body("optInSony").optional().isBoolean(),
  body("optInFiltr").optional().isBoolean(),
  validateRequest,
  userCtrl.update
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Elimina un usuario por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario a eliminar
 *     responses:
 *       '200':
 *         description: Usuario eliminado correctamente
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Usuario no encontrado
 */
router.delete("/:id", param("id").isUUID(), validateRequest, userCtrl.delete);

module.exports = router;

module.exports = router;
