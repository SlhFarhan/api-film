// controllers/auth.controller.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // <-- Import library

// Inisialisasi Google Auth Client
// Ganti CLIENT_ID dengan Google Client ID Anda dari console.cloud.google.com
// Biasanya sama dengan yang Anda pakai di Android (tanpa .apps.googleusercontent.com)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

// ... (fungsi register dan login yang sudah ada) ...

// TAMBAHKAN FUNGSI BARU INI
exports.googleLogin = async (req, res) => {
    const { token } = req.body; // Menerima googleIdToken dari client

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        // Cari user di database, atau buat baru jika belum ada
        const [user, created] = await User.findOrCreate({
            where: { email: email },
            defaults: {
                // Password bisa diisi random karena loginnya tidak pakai password
                password: await bcrypt.hash(Math.random().toString(36), 8), 
            }
        });

        // Buat accessToken (JWT) milik API kita
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 jam
        });

        res.status(200).send({
            id: user.id,
            email: user.email,
            accessToken: accessToken
        });

    } catch (error) {
        console.error("Google login error:", error);
        res.status(401).send({ message: "Invalid Google Token" });
    }
};