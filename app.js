require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth.routes');
const filmRoutes = require('./routes/film.routes');

app.use('/api/auth', authRoutes);
app.use('/api/films', filmRoutes);

app.get('/', (req, res) => {
    res.send('Selamat Datang di Film API!');
});

const PORT = process.env.PORT || 8080;

// Sinkronisasi database (opsional, bagus untuk development)
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Database synced");
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});