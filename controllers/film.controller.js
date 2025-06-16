const { Film } = require('../models');
const fs = require('fs');

// Fungsi untuk mendapatkan semua film
exports.getAllFilms = async (req, res) => {
    try {
        const films = await Film.findAll({
            order: [['createdAt', 'DESC']] // Urutkan dari yang terbaru
        });
        res.send(films);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi untuk membuat film baru
exports.createFilm = async (req, res) => {
    try {
        const { nama_film, pemeran, deskripsi } = req.body;
        
        if (!req.file) {
            return res.status(400).send({ message: "Gambar harus di-upload." });
        }

        const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

        const newFilm = await Film.create({
            nama_film,
            pemeran,
            deskripsi, // <-- Menyimpan deskripsi
            gambar: imageUrl,
            userId: req.userId
        });
        res.status(201).send(newFilm);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi untuk mengupdate film
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
            // PERBAIKAN #2: Tambahkan logika untuk menghapus file gambar lama
            if (film.gambar) {
                const oldFilename = film.gambar.split('/').pop();
                fs.unlink(path.join(__dirname, '..', 'uploads', oldFilename), (err) => {
                    if (err) console.error("Gagal menghapus file lama:", err);
                });
            }
            // Buat URL lengkap untuk file baru
            imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
        }
        
        const { nama_film, pemeran, deskripsi } = req.body;
        await film.update({
            nama_film: nama_film || film.nama_film,
            pemeran: pemeran || film.pemeran,
            deskripsi: deskripsi || film.deskripsi,
            gambar: imageUrl
        });

        // PERBAIKAN #1: Kirim kembali objek 'film' yang sudah diupdate secara langsung
        res.send(film);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi untuk menghapus film
exports.deleteFilm = async (req, res) => {
    try {
        const film = await Film.findByPk(req.params.id);
        if (!film) {
            return res.status(404).send({ message: "Film not found" });
        }
        if (film.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden" });
        }

        // Hapus file gambar dari server
        const filename = film.gambar.split('/').pop();
        if (filename) {
            fs.unlink(`uploads/${filename}`, (err) => {
                if (err) console.error("Gagal menghapus file gambar lama:", err);
            });
        }
        
        await film.destroy();
        res.send({ message: "Film deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi get by ID tidak perlu diubah
exports.getFilmById = async (req, res) => {
    // ... (kode tidak berubah)
};