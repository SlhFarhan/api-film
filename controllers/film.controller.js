const { Film } = require('../models');

// Fungsi untuk mendapatkan semua film (tidak berubah)
exports.getAllFilms = async (req, res) => {
    try {
        const films = await Film.findAll();
        res.send(films);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi untuk mendapatkan film by ID (tidak berubah)
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

// --- PERBAIKAN DI FUNGSI INI ---
exports.createFilm = async (req, res) => {
    try {
        const { nama_film, pemeran } = req.body;
        
        if (!req.file) {
            return res.status(400).send({ message: "Gambar harus di-upload." });
        }

        // Gunakan process.env.BASE_URL untuk membuat URL yang benar dan permanen
        const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

        const newFilm = await Film.create({
            nama_film,
            pemeran,
            gambar: imageUrl, // Simpan URL yang sudah benar
            userId: req.userId
        });
        res.status(201).send(newFilm);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// --- PERBAIKAN DI FUNGSI INI ---
exports.updateFilm = async (req, res) => {
    try {
        const film = await Film.findByPk(req.params.id);
        if (!film) {
            return res.status(404).send({ message: "Film not found" });
        }

        if (film.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden: You don't own this film" });
        }
        
        let imageUrl = film.gambar;
        if (req.file) {
            // Gunakan process.env.BASE_URL juga di sini
            imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
        }
        
        const { nama_film, pemeran } = req.body;
        await film.update({
            nama_film: nama_film || film.nama_film,
            pemeran: pemeran || film.pemeran,
            gambar: imageUrl
        });
        res.send({ message: "Film updated successfully!", film });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi delete tidak berubah
exports.deleteFilm = async (req, res) => {
    try {
        const film = await Film.findByPk(req.params.id);
        if (!film) {
            return res.status(404).send({ message: "Film not found" });
        }
        if (film.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden" });
        }
        await film.destroy();
        res.send({ message: "Film deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};