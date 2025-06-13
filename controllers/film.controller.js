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


exports.createFilm = async (req, res) => {
    try {
        const { nama_film, pemeran } = req.body;
        
        // Cek apakah ada file yang di-upload
        if (!req.file) {
            return res.status(400).send({ message: "Gambar harus di-upload." });
        }

        // Buat URL lengkap ke gambar yang di-upload
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const newFilm = await Film.create({
            nama_film,
            pemeran,
            gambar: imageUrl, // Simpan URL gambar ke database
            userId: req.userId
        });
        res.status(201).send(newFilm);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// --- UBAH FUNGSI UPDATEFILM ---
exports.updateFilm = async (req, res) => {
    try {
        const film = await Film.findByPk(req.params.id);
        if (!film) {
            return res.status(404).send({ message: "Film not found" });
        }

        if (film.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden: You don't own this film" });
        }
        
        // Dapatkan URL gambar baru jika ada file yang di-upload
        let imageUrl = film.gambar; // Defaultnya pakai gambar lama
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            // Di sini Anda bisa menambahkan logika untuk menghapus file gambar lama jika perlu
        }
        
        // Update film dengan data baru
        const { nama_film, pemeran } = req.body;
        await film.update({
            nama_film,
            pemeran,
            gambar: imageUrl
        });
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