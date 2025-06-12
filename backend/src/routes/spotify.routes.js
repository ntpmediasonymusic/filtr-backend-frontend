const express = require("express");
const router = express.Router();
const { getUpdatedPlaylists } = require("../controllers/spotify.controller");

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     summary: Obtiene todas las playlists (cacheadas) con datos de Spotify
 *     responses:
 *       200:
 *         description: Lista de playlists actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 playlists:
 *                   type: array
 */
router.get("/playlists", getUpdatedPlaylists);

module.exports = router;
