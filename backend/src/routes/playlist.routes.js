const router = require("express").Router({ mergeParams: true });
const { protect } = require("../middleware/auth.middleware");
const { body, param } = require("express-validator");
const { validateRequest } = require("../middleware/validate.middleware");
const playlistCtrl = require("../controllers/playlist.controller");

router.use(protect); // todas las rutas requieren autenticación

/**
 * @openapi
 * /users/{userId}/playlists:
 *   get:
 *     tags:
 *       - Playlists
 *     summary: Lista todas las playlists favoritas de un usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     responses:
 *       '200':
 *         description: Lista de playlists favoritas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 playlists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       playlistId:
 *                         type: string
 *                         example: "37i9dQZF1DXcBWIGoYBM5M"
 *                       addedAt:
 *                         type: string
 *                         format: date-time
 *       '400':
 *         description: Parámetros inválidos
 *       '401':
 *         description: No autorizado
 */
router.get(
  "/:userId/playlists",
  param("userId").isUUID(),
  validateRequest,
  playlistCtrl.list
);

/**
 * @openapi
 * /users/{userId}/playlists:
 *   post:
 *     tags:
 *       - Playlists
 *     summary: Añade una playlist favorita a un usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playlistId
 *             properties:
 *               playlistId:
 *                 type: string
 *                 description: ID de la playlist en Spotify
 *                 example: "37i9dQZF1DXcBWIGoYBM5M"
 *     responses:
 *       '201':
 *         description: Playlist añadida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist añadida"
 *                 id:
 *                   type: string
 *                   format: uuid
 *       '400':
 *         description: Datos de entrada inválidos
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Usuario no encontrado
 *       '409':
 *         description: Playlist ya existe en favoritos
 */
router.post(
  "/:userId/playlists",
  param("userId").isUUID(),
  body("playlistId").notEmpty(),
  validateRequest,
  playlistCtrl.add
);

/**
 * @openapi
 * /users/{userId}/playlists/{playlistId}:
 *   delete:
 *     tags:
 *       - Playlists
 *     summary: Elimina una playlist favorita de un usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist a eliminar
 *     responses:
 *       '200':
 *         description: Playlist eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist eliminada"
 *       '400':
 *         description: Parámetros inválidos
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Playlist o usuario no encontrado
 */
router.delete(
  "/:userId/playlists/:playlistId",
  param("userId").isUUID(),
  param("playlistId").notEmpty(),
  validateRequest,
  playlistCtrl.remove
);

/**
 * @openapi
 * /users/{userId}/spotify/playlists/follow:
 *   post:
 *     tags:
 *       - Playlists
 *     summary: Sigue una playlist en Spotify para el usuario autenticado
 */
router.post(
  "/:userId/spotify/playlists/follow",
  param("userId").isUUID(),
  body("playlistId").notEmpty(),
  validateRequest,
  playlistCtrl.followSpotify
);

/**
 * @openapi
 * /users/{userId}/spotify/playlists/unfollow:
 *   post:
 *     tags:
 *       - Playlists
 *     summary: Deja de seguir una playlist en Spotify para el usuario autenticado
 */
router.post(
  "/:userId/spotify/playlists/unfollow",
  param("userId").isUUID(),
  body("playlistId").notEmpty(),
  validateRequest,
  playlistCtrl.unfollowSpotify
);

module.exports = router;
