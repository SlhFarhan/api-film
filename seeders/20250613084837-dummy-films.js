'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Films', [
      {
        nama_film: 'Avengers: Endgame',
        pemeran: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
        gambar: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg',
        userId: null, // Data seeder tidak dimiliki user manapun
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_film: 'The Dark Knight',
        pemeran: 'Christian Bale, Heath Ledger, Aaron Eckhart',
        gambar: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Films', null, {});
  }
};