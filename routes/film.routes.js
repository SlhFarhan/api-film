// routes/film.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/film.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', controller.getAllFilms);
router.get('/:id', controller.getFilmById);

// Protected routes (butuh token)
router.post('/', [verifyToken, upload.single('gambar')], controller.createFilm);
router.put('/:id', [verifyToken, upload.single('gambar')], controller.updateFilm);
router.delete('/:id', [verifyToken], controller.deleteFilm);

// PASTIKAN BARIS INI ADA DI PALING BAWAH
module.exports = router;