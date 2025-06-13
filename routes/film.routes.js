// routes/film.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/film.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public routes
router.get('/', controller.getAllFilms);
router.get('/:id', controller.getFilmById);

// Protected routes (butuh token)
router.post('/', [verifyToken], controller.createFilm);
router.put('/:id', [verifyToken], controller.updateFilm);
router.delete('/:id', [verifyToken], controller.deleteFilm);

// PASTIKAN BARIS INI ADA DI PALING BAWAH
module.exports = router;