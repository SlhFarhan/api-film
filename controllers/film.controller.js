const { Film } = require('../models');

// GET all films (Public)
exports.getAllFilms = async (req, res) => {
    try {
        const films = await Film.findAll();
        res.send(films);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// GET one film by ID (Public)
exports.getFilmById = async (req, res) => {
    try {
        const film = await Film.findByPk(req.params.id);
        if (!film) {
            return res.status(404).send({ message: "Film not found" });
        }
        res.send(film);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// POST a new film (Protected)
exports.createFilm = async (req, res) => {
    try {
        const { nama_film, pemeran, gambar } = req.body;
        const newFilm = await Film.create({
            nama_film,
            pemeran,
            gambar,
            userId: req.userId // Diambil dari token JWT
        });
        res.status(201).send(newFilm);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// PUT to update a film (Protected & Ownership check)
exports.updateFilm = async (req, res) => {
    try {
        const film = await Film.findByPk(req.params.id);
        if (!film) {
            return res.status(404).send({ message: "Film not found" });
        }

        // Cek kepemilikan
        if (film.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden: You don't own this film" });
        }
        
        await film.update(req.body);
        res.send({ message: "Film updated successfully!", film });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// DELETE a film (Protected & Ownership check)
exports.deleteFilm = async (req, res) => {
    try {
        const film = await Film.findByPk(req.params.id);
        if (!film) {
            return res.status(404).send({ message: "Film not found" });
        }
        
        // Cek kepemilikan
        if (film.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden: You don't own this film" });
        }

        await film.destroy();
        res.send({ message: "Film deleted successfully!" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};